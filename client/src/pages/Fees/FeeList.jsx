import React, { useEffect, useState } from 'react';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { feeService } from '../../services/feeService.js';
import { toast } from '../../utils/toast.js';
import { formatDate } from '../../utils/dateFormatter.js';
import { formatCurrency } from '../../utils/helpers.js';
import { FiPlus, FiDollarSign, FiCheckCircle } from 'react-icons/fi';

export const FeeList = () => {
  const { role, user } = useAuth();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        let res;
        if (role === 'student') {
          // Students see only their own fees — try _id first, fallback to studentId
          const studentIdentifier = user?._id || user?.studentId;
          res = await feeService.getFeesByStudent(studentIdentifier);
        } else {
          // Admin / Faculty see all fees
          res = await feeService.getAllFees();
        }
        setFees(res.fees || []);
      } catch (err) {
        toast.error('Failed to load fee ledger');
      } finally {
        setLoading(false);
      }
    };
    fetchFees();
  }, [role, user]);

  const handleMarkPaid = async (feeId, paymentMethod) => {
    try {
      await feeService.updatePayment(feeId, { feeStatus: 'Paid', paymentMethod });
      toast.success('Payment marked as Paid!');
      setFees(fees.map((f) => f._id === feeId ? { ...f, feeStatus: 'Paid' } : f));
    } catch (err) {
      toast.error(err.message || 'Failed to update payment');
    }
  };

  return (
    <div>
      <Header
        title={role === 'student' ? 'My Fee Records' : 'Fee & Billing Ledgers'}
        subtitle={role === 'student' ? 'View your fee payment history and due invoices.' : 'Manage student tuitions, collections, and invoicing statuses.'}
        actions={
          role === 'admin' && (
            <Link to="/fees/collect">
              <Button variant="primary"><FiPlus /> Record Payment</Button>
            </Link>
          )
        }
      />

      {loading ? (
        <Loader />
      ) : (
        <div className="card mt-4">
          <Table
            headers={['Invoice ID', 'Student', 'Fee Type', 'Amount', 'Due Date', 'Method', 'Status', ...(role === 'admin' ? ['Actions'] : [])]}
            data={fees}
            renderRow={(fee) => (
              <tr key={fee._id}>
                <td>#{fee._id ? fee._id.slice(-6).toUpperCase() : 'N/A'}</td>
                <td style={{ fontWeight: 500 }}>{fee.studentId || '-'}</td>
                <td>{fee.feeType || '-'}</td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(fee.feeAmount)}</td>
                <td>{formatDate(fee.dueDate)}</td>
                <td>
                  <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                    {fee.paymentMethod || 'CASH'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${
                    fee.feeStatus === 'Paid' ? 'badge-success' :
                    fee.feeStatus === 'Partial' ? 'badge-warning' :
                    'badge-danger'
                  }`}>
                    {fee.feeStatus === 'Paid' ? '✓ Paid' :
                     fee.feeStatus === 'Partial' ? '◐ Partial' :
                     '✗ Unpaid'}
                  </span>
                </td>
                {role === 'admin' && (
                  <td>
                    {fee.feeStatus !== 'Paid' && (
                      <Button
                        variant="success"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                        onClick={() => handleMarkPaid(fee._id, fee.paymentMethod)}
                      >
                        <FiCheckCircle /> Mark Paid
                      </Button>
                    )}
                  </td>
                )}
              </tr>
            )}
            emptyMessage="No billing or tuition records found"
          />
        </div>
      )}
    </div>
  );
};

export default FeeList;
