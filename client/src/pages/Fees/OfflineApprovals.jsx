import React, { useEffect, useState } from "react";
import Header from "../../components/layout/Header.jsx";
import Table from "../../components/common/Table.jsx";
import Button from "../../components/common/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import Modal from "../../components/common/Modal.jsx";
import Input from "../../components/common/Input.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import { paymentService } from "../../services/paymentService.js";
import { toast } from "../../utils/toast.js";
import { formatDate } from "../../utils/dateFormatter.js";
import { formatCurrency } from "../../utils/helpers.js";
import { FiCheck, FiX, FiPlus, FiDollarSign } from "react-icons/fi";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

const CATEGORIES = [
  { value: "Tuition Fee", label: "Tuition Fee" },
  { value: "Admission Fee", label: "Admission Fee" },
  { value: "Exam Fee", label: "Exam Fee" },
  { value: "Library Fee", label: "Library Fee" },
  { value: "Hostel Fee", label: "Hostel Fee" },
  { value: "Transport Fee", label: "Transport Fee" },
  { value: "Miscellaneous Fee", label: "Miscellaneous Fee" },
];

const METHODS = [
  { value: "Cash", label: "Cash Receipt" },
  { value: "Cheque", label: "Cheque Deposit" },
  { value: "Demand Draft", label: "Demand Draft (DD)" },
  { value: "Bank Transfer", label: "Bank Direct Transfer / Wire" },
];

