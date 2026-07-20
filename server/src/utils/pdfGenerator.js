import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

/**
 * Generates a professional PDF receipt and saves it to server/public/receipts/
 * @param {Object} payment - The payment database record
 * @param {Object} receipt - The receipt database record
 * @returns {Promise<string>} - The public URL path of the generated PDF receipt
 */
export const generateReceiptPDF = async (payment, receipt) => {
  return new Promise(async (resolve, reject) => {
    try {
      const dirPath = path.join("public", "receipts");
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      const fileName = `receipt_${receipt.receiptNumber}.pdf`;
      const filePath = path.join(dirPath, fileName);
      const writeStream = fs.createWriteStream(filePath);

      const doc = new PDFDocument({ size: "A4", margin: 40 });
      doc.pipe(writeStream);

      // Generate QR Code containing payment/receipt details
      const qrData = JSON.stringify({
        receiptNumber: receipt.receiptNumber,
        studentId: payment.studentId,
        studentName: payment.studentName,
        feeCategory: payment.feeCategory,
        amount: receipt.amount,
        date: receipt.paymentDate,
        transactionId: receipt.transactionId || "N/A",
      });

      const qrCodeDataUri = await QRCode.toDataURL(qrData, {
        errorCorrectionLevel: "H",
        margin: 1,
      });

      // --- PDF STYLING & GENERATION ---
      
      // Draw Header Border & Background
      doc.rect(0, 0, 595.28, 120).fill("#4f46e5"); // Indigo theme
      
      // Header Text
      doc.fillColor("#ffffff");
      doc.fontSize(22).font("Helvetica-Bold").text("INTELLICAMPUS", 40, 35);
      doc.fontSize(10).font("Helvetica").text("Secure Student Billing & Tuition System", 40, 65);
      doc.fontSize(10).text("Email: billing@intellicampus.edu | Phone: +1 (555) 019-2834", 40, 80);

      // "RECEIPT" badge on top right
      doc.rect(420, 30, 135, 35).fill("#4338ca");
      doc.fillColor("#ffffff");
      doc.fontSize(14).font("Helvetica-Bold").text("PAYMENT RECEIPT", 425, 42, { width: 125, align: "center" });

      // Move cursor down
      doc.y = 140;
      doc.fillColor("#1e293b");

      // Left Column: Student Details
      doc.fontSize(11).font("Helvetica-Bold").text("STUDENT DETAILS", 40, 140);
      doc.rect(40, 155, 240, 1).fill("#e2e8f0");
      doc.y = 165;
      doc.fillColor("#334155").fontSize(10).font("Helvetica");
      doc.text(`Name: ${payment.studentName}`, 40);
      doc.text(`Student ID / Roll No: ${payment.studentId}`, 40);
      doc.text(`Class: ${payment.class}`, 40);
      doc.text(`Semester: ${payment.semester}`, 40);

      // Right Column: Receipt Meta Information
      doc.fillColor("#1e293b");
      doc.fontSize(11).font("Helvetica-Bold").text("RECEIPT DETAILS", 310, 140);
      doc.rect(310, 155, 245, 1).fill("#e2e8f0");
      doc.y = 165;
      doc.fillColor("#334155").fontSize(10).font("Helvetica");
      doc.text(`Receipt Number: ${receipt.receiptNumber}`, 310);
      doc.text(`Date & Time: ${new Date(receipt.paymentDate).toLocaleString()}`, 310);
      doc.text(`Payment Method: ${receipt.paymentMethod}`, 310);
      doc.text(`Transaction ID: ${receipt.transactionId || "N/A"}`, 310);
      doc.text(`Payment Gateway: ${payment.paymentGateway || "None"}`, 310);

      // Add a line divider
      doc.rect(40, 240, 515, 1).fill("#cbd5e1");

      // Billing Table Header
      doc.y = 260;
      doc.rect(40, 260, 515, 22).fill("#f1f5f9");
      doc.fillColor("#475569").fontSize(10).font("Helvetica-Bold");
      doc.text("Fee Category & Description", 50, 266);
      doc.text("Base Amount", 300, 266, { width: 80, align: "right" });
      doc.text("GST (18%)", 390, 266, { width: 70, align: "right" });
      doc.text("Total", 470, 266, { width: 80, align: "right" });

      // Table Row
      doc.y = 295;
      doc.fillColor("#1e293b").font("Helvetica");
      doc.text(`${payment.feeCategory} - Academic Tuition / Fee`, 50, 295);
      
      const totalAmount = receipt.amount;
      const gstAmount = receipt.GST || 0;
      const baseAmount = totalAmount - gstAmount;

      doc.text(`$${baseAmount.toFixed(2)}`, 300, 295, { width: 80, align: "right" });
      doc.text(`$${gstAmount.toFixed(2)}`, 390, 295, { width: 70, align: "right" });
      doc.text(`$${totalAmount.toFixed(2)}`, 470, 295, { width: 80, align: "right" });

      // Add a line under rows
      doc.rect(40, 320, 515, 1).fill("#e2e8f0");

      // Summary Box (Right Align)
      doc.y = 340;
      doc.fillColor("#475569").font("Helvetica-Bold").text("Subtotal:", 350, 340, { width: 100, align: "right" });
      doc.font("Helvetica").text(`$${baseAmount.toFixed(2)}`, 470, 340, { width: 80, align: "right" });

      doc.fillColor("#475569").font("Helvetica-Bold").text("GST (18% Included):", 350, 358, { width: 100, align: "right" });
      doc.font("Helvetica").text(`$${gstAmount.toFixed(2)}`, 470, 358, { width: 80, align: "right" });

      // Highlight Total Paid
      doc.rect(340, 376, 215, 28).fill("#f8fafc");
      doc.fillColor("#4f46e5").font("Helvetica-Bold").fontSize(11).text("Total Paid Amount:", 350, 385);
      doc.text(`$${totalAmount.toFixed(2)}`, 470, 385, { width: 80, align: "right" });

      // QR Code embedding
      const qrCodeBuffer = Buffer.from(qrCodeDataUri.split(",")[1], "base64");
      doc.image(qrCodeBuffer, 40, 340, { width: 100, height: 100 });
      doc.fillColor("#64748b").fontSize(8).font("Helvetica").text("Scan to verify receipt details", 40, 445);

      // Digital Signature Box
      doc.rect(40, 490, 515, 1).fill("#cbd5e1");
      doc.y = 510;
      doc.fillColor("#1e293b").font("Helvetica-Bold").fontSize(10).text("AUTHORIZATION & SIGNATURE", 40, 510);
      
      // Draw a mock handwriting signature or elegant font representation
      doc.fillColor("#4f46e5").font("Courier-Oblique").fontSize(18).text("IntelliCampus Accounts", 40, 530);
      
      doc.fillColor("#64748b").font("Helvetica").fontSize(8).text("This is an electronically generated receipt. No physical signature is required.", 40, 555);
      doc.text("IntelliCampus Digital Security Seal Code: IC-SECURE-9921783B", 40, 567);

      doc.end();

      writeStream.on("finish", () => {
        const publicUrl = `/public/receipts/${fileName}`;
        resolve(publicUrl);
      });

      writeStream.on("error", (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export default generateReceiptPDF;
