import React, { useEffect, useState } from "react";
import Header from "../../components/layout/Header.jsx";
import Card from "../../components/common/Card.jsx";
import Loader from "../../components/common/Loader.jsx";
import Button from "../../components/common/Button.jsx";
import { Link } from "react-router-dom";
import { paymentService } from "../../services/paymentService.js";
import { toast } from "../../utils/toast.js";
import { formatCurrency } from "../../utils/helpers.js";
import { FiDollarSign, FiAlertCircle, FiTrendingUp, FiCheckCircle } from "react-icons/fi";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export const RevenueDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayCollection: 0,
    pendingFees: 0,
    failedPayments: 0,
    refundedAmount: 0,
    onlineCollection: 0,
    offlineCollection: 0,
  });

  const [chartsData, setChartsData] = useState(null);

  const calculateStats = async () => {
    try {
      setLoading(true);
      const res = await paymentService.getAllPayments();
      const payments = res.payments || [];

      let totalRevenue = 0;
      let todayCollection = 0;
      let pendingFees = 0;
      let failedPayments = 0;
      let refundedAmount = 0;
      let onlineCollection = 0;
      let offlineCollection = 0;

      const todayStr = new Date().toDateString();

      // Maps for charts
      const monthlyRevenue = {};
      const methodCounts = {};
      const categoryRevenue = {};
      const statusCounts = {};

      payments.forEach((p) => {
        const amount = p.totalAmount || 0;
        const status = p.paymentStatus;
        const method = p.paymentMethod || "None";
        const category = p.feeCategory;
        const pDate = p.paymentDate ? new Date(p.paymentDate) : null;

        // Status counts
        statusCounts[status] = (statusCounts[status] || 0) + 1;

        if (status === "Paid") {
          totalRevenue += amount;

          // Today's collection
          if (pDate && pDate.toDateString() === todayStr) {
            todayCollection += amount;
          }

          // Online vs Offline split
          if (["Stripe", "Razorpay", "PayPal"].includes(p.paymentGateway)) {
            onlineCollection += amount;
          } else {
            offlineCollection += amount;
          }

          // Monthly grouping
          if (pDate) {
            const monthName = pDate.toLocaleString("default", { month: "short" });
            monthlyRevenue[monthName] = (monthlyRevenue[monthName] || 0) + amount;
          }

          // Payment method grouping
          methodCounts[method] = (methodCounts[method] || 0) + amount;

          // Category grouping
          categoryRevenue[category] = (categoryRevenue[category] || 0) + amount;
        } else if (status === "Pending" || status === "Processing") {
          pendingFees += p.dueAmount || amount;
        } else if (status === "Failed") {
          failedPayments += 1;
        } else if (status === "Refunded") {
          refundedAmount += amount;
        }
      });

      setStats({
        totalRevenue,
        todayCollection,
        pendingFees,
        failedPayments,
        refundedAmount,
        onlineCollection,
        offlineCollection,
      });

      // Format Chart Data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthlyRevenueValues = months.map((m) => monthlyRevenue[m] || 0);

      const categoryLabels = Object.keys(categoryRevenue);
      const categoryValues = Object.values(categoryRevenue);

      const methodLabels = Object.keys(methodCounts);
      const methodValues = Object.values(methodCounts);

      const statusLabels = Object.keys(statusCounts);
      const statusValues = Object.values(statusCounts);

      setChartsData({
        monthly: {
          labels: months,
          datasets: [
            {
              label: "Monthly Revenue ($)",
              data: monthlyRevenueValues,
              backgroundColor: "rgba(79, 70, 229, 0.8)",
              borderColor: "rgb(79, 70, 229)",
              borderWidth: 2,
              borderRadius: 4,
            },
          ],
        },
        categories: {
          labels: categoryLabels.length ? categoryLabels : ["No Data"],
          datasets: [
            {
              label: "Revenue by Category",
              data: categoryValues.length ? categoryValues : [0],
              backgroundColor: [
                "rgba(79, 70, 229, 0.8)",
                "rgba(16, 185, 129, 0.8)",
                "rgba(245, 158, 11, 0.8)",
                "rgba(239, 68, 68, 0.8)",
                "rgba(139, 92, 246, 0.8)",
                "rgba(236, 72, 153, 0.8)",
              ],
            },
          ],
        },
        methods: {
          labels: methodLabels.length ? methodLabels : ["No Data"],
          datasets: [
            {
              label: "Method Volume",
              data: methodValues.length ? methodValues : [0],
              backgroundColor: [
                "rgba(16, 185, 129, 0.8)",
                "rgba(59, 130, 246, 0.8)",
                "rgba(245, 158, 11, 0.8)",
                "rgba(239, 68, 68, 0.8)",
              ],
            },
          ],
        },
        statuses: {
          labels: statusLabels.length ? statusLabels : ["No Data"],
          datasets: [
            {
              label: "Invoices by Status",
              data: statusValues.length ? statusValues : [0],
              backgroundColor: [
                "rgba(245, 158, 11, 0.8)", // Pending
                "rgba(16, 185, 129, 0.8)", // Paid
                "rgba(239, 68, 68, 0.8)",  // Failed
                "rgba(59, 130, 246, 0.8)",  // Processing/Refunded
              ],
            },
          ],
        },
      });
    } catch (err) {
      toast.error(err.message || "Failed to load revenue metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateStats();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <Header
        title="Revenue & Collections Dashboard"
        subtitle="Real-time collection audit dashboards, gateway distributions, and category analysis graphs."
        actions={
          <Link to="/fees/payments">
            <Button variant="primary">View Ledgers</Button>
          </Link>
        }
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="card flex items-center justify-between p-4" style={{ borderLeft: "4px solid var(--success)" }}>
          <div>
            <strong style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Total Revenue</strong>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0.25rem 0" }}>{formatCurrency(stats.totalRevenue)}</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--success)" }}>✓ Confirmed Receipts</span>
          </div>
          <FiTrendingUp size={36} className="text-success" />
        </div>

        <div className="card flex items-center justify-between p-4" style={{ borderLeft: "4px solid var(--primary)" }}>
          <div>
            <strong style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Today's Collection</strong>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0.25rem 0" }}>{formatCurrency(stats.todayCollection)}</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--primary)" }}>✦ Daily Settlement</span>
          </div>
          <FiCheckCircle size={36} className="text-primary" />
        </div>

        <div className="card flex items-center justify-between p-4" style={{ borderLeft: "4px solid var(--warning)" }}>
          <div>
            <strong style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Pending / Receivables</strong>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0.25rem 0" }}>{formatCurrency(stats.pendingFees)}</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--warning)" }}>◑ Awaiting Invoices</span>
          </div>
          <FiDollarSign size={36} className="text-warning" />
        </div>

        <div className="card flex items-center justify-between p-4" style={{ borderLeft: "4px solid var(--danger)" }}>
          <div>
            <strong style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Refunds / Failed Logs</strong>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 700, margin: "0.25rem 0" }}>{formatCurrency(stats.refundedAmount)}</h3>
            <span style={{ fontSize: "0.75rem", color: "var(--danger)" }}>✗ {stats.failedPayments} failed checkouts</span>
          </div>
          <FiAlertCircle size={36} className="text-danger" />
        </div>
      </div>

      {/* Online vs Offline Stats Banner */}
      <div className="card grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 p-4 text-center">
        <div style={{ borderRight: "1px solid var(--border)" }}>
          <strong style={{ color: "var(--text-secondary)" }}>Online Gateway Settlements</strong>
          <h4 style={{ fontSize: "1.4rem", color: "var(--success)", fontWeight: 700, margin: "0.25rem 0" }}>
            {formatCurrency(stats.onlineCollection)}
          </h4>
          <span style={{ fontSize: "0.75rem" }}>Via Stripe, Razorpay & PayPal</span>
        </div>
        <div>
          <strong style={{ color: "var(--text-secondary)" }}>Offline Bank/Cash Postings</strong>
          <h4 style={{ fontSize: "1.4rem", color: "var(--primary)", fontWeight: 700, margin: "0.25rem 0" }}>
            {formatCurrency(stats.offlineCollection)}
          </h4>
          <span style={{ fontSize: "0.75rem" }}>Via Direct Clearance and Posting Check</span>
        </div>
      </div>

      {/* Graphs Grid */}
      {chartsData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <Card title="Monthly Revenue Trajectory">
            <div style={{ height: "260px" }}>
              <Bar data={chartsData.monthly} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </Card>

          <Card title="Payment Method Distribution">
            <div style={{ height: "260px" }}>
              <Doughnut data={chartsData.methods} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </Card>

          <Card title="Revenue split by Fee Categories">
            <div style={{ height: "260px" }}>
              <Bar
                data={chartsData.categories}
                options={{
                  indexAxis: "y",
                  responsive: true,
                  maintainAspectRatio: false,
                }}
              />
            </div>
          </Card>

          <Card title="Invoice Status Ratio">
            <div style={{ height: "260px" }}>
              <Doughnut data={chartsData.statuses} options={{ responsive: true, maintainAspectRatio: false }} />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RevenueDashboard;
