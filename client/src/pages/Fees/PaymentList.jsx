

import React, { useEffect, useState } from "react";
import Header from "../../components/layout/Header.jsx";
import Table from "../../components/common/Table.jsx";
import Button from "../../components/common/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import SearchBar from "../../components/common/SearchBar.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import { paymentService } from "../../services/paymentService.js";
import { toast } from "../../utils/toast.js";
import { formatDate } from "../../utils/dateFormatter.js";
import { formatCurrency } from "../../utils/helpers.js";
import { FiEye, FiCheckSquare, FiRefreshCw, FiDollarSign, FiTrash } from "react-icons/fi";
import ConfirmDialog from "../../components/common/ConfirmDialog.jsx";

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "Pending", label: "Pending" },
  { value: "Paid", label: "Paid" },
  { value: "Failed", label: "Failed" },
  { value: "Processing", label: "Processing" },
  { value: "Refunded", label: "Refunded" },
];

const CATEGORY_OPTIONS = [
  { value: "all", label: "All Categories" },
  { value: "Admission Fee", label: "Admission Fee" },
  { value: "Tuition Fee", label: "Tuition Fee" },
  { value: "Exam Fee", label: "Exam Fee" },
  { value: "Library Fee", label: "Library Fee" },
  { value: "Hostel Fee", label: "Hostel Fee" },
  { value: "Transport Fee", label: "Transport Fee" },
  { value: "Uniform Fee", label: "Uniform Fee" },
  { value: "Fine", label: "Fine" },
  { value: "Miscellaneous Fee", label: "Miscellaneous Fee" },
];

export const PaymentList = () => {
  const { role } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [deletePaymentId, setDeletePaymentId] = useState(null);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const res = await paymentService.getAllPayments();
      setPayments(res.payments || []);
    } catch (err) {
      toast.error(err.message || "Failed to load payment ledgers");
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async () => {
    if (!deletePaymentId) return;
    try {
      await paymentService.deletePayment(deletePaymentId);
      toast.success("Payment ledger record deleted successfully");
      setDeletePaymentId(null);
      fetchPayments();
    } catch (err) {
      toast.error(err.message || "Failed to delete payment record");
    }
  };


  useEffect(() => {

    fetchPayments();
  }, []);

  const handleSearch = (term) => {
    setSearchTerm(term);
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

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (payment.transactionId && payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "all" || payment.paymentStatus === statusFilter;
    const matchesCategory = categoryFilter === "all" || payment.feeCategory === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div>
      <Header
        title="Student Billing Ledgers"
        subtitle="Manage, audit, search, and refund student invoices, and verify online or offline collections."
        actions={
          <div className="flex gap-2">
            <Link to="/fees/approvals">
              <Button variant="secondary">
                <FiCheckSquare /> Offline Approvals
              </Button>
            </Link>
            <Link to="/fees/dashboard">
              <Button variant="primary">
                <FiDollarSign /> Revenue Dashboard
              </Button>
            </Link>
          </div>
        }
      />

      <div className="card mt-4">
        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <SearchBar
            placeholder="Search student ID, name, or transaction..."
            onSearch={handleSearch}
          />
          <Dropdown
            label=""
            name="status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={STATUS_OPTIONS}
          />
          <Dropdown
            label=""
            name="category"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            options={CATEGORY_OPTIONS}
          />
        </div>

        {loading ? (
          <Loader />
        ) : (
          <Table
            headers={[
              "Student ID",
              "Student Name",
              "Class/Semester",
              "Category",
              "Total",
              "Paid",
              "Due",
              "Method",
              "Status",
              "Action",
            ]}
            data={filteredPayments}
            renderRow={(payment) => {
              const pid = payment._id || payment.id;
              return (
                <tr key={pid}>
                  <td style={{ fontWeight: 600 }}>{payment.enrollmentNumber || payment.studentId}</td>
                  <td>{payment.studentName}</td>
                  <td>
                    <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                      {payment.class} - {payment.semester}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-secondary" style={{ fontSize: "0.75rem" }}>
                      {payment.feeCategory}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(payment.totalAmount)}</td>
                  <td style={{ color: "var(--success)" }}>{formatCurrency(payment.paidAmount)}</td>
                  <td style={{ color: "var(--danger)" }}>{formatCurrency(payment.dueAmount)}</td>
                  <td>
                    <span className="badge badge-secondary" style={{ fontSize: "0.7rem" }}>
                      {payment.paymentMethod || "None"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(payment.paymentStatus)}`}>
                      {payment.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Link to={`/fees/payments/${pid}`}>
                        <Button
                          variant="secondary"
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
                        >
                          <FiEye /> View
                        </Button>
                      </Link>
                      {role === "admin" && (
                        <Button
                          variant="danger"
                          style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
                          onClick={() => setDeletePaymentId(pid)}
                          title="Delete Ledger"
                        >
                          <FiTrash />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            }}
            emptyMessage="No billing ledger entries match the selected filters."
          />
        )}
      </div>

      <ConfirmDialog
        isOpen={!!deletePaymentId}
        onClose={() => setDeletePaymentId(null)}
        onConfirm={handleDeletePayment}
        message="Are you sure you want to delete this payment ledger record? This action cannot be undone."
      />
    </div>
  );
};

export default PaymentList;