export const OfflineApprovals = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionTarget, setActionTarget] = useState(null); // { id, status, title, message }
  const [actionLoading, setActionLoading] = useState(false);

  // Record manual offline payment modal state
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [recordForm, setRecordForm] = useState({
    studentId: "",
    studentName: "",
    class: "Class 10",
    semester: "Semester 1",
    feeCategory: "Tuition Fee",
    amount: "",
    paymentMethod: "Cash",
    remarks: "",
  });
  const [recording, setRecording] = useState(false);

  const fetchPending = async () => {
    try {
      setLoading(true);
      const res = await paymentService.getAllPayments();
      // Filter payments with 'Processing' status
      const processing = (res.payments || []).filter((p) => p.paymentStatus === "Processing");
      setPendingPayments(processing);
    } catch (err) {
      toast.error(err.message || "Failed to load pending payments list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleOpenAction = (id, status) => {
    const isVerify = status === "Paid";
    setActionTarget({
      id,
      status,
      title: isVerify ? "Approve Offline Payment" : "Reject Payment Verification",
      message: isVerify
        ? "Are you sure you want to approve this offline payment? A digital receipt will be generated automatically."
        : "Are you sure you want to reject this payment verification claim?",
    });
  };

  const handleConfirmAction = async () => {
    if (!actionTarget) return;
    const { id, status } = actionTarget;
    setActionLoading(true);
    try {
      await paymentService.updatePaymentStatus(id, {
        paymentStatus: status,
        remarks: status === "Paid" ? "Offline payment verified & approved." : "Offline payment proof rejected.",
      });
      toast.success(status === "Paid" ? "Payment successfully verified!" : "Verification claim rejected.");
      setActionTarget(null);
      fetchPending();
    } catch (err) {
      toast.error(err.message || "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    if (!recordForm.studentId || !recordForm.studentName || !recordForm.amount) {
      return toast.error("Required fields: Student ID, Student Name, Amount");
    }
    setRecording(true);
    try {
      // First check or create a payment ledger entry in Processing state
      const payload = {
        studentId: recordForm.studentId,
        studentName: recordForm.studentName,
        class: recordForm.class,
        semester: recordForm.semester,
        feeCategory: recordForm.feeCategory,
        totalAmount: Number(recordForm.amount),
        paidAmount: 0,
        dueAmount: Number(recordForm.amount),
        paymentStatus: "Processing",
        paymentMethod: recordForm.paymentMethod,
        remarks: recordForm.remarks || `Offline payment logged. Method: ${recordForm.paymentMethod}`,
        paymentDate: new Date(),
      };

      await paymentService.recordOfflinePayment({
        paymentId: recordForm.studentId, // fallback handler
        ...payload,
      });

      toast.success("Offline payment logged for approval!");
      setShowRecordModal(false);
      setRecordForm({
        studentId: "",
        studentName: "",
        class: "Class 10",
        semester: "Semester 1",
        feeCategory: "Tuition Fee",
        amount: "",
        paymentMethod: "Cash",
        remarks: "",
      });
      fetchPending();
    } catch (err) {
      toast.error(err.message || "Failed to log offline payment");
    } finally {
      setRecording(false);
    }
  };

  return (
    <div>
      <Header
        title="Offline Payment Approvals"
        subtitle="Review, audit, and approve bank drafts, cash receipts, and cheque clearance proofs."
        actions={
          <Button variant="primary" onClick={() => setShowRecordModal(true)}>
            <FiPlus /> Record Offline Payment
          </Button>
        }
      />

      {loading ? (
        <Loader />
      ) : (
        <div className="card mt-4">
          <Table
            headers={[
              "Student ID",
              "Student Name",
              "Class/Semester",
              "Category",
              "Amount",
              "Payment Method",
              "Submission Date",
              "Proof Notes / Cheque Info",
              "Verification Actions",
            ]}
            data={pendingPayments}
            renderRow={(payment) => (
              <tr key={payment._id}>
                <td>{payment.studentId}</td>
                <td style={{ fontWeight: 500 }}>{payment.studentName}</td>
                <td>{`${payment.class} / ${payment.semester}`}</td>
                <td>
                  <span className="badge badge-info" style={{ fontSize: "0.75rem" }}>
                    {payment.feeCategory}
                  </span>
                </td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(payment.totalAmount)}</td>
                <td>
                  <span className="badge badge-warning" style={{ fontSize: "0.75rem" }}>
                    {payment.paymentMethod}
                  </span>
                </td>
                <td>{formatDate(payment.paymentDate || payment.updatedAt)}</td>
                <td style={{ fontSize: "0.85rem", fontStyle: "italic", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={payment.remarks}>
                  {payment.remarks || "No comments provided"}
                </td>
                <td>
                  <div className="flex gap-2">
                    <Button
                      variant="success"
                      style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
                      onClick={() => handleOpenAction(payment._id, "Paid")}
                    >
                      <FiCheck /> Verify
                    </Button>
                    <Button
                      variant="danger"
                      style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
                      onClick={() => handleOpenAction(payment._id, "Failed")}
                    >
                      <FiX /> Reject
                    </Button>
                  </div>
                </td>
              </tr>
            )}
            emptyMessage="No pending offline payment verifications. All clear!"
          />
        </div>
      )}

      {/* Record Offline Payment Modal */}
      <Modal isOpen={showRecordModal} onClose={() => setShowRecordModal(false)} title="Log Offline Payment for Verification">
        <form onSubmit={handleRecordSubmit} className="flex flex-column gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Student ID"
              value={recordForm.studentId}
              onChange={(e) => setRecordForm({ ...recordForm, studentId: e.target.value })}
              placeholder="e.g. ST-2026-0001"
              required
            />
            <Input
              label="Student Name"
              value={recordForm.studentName}
              onChange={(e) => setRecordForm({ ...recordForm, studentName: e.target.value })}
              placeholder="e.g. Rahul Verma"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Dropdown
              label="Fee Category"
              name="feeCategory"
              value={recordForm.feeCategory}
              onChange={(e) => setRecordForm({ ...recordForm, feeCategory: e.target.value })}
              options={CATEGORIES}
              required
            />
            <Dropdown
              label="Payment Method"
              name="paymentMethod"
              value={recordForm.paymentMethod}
              onChange={(e) => setRecordForm({ ...recordForm, paymentMethod: e.target.value })}
              options={METHODS}
              required
            />
          </div>

          <Input
            label="Amount (₹)"
            type="number"
            value={recordForm.amount}
            onChange={(e) => setRecordForm({ ...recordForm, amount: e.target.value })}
            placeholder="Enter payment amount"
            required
            min="1"
          />

          <div>
            <label className="form-label">Proof / Cheque / Bank Transfer Details</label>
            <textarea
              className="input-custom"
              style={{ width: "100%", height: "80px", padding: "0.5rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", background: "var(--bg-app)", color: "var(--text-main)" }}
              placeholder="Cheque No., DD Ref No., Bank Branch, or Cash Deposit slip notes..."
              value={recordForm.remarks}
              onChange={(e) => setRecordForm({ ...recordForm, remarks: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button type="button" variant="secondary" onClick={() => setShowRecordModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={recording}>
              Submit for Approval
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!actionTarget}
        onClose={() => setActionTarget(null)}
        onConfirm={handleConfirmAction}
        loading={actionLoading}
        title={actionTarget?.title || "Confirm Action"}
        message={actionTarget?.message || ""}
      />
    </div>
  );
};

export default OfflineApprovals;
