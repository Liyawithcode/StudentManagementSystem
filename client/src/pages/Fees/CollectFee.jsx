import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Input from '../../components/common/Input.jsx';
import Dropdown from '../../components/common/Dropdown.jsx';
import Button from '../../components/common/Button.jsx';
import { studentService } from '../../services/studentService.js';
import { feeService } from '../../services/feeService.js';
import { toast } from '../../utils/toast.js';

const FEE_TYPES = [
  { value: 'Admission', label: 'Admission' },
  { value: 'Examination', label: 'Examination' },
  { value: 'Hostel', label: 'Hostel' },
  { value: 'Library', label: 'Library' },
  { value: 'Other', label: 'Other' },
];

const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CARD', label: 'Card' },
  { value: 'UPI', label: 'UPI' },
  { value: 'BANK_TRANSFER', label: 'Bank Transfer' },
];

export const CollectFee = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    feeType: 'Admission',
    feeAmount: '',
    dueDate: '',
    paymentMethod: 'CASH',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const res = await studentService.getAllStudents();
        setStudents(res.students || []);
      } catch (err) {
        toast.error('Failed to load student lists');
      }
    };
    loadStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await feeService.createFee({
        studentId: formData.studentId,
        courseId: formData.courseId,
        feeType: formData.feeType,
        feeAmount: Number(formData.feeAmount),
        dueDate: formData.dueDate,
        paymentMethod: formData.paymentMethod,
      });
      toast.success('Invoice created successfully!');
      navigate('/fees');
    } catch (err) {
      toast.error(err.message || 'Failed to generate fee record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Generate Invoice Ledger" subtitle="Record or charge fees to student profiles." />
      <div className="card mt-4" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <Dropdown
            label="Enrolled Student"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            options={students.map((s) => ({ value: s._id, label: `${s.firstName} ${s.lastName} (${s.studentId})` }))}
            required
          />
          <Input
            label="Course ID"
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            required
            placeholder="e.g. CS101"
          />
          <Dropdown
            label="Fee Type"
            name="feeType"
            value={formData.feeType}
            onChange={handleChange}
            options={FEE_TYPES}
            required
          />
          <Input
            label="Fee Amount ($)"
            name="feeAmount"
            type="number"
            value={formData.feeAmount}
            onChange={handleChange}
            required
            placeholder="0.00"
          />
          <Input
            label="Payment Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
            required
          />
          <Dropdown
            label="Payment Method"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            options={PAYMENT_METHODS}
          />
          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="primary" loading={loading}>Record Invoice</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/fees')}>Cancel</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectFee;

