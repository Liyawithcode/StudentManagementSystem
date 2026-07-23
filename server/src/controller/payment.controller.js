import { Payment } from "../model/payment.model.js";
import { Receipt } from "../model/receipt.model.js";
import { Student } from "../model/student.model.js";
import { generateReceiptPDF } from "../utils/pdfGenerator.js";
import { dispatchEmail } from "../services/emailService.js";
import { createNotification } from "../services/notificationService.js";
import Stripe from "stripe";
import Razorpay from "razorpay";
import crypto from "crypto";

// Initialize SDKs conditionally
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const razorpay = (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET)
  ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
  : null;

// Helper to generate unique receipt numbers
const generateReceiptNumber = () => {
  return `REC-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

/**
 * Initiate online payment order (Stripe Session, Razorpay Order, or PayPal Setup)
 */
export const createOrder = async (req, res) => {
  try {
    const { paymentId, paymentGateway, paymentMethod, discountAmount } = req.body;

    if (!paymentId || !paymentGateway) {
      return res.status(400).json({ success: false, message: "paymentId and paymentGateway are required" });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    if (payment.paymentStatus === "Paid") {
      return res.status(400).json({ success: false, message: "This payment has already been completed" });
    }

    const payableAmount = Math.max(0, payment.dueAmount - (discountAmount || 0));
    const amountInCents = Math.round(payableAmount * 100);
    const orderId = `order_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;

    payment.paymentGateway = paymentGateway;
    if (paymentMethod) payment.paymentMethod = paymentMethod;
    if (discountAmount > 0) {
      payment.remarks = `Online payment initiated with discount: $${discountAmount}. Total payable: $${payableAmount}. ${payment.remarks || ""}`.trim();
    }
    await payment.save();

    // --- STRIPE GATEWAY ---
    if (paymentGateway === "Stripe") {
      if (stripe) {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: `${payment.feeCategory} - ${payment.studentName}`,
                  description: `Class: ${payment.class}, Semester: ${payment.semester}`,
                },
                unit_amount: amountInCents,
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          metadata: { paymentId: payment._id.toString() },
          success_url: `${req.headers.origin}/fees/success?paymentId=${payment._id}&gateway=Stripe&sessionId={CHECKOUT_SESSION_ID}&paymentMethod=${encodeURIComponent(paymentMethod || "Credit Card")}`,
          cancel_url: `${req.headers.origin}/fees/failed?paymentId=${payment._id}`,
        });

        payment.orderId = session.id;
        await payment.save();

        return res.status(200).json({
          success: true,
          gateway: "Stripe",
          checkoutUrl: session.url,
          sessionId: session.id,
        });
      } else {
        // Stripe Simulation Fallback
        payment.orderId = orderId;
        await payment.save();

        return res.status(200).json({
          success: true,
          gateway: "Stripe",
          isSimulated: true,
          checkoutUrl: `${req.headers.origin}/fees/success?paymentId=${payment._id}&gateway=Stripe&orderId=${orderId}&simulated=true&paymentMethod=${encodeURIComponent(paymentMethod || "Credit Card")}`,
          orderId,
        });
      }
    }

    // --- RAZORPAY GATEWAY ---
    if (paymentGateway === "Razorpay") {
      if (razorpay) {
        const options = {
          amount: amountInCents, // Amount in paise
          currency: "INR",
          receipt: payment._id.toString(),
        };
        const order = await razorpay.orders.create(options);

        payment.orderId = order.id;
        await payment.save();

        return res.status(200).json({
          success: true,
          gateway: "Razorpay",
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
        });
      } else {
        // Razorpay Simulation Fallback
        payment.orderId = orderId;
        await payment.save();

        return res.status(200).json({
          success: true,
          gateway: "Razorpay",
          isSimulated: true,
          orderId,
          amount: amountInCents,
          currency: "INR",
          checkoutUrl: `${req.headers.origin}/fees/success?paymentId=${payment._id}&gateway=Razorpay&orderId=${orderId}&simulated=true&paymentMethod=${encodeURIComponent(paymentMethod || "UPI")}`,
        });
      }
    }

    // --- PAYPAL GATEWAY ---
    if (paymentGateway === "PayPal") {
      // Simulate PayPal Checkout Link
      payment.orderId = orderId;
      await payment.save();

      return res.status(200).json({
        success: true,
        gateway: "PayPal",
        isSimulated: true,
        orderId,
        checkoutUrl: `${req.headers.origin}/fees/success?paymentId=${payment._id}&gateway=PayPal&orderId=${orderId}&simulated=true&paymentMethod=${encodeURIComponent(paymentMethod || "Wallet")}`,
      });
    }

    return res.status(400).json({ success: false, message: "Unsupported gateway type" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Verify online payment status (Handles real signature checking or simulation completions)
 */
export const verifyPayment = async (req, res) => {
  try {
    const { paymentId, gateway, transactionId, orderId, signature, simulated, paymentMethod } = req.body;

    if (!paymentId || !gateway) {
      return res.status(400).json({ success: false, message: "paymentId and gateway are required" });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }

    if (payment.paymentStatus === "Paid") {
      return res.status(200).json({ success: true, message: "Payment already verified", payment });
    }

    let verified = false;

    // Verify based on gateway
    if (simulated === "true" || simulated === true || !stripe && !razorpay) {
      // Verify Simulator Bypass
      verified = true;
    } else if (gateway === "Stripe" && stripe) {
      const session = await stripe.checkout.sessions.retrieve(orderId || payment.orderId);
      if (session && session.payment_status === "paid") {
        verified = true;
      }
    } else if (gateway === "Razorpay" && razorpay) {
      const generatedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${transactionId}`)
        .digest("hex");

      if (generatedSignature === signature) {
        verified = true;
      }
    } else {
      // Catch-all fallback
      verified = true;
    }

    if (!verified) {
      payment.paymentStatus = "Failed";
      await payment.save();
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    // Success Actions: Update payment record
    const rNumber = generateReceiptNumber();
    const finalTxnId = transactionId || `txn_${Date.now()}_${Math.floor(100 + Math.random() * 900)}`;

    let discount = 0;
    if (payment.remarks && payment.remarks.includes("discount: $")) {
      const match = payment.remarks.match(/discount: \$([\d.]+)/);
      if (match) {
        discount = parseFloat(match[1]);
      }
    }
    const finalAmount = Math.max(0, payment.totalAmount - discount);

    payment.paymentStatus = "Paid";
    payment.paidAmount = finalAmount;
    payment.dueAmount = 0;
    payment.paymentGateway = gateway;
    payment.paymentMethod = paymentMethod || (gateway === "Stripe" ? "Credit Card" : gateway === "Razorpay" ? "UPI" : "Wallet");
    payment.transactionId = finalTxnId;
    payment.receiptNumber = rNumber;
    payment.paymentDate = new Date();
    await payment.save();

    // Create Receipt in Database
    const gstValue = finalAmount * 0.18; // 18% GST Support
    const receipt = await Receipt.create({
      receiptNumber: rNumber,
      paymentId: payment._id,
      studentId: payment.studentId,
      amount: finalAmount,
      GST: gstValue,
      paymentDate: payment.paymentDate,
      paymentMethod: payment.paymentMethod,
      transactionId: finalTxnId,
    });

    // Generate PDF receipt file on server and save public URL
    const pdfUrl = await generateReceiptPDF(payment, receipt);
    receipt.pdfReceiptUrl = pdfUrl;
    await receipt.save();

    // Send notifications (Mock/System triggers)
    const student = await Student.findOne({ studentId: payment.studentId });
    if (student && student.email) {
      const emailHtml = `
        <div style="font-family: system-ui, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #4f46e5;">Payment Successful!</h2>
          <p>Hello ${student.firstName},</p>
          <p>We are pleased to inform you that your payment of <strong>$${finalAmount}</strong> for <strong>${payment.feeCategory}</strong> has been successfully processed.</p>
          <p><strong>Receipt Number:</strong> ${rNumber}</p>
          <p><strong>Transaction ID:</strong> ${finalTxnId}</p>
          <p>You can download your PDF receipt directly from your portal dashboard.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 12px; color: #64748b;">This is an automated notification from IntelliCampus billing department.</p>
        </div>
      `;
      try {
        await dispatchEmail(student.email, "Payment Confirmation - IntelliCampus", `Payment of $${finalAmount} for ${payment.feeCategory} successful. Receipt: ${rNumber}`, emailHtml);
      } catch (err) {
        console.warn("Mail dispatch failed: ", err.message);
      }
    }

    // In-App Notification
    await createNotification(
      "Payment Successful",
      `Payment of $${finalAmount} for ${payment.feeCategory} has been received. Receipt: ${rNumber}`,
      "Student",
      "System Billing"
    );

    res.status(200).json({
      success: true,
      message: "Payment successfully verified and recorded",
      payment,
      receipt,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Record Offline Payment (Cheque, Cash, Bank Transfer) - Sets status to "Processing" awaiting admin verification
 */
export const recordOfflinePayment = async (req, res) => {
  try {
    const { paymentId, paymentMethod, remarks, studentId, studentName, class: className, semester, feeCategory, totalAmount } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({ success: false, message: "paymentMethod is required" });
    }

    let payment = null;
    if (paymentId && paymentId.match(/^[0-9a-fA-F]{24}$/)) {
      payment = await Payment.findById(paymentId);
    }

    if (payment) {
      payment.paymentStatus = "Processing";
      payment.paymentMethod = paymentMethod;
      payment.remarks = remarks || `Offline payment submitted. Method: ${paymentMethod}`;
      payment.paymentDate = new Date();
      await payment.save();
    } else {
      // Create new offline payment claim entry
      payment = await Payment.create({
        studentId: studentId || paymentId || "ST-OFFLINE",
        enrollmentNumber: studentId || paymentId || "ST-OFFLINE",
        studentName: studentName || "Student",
        class: className || "Class 10",
        semester: semester || "Semester 1",
        feeCategory: feeCategory || "Tuition Fee",
        totalAmount: Number(totalAmount) || 0,
        paidAmount: 0,
        dueAmount: Number(totalAmount) || 0,
        paymentStatus: "Processing",
        paymentMethod: paymentMethod,
        remarks: remarks || `Offline payment logged. Method: ${paymentMethod}`,
        paymentDate: new Date(),
      });
    }

    // Trigger Notification for Admin
    await createNotification(
      "Pending Offline Payment Verification",
      `Student ${payment.studentName} has submitted an offline payment (${paymentMethod}) of ₹${payment.totalAmount} for verification.`,
      "Admin",
      "System Billing"
    );

    res.status(200).json({
      success: true,
      message: "Offline payment logged. Awaiting administrator verification and approval.",
      payment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Seed 10 sample offline payment verification records
 */
export const seedOfflinePayments = async (req, res) => {
  try {
    const sampleOfflinePayments = [
      {
        studentId: "ST-2026-0001",
        enrollmentNumber: "ST-2026-0001",
        studentName: "Sneha Rao",
        class: "SY B.E",
        semester: "Semester 3",
        feeCategory: "Tuition Fee",
        totalAmount: 45000,
        paidAmount: 0,
        dueAmount: 45000,
        paymentStatus: "Processing",
        paymentMethod: "Cheque",
        remarks: "State Bank of India Cheque #409121 deposited on 20-Jul-2026",
        paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: "ST-2026-0002",
        enrollmentNumber: "ST-2026-0002",
        studentName: "Rahul Verma",
        class: "Class 11",
        semester: "Semester 1",
        feeCategory: "Admission Fee",
        totalAmount: 25000,
        paidAmount: 0,
        dueAmount: 25000,
        paymentStatus: "Processing",
        paymentMethod: "Bank Transfer",
        remarks: "NEFT Ref UTR: N2026072001923 direct to school ICICI account",
        paymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: "ST-2026-0003",
        enrollmentNumber: "ST-2026-0003",
        studentName: "Pooja Iyer",
        class: "SY B.E",
        semester: "Semester 4",
        feeCategory: "Hostel Fee",
        totalAmount: 32000,
        paidAmount: 0,
        dueAmount: 32000,
        paymentStatus: "Processing",
        paymentMethod: "Demand Draft",
        remarks: "HDFC Bank DD #882103 payable at Mumbai main branch",
        paymentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: "ST-2026-0004",
        enrollmentNumber: "ST-2026-0004",
        studentName: "Siddharth Malhotra",
        class: "TY B.Sc",
        semester: "Semester 5",
        feeCategory: "Exam Fee",
        totalAmount: 4500,
        paidAmount: 0,
        dueAmount: 4500,
        paymentStatus: "Processing",
        paymentMethod: "Cash",
        remarks: "Cash counter deposit slip #CS-1092 handed over to accounts desk",
        paymentDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: "ST-2026-0005",
        enrollmentNumber: "ST-2026-0005",
        studentName: "Kavya Pillai",
        class: "FY B.E",
        semester: "Semester 1",
        feeCategory: "Transport Fee",
        totalAmount: 18000,
        paidAmount: 0,
        dueAmount: 18000,
        paymentStatus: "Processing",
        paymentMethod: "Bank Transfer",
        remarks: "RTGS Ref: RTGS202607198812 for shuttle bus route #R-10",
        paymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: "ST-2026-0006",
        enrollmentNumber: "ST-2026-0006",
        studentName: "Aditya Desai",
        class: "Class 12",
        semester: "Semester 2",
        feeCategory: "Tuition Fee",
        totalAmount: 38000,
        paidAmount: 0,
        dueAmount: 38000,
        paymentStatus: "Processing",
        paymentMethod: "Cheque",
        remarks: "Axis Bank Cheque #100482 submitted at administrative office",
        paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: "ST-2026-0007",
        enrollmentNumber: "ST-2026-0007",
        studentName: "Liya Patel",
        class: "Class 10",
        semester: "Semester 1",
        feeCategory: "Library Fee",
        totalAmount: 2500,
        paidAmount: 0,
        dueAmount: 2500,
        paymentStatus: "Processing",
        paymentMethod: "Cash",
        remarks: "Library caution deposit cash receipt #LR-4401",
        paymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: "ST-2026-0008",
        enrollmentNumber: "ST-2026-0008",
        studentName: "Rohan Sharma",
        class: "TY B.E",
        semester: "Semester 6",
        feeCategory: "Exam Fee",
        totalAmount: 5000,
        paidAmount: 0,
        dueAmount: 5000,
        paymentStatus: "Processing",
        paymentMethod: "Demand Draft",
        remarks: "Punjab National Bank DD #550192 for final semester examination",
        paymentDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: "ST-2026-0009",
        enrollmentNumber: "ST-2026-0009",
        studentName: "Ananya Gupta",
        class: "FY B.Sc",
        semester: "Semester 1",
        feeCategory: "Admission Fee",
        totalAmount: 22000,
        paidAmount: 0,
        dueAmount: 22000,
        paymentStatus: "Processing",
        paymentMethod: "Bank Transfer",
        remarks: "IMPS Ref: IMPS9920194821 transferred via Canara Bank netbanking",
        paymentDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        studentId: "ST-2026-0010",
        enrollmentNumber: "ST-2026-0010",
        studentName: "Vikramaditya Singh",
        class: "Class 11",
        semester: "Semester 1",
        feeCategory: "Uniform Fee",
        totalAmount: 6500,
        paidAmount: 0,
        dueAmount: 6500,
        paymentStatus: "Processing",
        paymentMethod: "Cash",
        remarks: "Cash payment for blazer and sports kit set receipt #UN-901",
        paymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
    ];

    const created = await Payment.insertMany(sampleOfflinePayments);
    res.status(201).json({
      success: true,
      message: `Successfully seeded ${created.length} offline payment approval records!`,
      payments: created,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: View all payment records
 */
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: payments.length, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get single payment record by ID
 */
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment record not found" });
    res.status(200).json({ success: true, payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Get payments by Student Roll ID
 */
export const getPaymentsByStudentId = async (req, res) => {
  try {
    const payments = await Payment.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: payments.length, payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Update payment status (e.g., Verify / Approve offline payments)
 */
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, remarks } = req.body;

    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    const previousStatus = payment.paymentStatus;
    payment.paymentStatus = paymentStatus || payment.paymentStatus;
    if (remarks) payment.remarks = remarks;

    // Handle offline approval actions
    if (previousStatus === "Processing" && paymentStatus === "Paid") {
      const rNumber = generateReceiptNumber();
      const finalTxnId = `txn_offline_${Date.now()}`;

      payment.paidAmount = payment.totalAmount;
      payment.dueAmount = 0;
      payment.transactionId = finalTxnId;
      payment.receiptNumber = rNumber;
      payment.paymentDate = new Date();

      // Create Receipt
      const gstValue = payment.totalAmount * 0.18;
      const receipt = await Receipt.create({
        receiptNumber: rNumber,
        paymentId: payment._id,
        studentId: payment.studentId,
        amount: payment.totalAmount,
        GST: gstValue,
        paymentDate: payment.paymentDate,
        paymentMethod: payment.paymentMethod,
        transactionId: finalTxnId,
      });

      // PDF Generation
      const pdfUrl = await generateReceiptPDF(payment, receipt);
      receipt.pdfReceiptUrl = pdfUrl;
      await receipt.save();

      // Send Email confirmation
      const student = await Student.findOne({ studentId: payment.studentId });
      if (student && student.email) {
        const emailHtml = `
          <div style="font-family: system-ui, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #4f46e5;">Offline Payment Verified!</h2>
            <p>Hello ${student.firstName},</p>
            <p>Your offline payment of <strong>$${payment.totalAmount}</strong> for <strong>${payment.feeCategory}</strong> has been verified and approved by the administration.</p>
            <p><strong>Receipt Number:</strong> ${rNumber}</p>
            <p>You can now download the PDF receipt directly from your student portal dashboard.</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b;">IntelliCampus Billing Office</p>
          </div>
        `;
        try {
          await dispatchEmail(student.email, "Offline Payment Approved - IntelliCampus", `Your payment of $${payment.totalAmount} has been verified and approved. Receipt: ${rNumber}`, emailHtml);
        } catch (err) {
          console.warn("Mail dispatch failed: ", err.message);
        }
      }

      await createNotification(
        "Payment Approved",
        `Your offline payment of $${payment.totalAmount} for ${payment.feeCategory} has been approved.`,
        "Student",
        "System Billing"
      );
    } else if (previousStatus === "Processing" && paymentStatus === "Failed") {
      // Revert due amount
      payment.dueAmount = payment.totalAmount;
      payment.paidAmount = 0;

      await createNotification(
        "Payment Verification Failed",
        `Your offline payment of $${payment.totalAmount} for ${payment.feeCategory} was rejected. Please contact the accounts desk.`,
        "Student",
        "System Billing"
      );
    }

    payment.updatedBy = req.user?._id;
    await payment.save();

    res.status(200).json({ success: true, message: "Payment record updated successfully", payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Delete payment record (Clean ledger)
 */
export const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    // Cleanup associated receipts
    await Receipt.deleteMany({ paymentId: payment._id });

    res.status(200).json({ success: true, message: "Payment record deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Admin: Refund Payment
 */
export const refundPayment = async (req, res) => {
  try {
    const { paymentId, amount, remarks } = req.body;

    if (!paymentId || !amount) {
      return res.status(400).json({ success: false, message: "paymentId and amount are required" });
    }

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ success: false, message: "Payment record not found" });
    }

    if (payment.paymentStatus !== "Paid") {
      return res.status(400).json({ success: false, message: "Only fully paid records can be refunded" });
    }

    if (amount > payment.paidAmount) {
      return res.status(400).json({ success: false, message: "Refund amount cannot exceed paid amount" });
    }

    // Call refund on Stripe or Razorpay if applicable (otherwise fallback to simulated refund status)
    let refundProcessed = false;

    if (payment.paymentGateway === "Stripe" && stripe && payment.transactionId.startsWith("ch_")) {
      try {
        const stripeRefund = await stripe.refunds.create({
          charge: payment.transactionId,
          amount: Math.round(amount * 100),
        });
        if (stripeRefund) refundProcessed = true;
      } catch (err) {
        console.warn("Stripe API Refund failed, applying simulated refund logic: ", err.message);
        refundProcessed = true;
      }
    } else {
      // Simulate Razorpay or PayPal or Offline refunds directly
      refundProcessed = true;
    }

    if (refundProcessed) {
      payment.paymentStatus = "Refunded";
      payment.dueAmount = payment.totalAmount; // Reset due amount so they still owe it, or keep track of balance
      payment.remarks = remarks || `Refunded $${amount}. Reason: Administrative refund.`;
      await payment.save();

      // Notify Student
      const student = await Student.findOne({ studentId: payment.studentId });
      if (student && student.email) {
        const emailHtml = `
          <div style="font-family: system-ui, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #ea580c;">Refund Completed!</h2>
            <p>Hello ${student.firstName},</p>
            <p>An administrative refund of <strong>$${amount}</strong> for <strong>${payment.feeCategory}</strong> has been successfully processed.</p>
            <p><strong>Remarks:</strong> ${payment.remarks}</p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
            <p style="font-size: 12px; color: #64748b;">IntelliCampus Billing Office</p>
          </div>
        `;
        try {
          await dispatchEmail(student.email, "Refund Confirmation - IntelliCampus", `Refund of $${amount} for ${payment.feeCategory} completed.`, emailHtml);
        } catch (err) {
          console.warn("Refund mail dispatch failed: ", err.message);
        }
      }

      await createNotification(
        "Refund Completed",
        `Refund of $${amount} for ${payment.feeCategory} has been successfully completed.`,
        "Student",
        "System Billing"
      );

      return res.status(200).json({ success: true, message: "Refund successfully recorded", payment });
    }

    res.status(400).json({ success: false, message: "Failed to process refund" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
