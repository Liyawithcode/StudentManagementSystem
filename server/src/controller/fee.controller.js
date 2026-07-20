import { FeeStructure } from "../model/feeStructure.model.js";
import { Payment } from "../model/payment.model.js";
import { Student } from "../model/student.model.js";

// Create Fee Structure and automatically assign it to matching students
export const createFee = async (req, res) => {
  try {
    const { class: className, semester, academicYear, feeCategory, amount, dueDate, lateFine, description } = req.body;

    if (!className || !semester || !academicYear || !feeCategory || amount === undefined || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields: class, semester, academicYear, feeCategory, amount, dueDate",
      });
    }

    const feeStructure = await FeeStructure.create({
      class: className,
      semester,
      academicYear,
      feeCategory,
      amount,
      dueDate,
      lateFine: lateFine || 0,
      description: description || "",
    });

    // Automatically find students in the same class and semester
    const matchingStudents = await Student.find({
      class: className,
      semester: semester,
      enrollmentStatus: "Active",
    });

    // Create a pending payment ledger for each matching student
    const paymentRecords = matchingStudents.map((student) => {
      return {
        studentId: student.studentId,
        enrollmentNumber: student.studentId,
        studentName: `${student.firstName} ${student.lastName}`,
        class: className,
        semester: semester,
        feeCategory,
        totalAmount: amount,
        paidAmount: 0,
        dueAmount: amount,
        paymentStatus: "Pending",
        remarks: description || "",
        createdBy: req.user?._id,
      };
    });

    if (paymentRecords.length > 0) {
      await Payment.insertMany(paymentRecords);
    }

    res.status(201).json({
      success: true,
      message: `Fee structure created successfully and assigned to ${matchingStudents.length} student(s).`,
      feeStructure,
      assignedStudentsCount: matchingStudents.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Fee Structures
export const getAllFees = async (req, res) => {
  try {
    const feeStructures = await FeeStructure.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: feeStructures.length,
      fees: feeStructures, // key as 'fees' to support existing client bindings if any
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Fee Structure
export const updateFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { class: className, semester, academicYear, feeCategory, amount, dueDate, lateFine, description } = req.body;

    const feeStructure = await FeeStructure.findById(id);
    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    // Capture old values to update matching pending payments
    const oldClass = feeStructure.class;
    const oldSemester = feeStructure.semester;
    const oldCategory = feeStructure.feeCategory;

    // Update fee structure
    feeStructure.class = className || feeStructure.class;
    feeStructure.semester = semester || feeStructure.semester;
    feeStructure.academicYear = academicYear || feeStructure.academicYear;
    feeStructure.feeCategory = feeCategory || feeStructure.feeCategory;
    feeStructure.amount = amount !== undefined ? amount : feeStructure.amount;
    feeStructure.dueDate = dueDate || feeStructure.dueDate;
    feeStructure.lateFine = lateFine !== undefined ? lateFine : feeStructure.lateFine;
    feeStructure.description = description || feeStructure.description;

    await feeStructure.save();

    // If amount or details changed, update all corresponding "Pending" payments for students
    if (amount !== undefined || className || semester || feeCategory) {
      await Payment.updateMany(
        {
          class: oldClass,
          semester: oldSemester,
          feeCategory: oldCategory,
          paymentStatus: "Pending",
        },
        {
          $set: {
            class: feeStructure.class,
            semester: feeStructure.semester,
            feeCategory: feeStructure.feeCategory,
            totalAmount: feeStructure.amount,
            dueAmount: feeStructure.amount,
            remarks: feeStructure.description,
          },
        }
      );
    }

    res.status(200).json({
      success: true,
      message: "Fee structure updated successfully",
      feeStructure,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Fee Structure and optionally cleanup pending payments
export const deleteFee = async (req, res) => {
  try {
    const { id } = req.params;

    const feeStructure = await FeeStructure.findByIdAndDelete(id);
    if (!feeStructure) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    // Delete corresponding "Pending" payments for students
    await Payment.deleteMany({
      class: feeStructure.class,
      semester: feeStructure.semester,
      feeCategory: feeStructure.feeCategory,
      paymentStatus: "Pending",
    });

    res.status(200).json({
      success: true,
      message: "Fee structure and pending student ledgers deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Maintain compatibility with legacy controllers if they are referenced elsewhere
export const getFeesByStudent = async (req, res) => {
  try {
    const studentId = req.params.studentId || req.query.studentId;
    const payments = await Payment.find({ studentId }).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: payments.length,
      fees: payments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { feeStatus, paymentMethod } = req.body;
    const payment = await Payment.findById(id);
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });

    payment.paymentStatus = feeStatus;
    if (paymentMethod) payment.paymentMethod = paymentMethod;
    if (feeStatus === "Paid") {
      payment.paidAmount = payment.totalAmount;
      payment.dueAmount = 0;
    }
    await payment.save();
    res.status(200).json({ success: true, fee: payment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};