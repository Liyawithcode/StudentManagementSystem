import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header.jsx";
import Card from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import Input from "../../components/common/Input.jsx";
import Dropdown from "../../components/common/Dropdown.jsx";
import Loader from "../../components/common/Loader.jsx";
import { paymentService } from "../../services/paymentService.js";
import { toast } from "../../utils/toast.js";
import { formatCurrency } from "../../utils/helpers.js";
import { formatDate } from "../../utils/dateFormatter.js";
import { FiCreditCard, FiCheckCircle, FiDollarSign, FiTag } from "react-icons/fi";

const OFFLINE_METHODS = [
  { value: "Cash", label: "Cash Receipt" },
  { value: "Cheque", label: "Cheque Deposit" },
  { value: "Demand Draft", label: "Demand Draft (DD)" },
  { value: "Bank Transfer", label: "Bank Direct Transfer / Wire" },
];

const ONLINE_METHODS = [
  { value: "Credit Card", label: "Credit Card" },
  { value: "Debit Card", label: "Debit Card" },
  { value: "UPI", label: "UPI (Unified Payments Interface)" },
  { value: "Net Banking", label: "Net Banking" },
  { value: "Wallet", label: "Mobile Wallet (Apple/Google Pay)" },
  { value: "QR Code Payment", label: "QR Code Scan to Pay" },
];

