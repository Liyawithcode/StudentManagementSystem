import React, { useEffect, useState } from "react";
import Header from "../../components/layout/Header.jsx";
import Table from "../../components/common/Table.jsx";
import Button from "../../components/common/Button.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Loader from "../../components/common/Loader.jsx";
import { paymentService } from "../../services/paymentService.js";
import { toast } from "../../utils/toast.js";
import { formatDate } from "../../utils/dateFormatter.js";
import { formatCurrency } from "../../utils/helpers.js";
import { FiDownload, FiFileText, FiFilter } from "react-icons/fi";

const REPORT_TYPES = [
  { value: "daily", label: "Daily Collection Report" },
  { value: "monthly", label: "Monthly Collection Report" },
  { value: "student", label: "Student Fee Report" },
  { value: "pending", label: "Pending Fee Report" },
  { value: "class", label: "Class-wise Report" },
  { value: "method", label: "Payment Method Report" },
  { value: "refund", label: "Refund Report" },
];

const CLASSES = [
  { value: "all", label: "All Classes" },
  { value: "Class 10", label: "Class 10" },
  { value: "Class 11", label: "Class 11" },
  { value: "Class 12", label: "Class 12" },
];

export const FeeReport = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState("daily");
  const [selectedClass, setSelectedClass] = useState("all");
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await paymentService.getAllPayments();
        const data = res.payments || [];
        setPayments(data);
        generateReport(data, reportType, selectedClass);
      } catch (err) {
        toast.error("Failed to load ledgers for reporting");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const generateReport = (allPayments, type, classFilter) => {
    let filtered = [...allPayments];

    // Filter by class if applicable
    if (classFilter !== "all") {
      filtered = filtered.filter((p) => p.class === classFilter);
    }

    const todayStr = new Date().toDateString();

    switch (type) {
      case "daily":
        // Fully paid today
        filtered = filtered.filter(
          (p) => p.paymentStatus === "Paid" && p.paymentDate && new Date(p.paymentDate).toDateString() === todayStr
        );
        break;
      case "monthly":
        // Fully paid this current month
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        filtered = filtered.filter((p) => {
          if (p.paymentStatus !== "Paid" || !p.paymentDate) return false;
          const d = new Date(p.paymentDate);
          return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
        });
        break;
      case "student":
        // All payments grouping, order by student name
        filtered.sort((a, b) => a.studentName.localeCompare(b.studentName));
        break;
      case "pending":
        // outstanding balances
        filtered = filtered.filter((p) => p.paymentStatus === "Pending" || p.paymentStatus === "Processing");
        break;
      case "class":
        // Grouped by class
        filtered.sort((a, b) => a.class.localeCompare(b.class));
        break;
      case "method":
        // Filter out direct cash/cheque/UPI paid items
        filtered = filtered.filter((p) => p.paymentStatus === "Paid");
        filtered.sort((a, b) => a.paymentMethod.localeCompare(b.paymentMethod));
        break;
      case "refund":
        // Refunded items
        filtered = filtered.filter((p) => p.paymentStatus === "Refunded");
        break;
      default:
        break;
    }

    setReportData(filtered);
  };

  const handleReportChange = (e) => {
    const type = e.target.value;
    setReportType(type);
    generateReport(payments, type, selectedClass);
  };

  const handleClassChange = (e) => {
    const cls = e.target.value;
    setSelectedClass(cls);
    generateReport(payments, reportType, cls);
  };

  // Export to CSV helper
  const handleExportCSV = () => {
    if (reportData.length === 0) {
      return toast.warning("No data to export!");
    }

    const headers = ["Invoice ID", "Student ID", "Student Name", "Class", "Semester", "Category", "Amount", "Paid", "Due", "Status", "Method", "Date"];
    const rows = reportData.map((p) => [
      p._id,
      p.studentId,
      p.studentName,
      p.class,
      p.semester,
      p.feeCategory,
      p.totalAmount,
      p.paidAmount,
      p.dueAmount,
      p.paymentStatus,
      p.paymentMethod,
      p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : "N/A",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.map(val => `"${val}"`).join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Report_${reportType}_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("CSV report exported successfully!");
  };

  const handleExportPDF = () => {
    // Generate a simple window print styled table or export
    window.print();
  };

  return (
    <div>
      <Header
        title="Billing & Collection Reports"
        subtitle="Extract detailed audits for collections, outstanding balances, class ledgers, and payment gateways."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleExportCSV}>
              <FiDownload /> Export CSV / Excel
            </Button>
            <Button variant="primary" onClick={handleExportPDF}>
              <FiFileText /> Print PDF Report
            </Button>
          </div>
        }
      />

      <div className="card mt-4">
        {/* Filters Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Dropdown
            label="Report Type"
            name="reportType"
            value={reportType}
            onChange={handleReportChange}
            options={REPORT_TYPES}
          />
          <Dropdown
            label="Filter Class"
            name="classFilter"
            value={selectedClass}
            onChange={handleClassChange}
            options={CLASSES}
          />
        </div>

        {loading ? (
          <Loader />
        ) : (
          <div>
            <div className="mb-3 flex justify-between items-center bg-light p-3 rounded">
              <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>
                Selected Report: <span style={{ color: "var(--primary)" }}>{REPORT_TYPES.find(r => r.value === reportType)?.label}</span>
              </span>
              <span className="badge badge-info" style={{ fontSize: "0.85rem" }}>
                Count: {reportData.length} records
              </span>
            </div>

            <Table
              headers={[
                "Student ID",
                "Student Name",
                "Class/Sem",
                "Category",
                "Total Amount",
                "Paid Amount",
                "Outstanding Due",
                "Method",
                "Status",
              ]}
              data={reportData}
              renderRow={(payment) => (
                <tr key={payment._id}>
                  <td>{payment.studentId}</td>
                  <td style={{ fontWeight: 500 }}>{payment.studentName}</td>
                  <td>{`${payment.class} / ${payment.semester}`}</td>
                  <td>{payment.feeCategory}</td>
                  <td style={{ fontWeight: 600 }}>{formatCurrency(payment.totalAmount)}</td>
                  <td style={{ color: "var(--success)" }}>{formatCurrency(payment.paidAmount)}</td>
                  <td style={{ color: "var(--danger)" }}>{formatCurrency(payment.dueAmount)}</td>
                  <td>
                    <span className="badge badge-secondary" style={{ fontSize: "0.7rem" }}>
                      {payment.paymentMethod || "None"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        payment.paymentStatus === "Paid"
                          ? "badge-success"
                          : payment.paymentStatus === "Processing"
                          ? "badge-warning"
                          : payment.paymentStatus === "Refunded"
                          ? "badge-info"
                          : "badge-danger"
                      }`}
                    >
                      {payment.paymentStatus}
                    </span>
                  </td>
                </tr>
              )}
              emptyMessage="No ledger records matched the report query criteria."
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FeeReport;
