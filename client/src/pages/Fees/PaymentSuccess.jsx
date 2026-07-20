import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Card from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import { paymentService } from "../../services/paymentService.js";
import { receiptService } from "../../services/receiptService.js";
import { toast } from "../../utils/toast.js";
import { formatCurrency } from "../../utils/helpers.js";
import { FiCheckCircle, FiDownload, FiDollarSign } from "react-icons/fi";

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [payment, setPayment] = useState(null);
  const [receipt, setReceipt] = useState(null);

  const paymentId = searchParams.get("paymentId");
  const gateway = searchParams.get("gateway") || "Stripe";
  const orderId = searchParams.get("orderId") || searchParams.get("sessionId");
  const simulated = searchParams.get("simulated") || "false";
  const paymentMethod = searchParams.get("paymentMethod");

  useEffect(() => {
    const verifyAndLoad = async () => {
      try {
        setVerifying(true);
        // Call backend payment verification
        const verifyRes = await paymentService.verifyPayment({
          paymentId,
          gateway,
          orderId,
          simulated,
          paymentMethod,
        });

        if (verifyRes.success) {
          setPayment(verifyRes.payment);
          setReceipt(verifyRes.receipt);
          toast.success("Payment verified successfully!");
        }
      } catch (err) {
        toast.error(err.message || "Failed to verify transaction status");
      } finally {
        setVerifying(false);
      }
    };

    if (paymentId) {
      verifyAndLoad();
    }
  }, [paymentId, gateway, orderId, simulated]);

  const handleDownloadReceipt = async () => {
    if (!payment || !receipt) return;
    try {
      toast.info("Generating PDF...");
      await receiptService.downloadReceiptPDF(payment._id, receipt.receiptNumber);
      toast.success("Receipt downloaded!");
    } catch (err) {
      toast.error(err.message || "Download failed");
    }
  };

  if (verifying) {
    return (
      <div className="card text-center p-8 mt-10" style={{ maxWidth: "550px", margin: "4rem auto" }}>
        <Loader />
        <h3 className="mt-4 font-bold text-lg">Verifying Settlement Signature...</h3>
        <p className="text-secondary mt-2">Checking payment gateway clearance. Please do not close or reload this page.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "550px", margin: "4rem auto" }}>
      <Card title="">
        <div className="text-center p-6 space-y-4">
          <FiCheckCircle size={64} className="text-success mx-auto" />
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--success)" }}>Payment Successful!</h2>
          <p className="text-secondary" style={{ fontSize: "0.95rem" }}>
            Your transaction has been securely cleared, and payment records have been updated successfully.
          </p>

          {payment && (
            <div className="bg-light p-4 rounded text-left space-y-2 mt-4" style={{ fontSize: "0.9rem" }}>
              <div className="flex justify-between border-b pb-1">
                <span className="font-semibold text-secondary">Student ID</span>
                <span>{payment.studentId}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-semibold text-secondary">Student Name</span>
                <span>{payment.studentName}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-semibold text-secondary">Fee Category</span>
                <span>{payment.feeCategory}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-semibold text-secondary">Settlement Gateway</span>
                <span>{payment.paymentGateway}</span>
              </div>
              <div className="flex justify-between border-b pb-1">
                <span className="font-semibold text-secondary">Receipt Reference</span>
                <span>{payment.receiptNumber || receipt?.receiptNumber}</span>
              </div>
              <div className="flex justify-between pt-1" style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--primary)" }}>
                <span>Total Settled</span>
                <span>{formatCurrency(payment.totalAmount)}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            {receipt && (
              <Button variant="primary" style={{ flex: 1 }} onClick={handleDownloadReceipt}>
                <FiDownload /> Download PDF Receipt
              </Button>
            )}
            <Link to="/fees" style={{ flex: 1 }}>
              <Button variant="secondary" style={{ width: "100%" }}>
                Return to My Fees
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
