import React, { useEffect, useState } from "react";
import Header from "../../components/layout/Header.jsx";
import Table from "../../components/common/Table.jsx";
import Button from "../../components/common/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { feeService } from "../../services/feeService.js";
import { receiptService } from "../../services/receiptService.js";
import { toast } from "../../utils/toast.js";
import { formatDate } from "../../utils/dateFormatter.js";
import { formatCurrency } from "../../utils/helpers.js";
import { FiDollarSign, FiDownload, FiCheckCircle, FiFileText } from "react-icons/fi";

export const FeeList = () => {
  const { role, user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      let res;
      if (role === "student") {
        const studentIdentifier = user?.studentId || user?._id;
        res = await feeService.getFeesByStudent(studentIdentifier);
      } else {
        res = await feeService.getAllFees(); // returns the fee structures
      }
      setPayments(res.fees || []);
    } catch (err) {
      toast.error("Failed to load fee information");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [role, user]);

  const handleDownloadReceipt = async (paymentId, receiptNumber) => {
    try {
      toast.info("Generating PDF Invoice Receipt...");
      await receiptService.downloadReceiptPDF(paymentId, receiptNumber);
      toast.success("Receipt downloaded successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to download receipt");
    }
  };

  const getStatusBadge = (status) => {
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
      <Header
        title={role === "student" ? "My Tuition Invoices & Fees" : "Master Fee Structure configuration"}
        subtitle={
          role === "student"
            ? "View outstanding fees, check online payment history, and download tax invoices."
            : "Define master billing templates and automatically assign tuition invoices to student classes."
        }
        actions={
          role === "admin" && (
            <div className="flex gap-2">
              <Link to="/fees/structures">
                <Button variant="primary">Manage Fee Templates</Button>
              </Link>
            </div>
          )
        }
      />

      {loading ? (
        <Loader />
      ) : role === "student" ? (
        <div className="card mt-4">
          <Table
            headers={[
              "Invoice ID",
              "Fee Category",
              "Total Amount",
              "Paid",
              "Outstanding Due",
              "Due Date",
              "Status",
              "Actions",
            ]}
            data={payments}
            renderRow={(payment) => (
              <tr key={payment._id}>
                <td>#{payment._id.slice(-6).toUpperCase()}</td>
                <td style={{ fontWeight: 500 }}>{payment.feeCategory}</td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(payment.totalAmount)}</td>
                <td style={{ color: "var(--success)" }}>{formatCurrency(payment.paidAmount)}</td>
                <td style={{ color: "var(--danger)", fontWeight: 600 }}>{formatCurrency(payment.dueAmount)}</td>
                <td>{formatDate(payment.paymentDate || payment.createdAt)}</td>
                <td>
                  <span className={`badge ${getStatusBadge(payment.paymentStatus)}`}>
                    {payment.paymentStatus}
                  </span>
                </td>
                <td>
                  <div className="flex gap-2">
                    {payment.paymentStatus && ["pending", "partial"].includes(payment.paymentStatus.toLowerCase()) && (
                      <Link to={`/fees/pay/${payment._id}`}>
                        <Button variant="success" style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}>
                          <FiDollarSign /> Pay Online
                        </Button>
                      </Link>
                    )}

                    {payment.paymentStatus && payment.paymentStatus.toLowerCase() === "paid" && (
                      <Button
                        variant="primary"
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
                        onClick={() => handleDownloadReceipt(payment._id, payment.receiptNumber)}
                      >
                        <FiDownload /> Receipt
                      </Button>
                    )}

                    <Link to={`/fees/payments/${payment._id}`}>
                      <Button variant="secondary" style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}>
                        <FiFileText /> Details
                      </Button>
                    </Link>
                  </div>
                </td>
              </tr>
            )}
            emptyMessage="No pending fee invoices or past payment history found for your student profile."
          />
        </div>
      ) : (
        /* For admin/faculty, redirect them or display structures */
        <div className="card mt-4 text-center p-8 space-y-4">
          <p>You can manage fee structures and view transaction ledgers using the sidebar links or buttons below.</p>
          <div className="flex justify-center gap-4">
            <Link to="/fees/structures">
              <Button variant="primary">Manage Fee Templates</Button>
            </Link>
            <Link to="/fees/payments">
              <Button variant="secondary">View Transaction Ledgers</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeList;
