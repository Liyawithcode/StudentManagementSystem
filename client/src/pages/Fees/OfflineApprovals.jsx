import React, { useEffect, useState } from "react";
import Header from "../../components/layout/Header.jsx";
import Table from "../../components/common/Table.jsx";
import Button from "../../components/common/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import { paymentService } from "../../services/paymentService.js";
import { toast } from "../../utils/toast.js";
import { formatDate } from "../../utils/dateFormatter.js";
import { formatCurrency } from "../../utils/helpers.js";
import { FiCheck, FiX, FiFileText } from "react-icons/fi";

export const OfflineApprovals = () => {
  const [pendingPayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState(null);

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

  const handleAction = async (id, status) => {
    const confirmationMsg =
      status === "Paid"
        ? "Approve this payment? A receipt will be generated and dispatched automatically."
        : "Reject this payment verification claim?";

    if (!window.confirm(confirmationMsg)) return;

    setApprovingId(id);
    try {
      await paymentService.updatePaymentStatus(id, {
        paymentStatus: status,
        remarks: status === "Paid" ? "Offline payment verified & approved." : "Offline payment proof rejected.",
      });
      toast.success(status === "Paid" ? "Payment successfully verified!" : "Verification claim rejected.");
      fetchPending();
    } catch (err) {
      toast.error(err.message || "Action failed");
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <div>
      <Header
        title="Offline Payment Approvals"
        subtitle="Review, audit, and approve bank drafts, cash receipts, and cheque clearance proofs."
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
                      onClick={() => handleAction(payment._id, "Paid")}
                      disabled={approvingId !== null}
                    >
                      <FiCheck /> Verify
                    </Button>
                    <Button
                      variant="danger"
                      style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
                      onClick={() => handleAction(payment._id, "Failed")}
                      disabled={approvingId !== null}
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
    </div>
  );
};

export default OfflineApprovals;
