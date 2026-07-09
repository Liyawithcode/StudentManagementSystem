import React from 'react';
import Header from '../../components/layout/Header.jsx';

export const FeeReport = () => {
  return (
    <div>
      <Header title="Billing Ledger Reports" subtitle="Aggregate payment history summaries." />
      <div className="card mt-4 text-center">
        <p>Annual tuition aggregation audits are configured in the master administrator controls.</p>
      </div>
    </div>
  );
};

export default FeeReport;
