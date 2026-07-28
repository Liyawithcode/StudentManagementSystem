import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../../components/layout/Header.jsx";
import Button from "../../components/common/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import Card from "../../components/common/Card.jsx";
import Input from "../../components/common/Input.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { paymentService } from "../../services/paymentService.js";
import { receiptService } from "../../services/receiptService.js";
import { toast } from "../../utils/toast.js";
import { formatDate } from "../../utils/dateFormatter.js";
import { formatCurrency } from "../../utils/helpers.js";
import { FiDownload, FiDollarSign, FiCornerUpLeft, FiAlertTriangle, FiArrowLeft, FiTrash } from "react-icons/fi";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

export const PaymentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [payment, setPayment] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refunding, setRefunding] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundRemarks, setRefundRemarks] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDeletePayment = async () => {
    setDeleting(true);
    try {
      await paymentService.deletePayment(id);
      toast.success("Payment ledger record deleted successfully");
      setShowDeleteModal(false);
      navigate("/fees/payments");
    } catch (err) {
      toast.error(err.message || "Failed to delete payment record");
    } finally {
      setDeleting(false);
    }
  };


  const loadDetails = async () => {
    try {
      setLoading(true);
      const res = await paymentService.getPaymentById(id);
      setPayment(res.payment);

      if (res.payment.paymentStatus && res.payment.paymentStatus.toLowerCase() === "paid") {
        try {
          const recRes = await receiptService.getReceiptByPaymentId(id);
          setReceipt(recRes.receipt);
        } catch (recErr) {
          console.warn("Receipt not generated yet or missing", recErr.message);
        }
      }
    } catch (err) {
      toast.error(err.message || "Failed to load payment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!payment || !receipt) return;
    try {
      toast.info("Generating PDF file...");
      await receiptService.downloadReceiptPDF(payment._id, receipt.receiptNumber);
      toast.success("PDF Downloaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to download receipt");
    }
  };

  const [showRefundModal, setShowRefundModal] = useState(false);

  const handleRefundSubmit = (e) => {
    e.preventDefault();
    if (!refundAmount || Number(refundAmount) <= 0) {
      return toast.error("Please enter a valid refund amount");
    }
    if (Number(refundAmount) > payment.paidAmount) {
      return toast.error("Refund amount cannot exceed paid amount");
    }
    setShowRefundModal(true);
  };

  const handleConfirmRefund = async () => {
    setRefunding(true);
    try {
      await paymentService.refundPayment({
        paymentId: payment._id,
        amount: Number(refundAmount),
        remarks: refundRemarks,
      });
      toast.success("Refund successfully completed!");
      setShowRefundModal(false);
      loadDetails();
    } catch (err) {
      toast.error(err.message || "Failed to process refund");
    } finally {
      setRefunding(false);
    }
  };

  if (loading) return <Loader />;
  if (!payment) {
    return (
      <div className="card text-center p-8">
        <FiAlertTriangle size={48} className="mx-auto text-danger mb-4" />
        <h3 className="text-lg font-bold">Payment Ledger Not Found</h3>
        <p className="text-secondary mt-2">The record you are looking for might have been deleted or does not exist.</p>
        <Link to={role === "student" ? "/fees" : "/fees/payments"}>
          <Button variant="primary" className="mt-4">Back to Billing</Button>
        </Link>
      </div>
    );
  }

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Paid":
        return "badge-success";
      case "Processing":
        return "badge-warning";
      case "Refunded":
        return "badge-info";
      case "Failed":
      case "Cancelled":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <FiArrowLeft /> Back
        </Button>
        <div className="flex gap-2 items-center">
          {role === "admin" && (
            <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
              <FiTrash /> Delete Ledger
            </Button>
          )}
          <span className={`badge ${getStatusBadgeClass(payment.paymentStatus)}`} style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}>
            {payment.paymentStatus}
          </span>
        </div>
      </div>

      <Header
        title={`${payment.feeCategory} Invoice Details`}
        subtitle={`Invoice Ref ID: #${payment._id.substring(18).toUpperCase()}`}
      />


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Bill Summary */}
        <div className="md:col-span-2">
          <Card title="Billing Breakdown">
            <table className="table" style={{ width: "100%", marginTop: "1rem" }}>
              <tbody>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "0.75rem 0", fontWeight: 600 }}>Student Roll / ID</td>
                  <td style={{ textAlign: "right" }}>{payment.studentId}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "0.75rem 0", fontWeight: 600 }}>Student Name</td>
                  <td style={{ textAlign: "right" }}>{payment.studentName}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "0.75rem 0", fontWeight: 600 }}>Academic Details</td>
                  <td style={{ textAlign: "right" }}>{`${payment.class} (${payment.semester})`}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "0.75rem 0", fontWeight: 600 }}>Fee Category</td>
                  <td style={{ textAlign: "right" }}>{payment.feeCategory}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "0.75rem 0", fontWeight: 600 }}>Base Amount</td>
                  <td style={{ textAlign: "right" }}>{formatCurrency(payment.totalAmount * 0.82)}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "0.75rem 0", fontWeight: 600 }}>GST (18% Included)</td>
                  <td style={{ textAlign: "right" }}>{formatCurrency(payment.totalAmount * 0.18)}</td>
                </tr>
                <tr style={{ borderBottom: "2px solid var(--border)", fontSize: "1.1rem", fontWeight: 700 }}>
                  <td style={{ padding: "1rem 0", color: "var(--primary)" }}>Total Invoiced</td>
                  <td style={{ textAlign: "right", color: "var(--primary)" }}>{formatCurrency(payment.totalAmount)}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "0.75rem 0", fontWeight: 600, color: "var(--success)" }}>Paid Amount</td>
                  <td style={{ textAlign: "right", color: "var(--success)" }}>{formatCurrency(payment.paidAmount)}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "0.75rem 0", fontWeight: 600, color: "var(--danger)" }}>Due / Pending Balance</td>
                  <td style={{ textAlign: "right", color: "var(--danger)" }}>{formatCurrency(payment.dueAmount)}</td>
                </tr>
              </tbody>
            </table>

            {payment.remarks && (
              <div className="mt-4 p-3 bg-light rounded" style={{ borderLeft: "4px solid var(--primary)" }}>
                <strong style={{ display: "block", fontSize: "0.85rem", color: "var(--text-secondary)" }}>Remarks / Ledger Audit Details</strong>
                <span style={{ fontSize: "0.9rem" }}>{payment.remarks}</span>
              </div>
            )}
          </Card>

          {/* Transaction Metadata */}
          {payment.paymentStatus && payment.paymentStatus.toLowerCase() === "paid" && (
            <div className="mt-6">
              <Card title="Payment Gateway Metadata">
                <div className="grid grid-cols-2 gap-4 mt-2" style={{ fontSize: "0.95rem" }}>
                  <div>
                    <strong style={{ display: "block", color: "var(--text-secondary)" }}>Receipt Number</strong>
                    <span>{payment.receiptNumber || "N/A"}</span>
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "var(--text-secondary)" }}>Transaction ID</strong>
                    <span>{payment.transactionId || "N/A"}</span>
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "var(--text-secondary)" }}>Settlement Gateway</strong>
                    <span>{payment.paymentGateway || "Offline Direct Check"}</span>
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "var(--text-secondary)" }}>Settlement Method</strong>
                    <span>{payment.paymentMethod || "CASH"}</span>
                  </div>
                  <div>
                    <strong style={{ display: "block", color: "var(--text-secondary)" }}>Settlement Date</strong>
                    <span>{payment.paymentDate ? formatDate(payment.paymentDate) : "N/A"}</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Dynamic Context Right Bar (Receipts, Refunds, checkout triggers) */}
        <div>
          {payment.paymentStatus && payment.paymentStatus.toLowerCase() === "paid" && receipt && (
            <Card title="Receipt Actions">
              <div className="text-center p-4">
                <FiDownload size={40} className="text-primary mb-3 mx-auto" />
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                  A secure, digital-signed PDF invoice receipt is ready. Includes itemized taxes, billing dates, and verification QR code.
                </p>
                <Button variant="primary" style={{ width: "100%" }} onClick={handleDownloadPDF}>
                  <FiDownload /> Download PDF
                </Button>
              </div>
            </Card>
          )}

          {payment.paymentStatus && ["pending", "partial"].includes(payment.paymentStatus.toLowerCase()) && role === "student" && (
            <Card title="Pay Invoiced Fee">
              <div className="text-center p-4">
                <FiDollarSign size={40} className="text-success mb-3 mx-auto" />
                <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                  Settle your pending fee obligation online using Credit Cards, Debit Cards, UPI, QR codes, or PayPal.
                </p>
                <Link to={`/fees/pay/${payment._id}`} style={{ width: "100%", display: "block" }}>
                  <Button variant="success" style={{ width: "100%" }}>
                    Settle Bill Online
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {/* Refund Panel (Admin Only) */}
          {payment.paymentStatus && payment.paymentStatus.toLowerCase() === "paid" && role === "admin" && (
            <div className="mt-6">
              <Card title="Process Administrative Refund">
                <form onSubmit={handleRefundSubmit} className="space-y-4 mt-2">
                  <div className="p-3 bg-danger-light text-danger rounded flex gap-2 items-start" style={{ fontSize: "0.85rem", borderLeft: "3px solid var(--danger)" }}>
                    <FiAlertTriangle size={24} style={{ flexShrink: 0 }} />
                    <span>Refunds will credit the student account and set the bill status back to Refunded / Overdue.</span>
                  </div>

                  <Input
                    label="Refund Amount ($)"
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    required
                    placeholder="0.00"
                  />

                  <div>
                    <label className="label" style={{ fontWeight: 600 }}>Refund Justification Remarks</label>
                    <textarea
                      value={refundRemarks}
                      onChange={(e) => setRefundRemarks(e.target.value)}
                      className="input"
                      style={{ width: "100%", height: "70px", padding: "0.5rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}
                      placeholder="Course cancellation refund..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="danger"
                    style={{ width: "100%" }}
                  >
                    <FiCornerUpLeft /> Dispatch Refund Check
                  </Button>
                </form>
              </Card>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeletePayment}
        loading={deleting}
        message="Are you sure you want to delete this payment ledger record? This action cannot be undone."
      />

      <ConfirmDialog
        isOpen={showRefundModal}
        onClose={() => setShowRefundModal(false)}
        onConfirm={handleConfirmRefund}
        loading={refunding}
        title="Confirm Refund"
        message={`Are you sure you want to process a refund of ₹${refundAmount}? This action is irreversible.`}
      />
    </div>
  );
};

export default PaymentDetails;