export const PayFees = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  // States for choice
  const [paymentType, setPaymentType] = useState("online"); // online or offline
  const [selectedOnlineMethod, setSelectedOnlineMethod] = useState("Credit Card");
  const [selectedGateway, setSelectedGateway] = useState("Stripe");
  const [selectedOfflineMethod, setSelectedOfflineMethod] = useState("Bank Transfer");
  const [offlineRemarks, setOfflineRemarks] = useState("");

  // Bonus Features (Discount Coupons)
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); // in dollars
  const [appliedCouponName, setAppliedCouponName] = useState("");
  const [totalDue, setTotalDue] = useState(0);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        setLoading(true);
        const res = await paymentService.getPaymentById(id);
        setPayment(res.payment);
        setTotalDue(res.payment.dueAmount);
      } catch (err) {
        toast.error(err.message || "Failed to load fee invoice details");
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [id]);

  const handleApplyCoupon = () => {
    if (!payment) return;
    const cleanCoupon = couponCode.trim().toUpperCase();

    if (cleanCoupon === "SCHOLAR50") {
      const discount = payment.dueAmount * 0.5;
      setAppliedDiscount(discount);
      setTotalDue(payment.dueAmount - discount);
      setAppliedCouponName("SCHOLAR50 (50% Scholarship)");
      toast.success("Scholarship 50% discount applied successfully!");
    } else if (cleanCoupon === "WELCOME10") {
      const discount = payment.dueAmount * 0.1;
      setAppliedDiscount(discount);
      setTotalDue(payment.dueAmount - discount);
      setAppliedCouponName("WELCOME10 (10% Coupon Discount)");
      toast.success("Coupon 10% discount applied successfully!");
    } else {
      toast.error("Invalid coupon code. Try SCHOLAR50 or WELCOME10!");
    }
  };

  const handleClearCoupon = () => {
    setAppliedDiscount(0);
    setTotalDue(payment.dueAmount);
    setAppliedCouponName("");
    setCouponCode("");
    toast.info("Discount removed");
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!payment) return;

    setPaying(true);
    try {
      if (paymentType === "online") {
        // Online Gateway Routing
        toast.info(`Contacting ${selectedGateway} checkout server...`);

        // If coupon is applied, update amount temporarily or create order with total due
        const payload = {
          paymentId: payment._id,
          paymentGateway: selectedGateway,
          paymentMethod: selectedOnlineMethod,
          discountAmount: appliedDiscount,
        };

        const res = await paymentService.createOrder(payload);

        if (res.success) {
          if (res.checkoutUrl) {
            // Simulated or stripe direct check link
            window.location.href = res.checkoutUrl;
          } else {
            // Simulated razorpay fallback UI completion
            navigate(`/fees/success?paymentId=${payment._id}&gateway=${selectedGateway}&orderId=${res.orderId}&simulated=true&paymentMethod=${encodeURIComponent(selectedOnlineMethod)}`);
          }
        }
      } else {
        // Offline Submission Claim
        const payload = {
          paymentId: payment._id,
          paymentMethod: selectedOfflineMethod,
          remarks: `Method: ${selectedOfflineMethod}. Remarks: ${offlineRemarks}. Applied Discount: ${appliedDiscount} USD. Total Submitted: ${totalDue} USD.`,
        };

        await paymentService.recordOfflinePayment(payload);
        toast.success("Offline payment proof submitted. Awaiting verification!");
        navigate("/fees");
      }
    } catch (err) {
      toast.error(err.message || "Failed to initiate payment");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <Loader />;
  if (!payment) return <div className="card text-center p-8">Invoiced record not found.</div>;

  return (
    <div>
      <Header
        title="Complete Fee Payment"
        subtitle={`Select your preferred settlement gateway or upload offline draft details.`}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Bill Summary */}
        <div className="lg:col-span-1">
          <Card title="Invoice Summary">
            <div className="space-y-3 mt-4" style={{ fontSize: "0.95rem" }}>
              <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
                <strong style={{ color: "var(--text-secondary)", display: "block" }}>Fee Category</strong>
                <span style={{ fontWeight: 600 }}>{payment.feeCategory}</span>
              </div>
              <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
                <strong style={{ color: "var(--text-secondary)", display: "block" }}>Student Name</strong>
                <span>{payment.studentName}</span>
              </div>
              <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
                <strong style={{ color: "var(--text-secondary)", display: "block" }}>Semester / Period</strong>
                <span>{`${payment.class} (${payment.semester})`}</span>
              </div>
              <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
                <strong style={{ color: "var(--text-secondary)", display: "block" }}>Due Date</strong>
                <span style={{ color: "var(--danger)", fontWeight: 600 }}>{formatDate(payment.createdAt)}</span>
              </div>

              {/* Coupon / Scholarship Section */}
              <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }} className="mt-4">
                <strong style={{ color: "var(--text-secondary)", display: "block", marginBottom: "0.5rem" }}>
                  Scholarship Coupon
                </strong>
                {appliedCouponName ? (
                  <div className="flex justify-between items-center bg-success-light p-2 rounded text-success">
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{appliedCouponName}</span>
                    <button type="button" onClick={handleClearCoupon} style={{ background: "none", border: "none", color: "var(--danger)", fontWeight: "bold", cursor: "pointer" }}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="input"
                      style={{ padding: "0.4rem 0.6rem", fontSize: "0.85rem", width: "100%" }}
                      placeholder="e.g. SCHOLAR50"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="secondary" style={{ padding: "0.4rem 0.8rem", fontSize: "0.85rem" }} onClick={handleApplyCoupon}>
                      <FiTag /> Apply
                    </Button>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <div className="flex justify-between">
                  <span>Subtotal Amount:</span>
                  <span>{formatCurrency(payment.dueAmount)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount:</span>
                    <span>-{formatCurrency(appliedDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between mt-2 pt-2" style={{ borderTop: "2px solid var(--border)", fontWeight: 700, fontSize: "1.1rem", color: "var(--primary)" }}>
                  <span>Total Payable:</span>
                  <span>{formatCurrency(totalDue)}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Payment Methods Choice Form */}
        <div className="lg:col-span-2">
          <Card title="Choose Payment Method">
            <form onSubmit={handlePayment} className="space-y-6 mt-4">
              {/* Selector Tabs */}
              <div className="flex border rounded p-1" style={{ borderColor: "var(--border)" }}>
                <button
                  type="button"
                  onClick={() => setPaymentType("online")}
                  className={`flex-1 py-2 text-center rounded font-semibold ${paymentType === "online" ? "bg-primary text-white" : "bg-transparent text-secondary"}`}
                  style={{ transition: "all 0.2s" }}
                >
                  <FiCreditCard style={{ display: "inline", marginRight: "0.5rem" }} /> Pay Online (Gateways)
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType("offline")}
                  className={`flex-1 py-2 text-center rounded font-semibold ${paymentType === "offline" ? "bg-primary text-white" : "bg-transparent text-secondary"}`}
                  style={{ transition: "all 0.2s" }}
                >
                  <FiCheckCircle style={{ display: "inline", marginRight: "0.5rem" }} /> Submit Offline Payment Proof
                </button>
              </div>

              {/* Online Gateways Box */}
              {paymentType === "online" && (
                <div className="space-y-4">
                  <div className="p-3 bg-light rounded" style={{ borderLeft: "4px solid var(--primary)" }}>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", margin: 0 }}>
                      Choose your preferred payment method and settlement gateway. You will be redirected to the secure sandbox environment to finish payment.
                    </p>
                  </div>

                  <Dropdown
                    label="Online Payment Method"
                    name="onlineMethod"
                    value={selectedOnlineMethod}
                    onChange={(e) => setSelectedOnlineMethod(e.target.value)}
                    options={ONLINE_METHODS}
                    required
                  />

                  <div className="label-heading" style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "1rem" }}>
                    Select Settlement Gateway
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {["Stripe", "Razorpay", "PayPal"].map((gw) => (
                      <label
                        key={gw}
                        className={`border rounded p-4 text-center cursor-pointer flex flex-col items-center justify-center gap-2 ${selectedGateway === gw ? "border-primary bg-primary-light" : "border-gray-200"}`}
                        style={{ border: selectedGateway === gw ? "2px solid var(--primary)" : "1px solid var(--border)" }}
                      >
                        <input
                          type="radio"
                          name="gateway"
                          value={gw}
                          checked={selectedGateway === gw}
                          onChange={() => setSelectedGateway(gw)}
                          style={{ display: "none" }}
                        />
                        <strong style={{ fontSize: "1.05rem", color: selectedGateway === gw ? "var(--primary)" : "var(--text-main)" }}>
                          {gw}
                        </strong>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                          {gw === "Stripe" ? "Cards & Wallets" : gw === "Razorpay" ? "UPI & Netbanking" : "PayPal Checkout"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Offline Submission Box */}
              {paymentType === "offline" && (
                <div className="space-y-4">
                  <Dropdown
                    label="Offline Method Used"
                    name="offlineMethod"
                    value={selectedOfflineMethod}
                    onChange={(e) => setSelectedOfflineMethod(e.target.value)}
                    options={OFFLINE_METHODS}
                    required
                  />

                  <div>
                    <label className="label" style={{ fontWeight: 600 }}>Payment Verification Details</label>
                    <textarea
                      className="input"
                      style={{ width: "100%", height: "90px", padding: "0.5rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}
                      placeholder="Enter Bank Account, Branch, Transaction reference ID, Cheque Number, or Cash Deposit Date/Receipt info..."
                      value={offlineRemarks}
                      onChange={(e) => setOfflineRemarks(e.target.value)}
                      required
                    />
                    <small className="text-secondary" style={{ display: "block", marginTop: "0.25rem" }}>
                      Admin will verify this proof details with school ledger statements to validate payment.
                    </small>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-6">
                <Button
                  type="submit"
                  variant="success"
                  style={{ flex: 1 }}
                  loading={paying}
                >
                  {paymentType === "online" ? `Proceed with ${selectedGateway} Checkout` : "Submit Settlement Proof"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate("/fees")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PayFees;
