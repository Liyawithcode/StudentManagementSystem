import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import Table from '../../components/common/Table.jsx';
import { studentService } from '../../services/studentService.js';
import { feeService } from '../../services/feeService.js';
import { toast } from '../../utils/toast.js';
import { formatDate } from '../../utils/dateFormatter.js';
import { formatCurrency } from '../../utils/helpers.js';
import { FiArrowLeft } from 'react-icons/fi';

export const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const studentRes = await studentService.getStudentById(id);
        const st = studentRes.student || studentRes;
        setStudent(st);

        // Fetch student fees
        const feeRes = await feeService.getFeesByStudent(st._id);
        setFees(feeRes.fees || feeRes || []);
      } catch (err) {
        toast.error('Failed to load student details');
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  if (loading) return <Loader />;

  return (
    <div>
      <Header
        title={`Academic Record: ${student ? `${student.firstName} ${student.lastName}` : ''}`}
        subtitle="Historical records of enrollment invoices, leave requests, and attendances."
        actions={
          <Link to="/students">
            <Button variant="secondary">
              <FiArrowLeft /> Back
            </Button>
          </Link>
        }
      />

      <div className="card mt-4">
        <h4 className="mb-4" style={{ fontFamily: 'Outfit', fontWeight: 600 }}>Billing Ledgers & Fees</h4>
        <Table
          headers={['Fee Title', 'Amount', 'Due Date', 'Status']}
          data={fees}
          renderRow={(fee) => (
            <tr key={fee._id}>
              <td style={{ fontWeight: 500 }}>{fee.title || 'Tuition Fee'}</td>
              <td>{formatCurrency(fee.amount)}</td>
              <td>{formatDate(fee.dueDate)}</td>
              <td>
                <span className={`badge ${fee.status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                  {fee.status || 'Pending'}
                </span>
              </td>
            </tr>
          )}
          emptyMessage="No billing records found for this student"
        />
      </div>
    </div>
  );
};

export default StudentDetails;
