import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import Card from "../../components/common/Card.jsx";
import Button from "../../components/common/Button.jsx";
import { FiXCircle, FiDollarSign } from "react-icons/fi";

export const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  return (
    <div style={{ maxWidth: "500px", margin: "5rem auto" }}>
      <Card title="">
        <div className="text-center p-6 space-y-4">
          <FiXCircle size={64} className="text-danger mx-auto" />
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "var(--danger)" }}>Checkout Cancelled or Failed</h2>
          <p className="text-secondary" style={{ fontSize: "0.95rem" }}>
            The payment gateway session was terminated or declined. No funds were debited from your account.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            {paymentId && (
              <Link to={`/fees/pay/${paymentId}`} style={{ flex: 1 }}>
                <Button variant="primary" style={{ width: "100%" }}>
                  <FiDollarSign /> Retry Checkout
                </Button>
              </Link>
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

export default PaymentFailed;
