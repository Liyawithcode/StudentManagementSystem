import React, { useEffect, useState } from "react";
import Header from "../../components/layout/Header.jsx";
import Table from "../../components/common/Table.jsx";
import Button from "../../components/common/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import SearchBar from "../../components/common/SearchBar.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import { Link } from "react-router-dom";
import { paymentService } from "../../services/paymentService.js";
import { toast } from "../../utils/toast.js";
import { formatDate } from "../../utils/dateFormatter.js";
import { formatCurrency } from "../../utils/helpers.js";
import { FiEye, FiCheckSquare, FiRefreshCw, FiDollarSign } from "react-icons/fi";

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
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

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
                  <Link to={`/fees/payments/${payment._id}`}>
                    <Button
                      variant="secondary"
                      style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem" }}
                    >
                      <FiEye /> View
                    </Button>
                  </Link>
                </td>
              </tr>
            )}
            emptyMessage="No billing ledger entries match the selected filters."
          />
        )}
      </div>
    </div>
  );
};

export default PaymentList;
