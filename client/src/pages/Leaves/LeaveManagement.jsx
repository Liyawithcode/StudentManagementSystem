import React, { useEffect, useState } from 'react';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { teacherService } from '../../services/teacherService.js';
import { studentService } from '../../services/studentService.js';
import { toast } from '../../utils/toast.js';
import { formatDate } from '../../utils/dateFormatter.js';
import { apiCall } from '../../redux/api/apiSlice.js';
import {
  FiFileText,
  FiPlus,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiBell,
  FiSend,
  FiUser
} from 'react-icons/fi';

export const LeaveManagement = () => {
  const { user, role } = useAuth();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    reason: '',
  });

  useEffect(() => {
    fetchLeaves();
  }, [user]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      if (role === 'admin') {
        const res = await apiCall('get', '/faculties/leave/all').catch(() => null) || await apiCall('get', '/admins/leaves').catch(() => ({ leaves: [] }));
        setLeaves(res.leaves || []);
      } else {
        const applicantId = user?.facultyId || user?.studentId || user?._id || '';
        const endpoint = role === 'faculty' ? `/faculties/leave/${applicantId}` : `/students/leave/${applicantId}`;
        const res = await apiCall('get', endpoint).catch(() => ({ leaves: [] }));
        setLeaves(res.leaves || []);
      }
    } catch (err) {
      toast.error('Failed to load leave records');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      toast.error('Please complete all required fields');
      return;
    }

    const applicantId = user?.facultyId || user?.studentId || user?._id;
    const applicantType = role === 'faculty' ? 'Faculty' : role === 'student' ? 'Student' : 'Staff';

    if (!applicantId) {
      toast.error('Applicant ID not found. Please log in again.');
      return;
    }

    setSubmitting(true);
    try {
      const endpoint = role === 'faculty' ? '/faculties/leave' : '/students/leave';
      const res = await apiCall('post', endpoint, {
        applicantId,
        applicantType,
        startDate: formData.startDate,
        endDate: formData.endDate,
        reason: formData.reason,
      });

      if (res.success) {
        toast.success(res.message || 'Leave request submitted successfully!');
        setIsApplyModalOpen(false);
        setFormData({ startDate: '', endDate: '', reason: '' });
        fetchLeaves();
      } else {
        toast.error(res.message || 'Failed to submit leave request');
      }
    } catch (err) {
      toast.error(err.message || 'Error submitting leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await apiCall('put', `/admins/leave/${id}/status`, { status }).catch(() =>
        apiCall('put', `/faculties/leave/${id}/status`, { status })
      );
      if (res.success) {
        toast.success(`Leave request ${status.toLowerCase()}!`);
        fetchLeaves();
      }
    } catch (err) {
      toast.error('Failed to update leave status');
    }
  };

  return (
    <div className="page-entrance">
      <Header
        title="Leave Management Portal"
        subtitle={
          role === 'faculty'
            ? 'Submit leave applications. Group students will automatically receive notifications on their dashboard.'
            : role === 'student'
            ? 'Submit personal leave applications and track request status.'
            : 'Review and approve/reject leave requests from faculty and students.'
        }
        actions={
          (role === 'faculty' || role === 'student') && (
            <Button variant="primary" onClick={() => setIsApplyModalOpen(true)}>
              <FiPlus /> Apply for Leave
            </Button>
          )
        }
      />

      {role === 'faculty' && (
        <div
          className="p-4 mb-4"
          style={{
            background: 'var(--primary-glow, rgba(59, 130, 246, 0.08))',
            border: '1px solid var(--primary, #3b82f6)',
            borderRadius: 'var(--radius-lg, 12px)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <FiBell style={{ fontSize: '1.4rem', color: 'var(--primary)' }} />
          <div>
            <strong style={{ color: 'var(--text-main)' }}>Automatic Student Group Broadcast Active</strong>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Submitting a leave request automatically sends live notices to the dashboards of all students enrolled in your assigned student groups!
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : (
        <Table
          headers={['Applicant ID', 'Type', 'Start Date', 'End Date', 'Reason', 'Status', 'Submitted At', 'Actions']}
          data={leaves}
          renderRow={(leave) => (
            <tr key={leave._id}>
              <td>
                <span className="badge badge-info" style={{ fontFamily: 'monospace' }}>
                  {leave.applicantId}
                </span>
              </td>
              <td style={{ fontWeight: 500 }}>{leave.applicantType}</td>
              <td>{formatDate(leave.startDate)}</td>
              <td>{formatDate(leave.endDate)}</td>
              <td style={{ maxWidth: '240px' }} className="truncate" title={leave.reason}>
                {leave.reason}
              </td>
              <td>
                <span
                  className={`badge ${
                    leave.status === 'Approved'
                      ? 'badge-success'
                      : leave.status === 'Rejected'
                      ? 'badge-danger'
                      : 'badge-warning'
                  }`}
                >
                  {leave.status === 'Approved' && <FiCheckCircle style={{ marginRight: '4px' }} />}
                  {leave.status === 'Rejected' && <FiXCircle style={{ marginRight: '4px' }} />}
                  {leave.status === 'pending' && <FiClock style={{ marginRight: '4px' }} />}
                  {leave.status}
                </span>
              </td>
              <td>{formatDate(leave.createdAt)}</td>
              <td>
                {role === 'admin' && leave.status === 'pending' ? (
                  <div className="flex gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleStatusUpdate(leave._id, 'Approved')}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleStatusUpdate(leave._id, 'Rejected')}
                    >
                      Reject
                    </Button>
                  </div>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No action required</span>
                )}
              </td>
            </tr>
          )}
          emptyMessage="No leave applications submitted yet."
        />
      )}

      {/* Apply Leave Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Submit Leave Application"
      >
        <form onSubmit={handleApplyLeave}>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                className="form-control"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date *</label>
              <input
                type="date"
                className="form-control"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group mt-3">
            <label className="form-label">Reason for Leave *</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="State clear reasons for your leave..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
          </div>

          {role === 'faculty' && (
            <div
              className="p-3 mt-3"
              style={{
                background: 'var(--bg-body, #f9fafb)',
                borderRadius: 'var(--radius-md, 8px)',
                border: '1px solid var(--border-color, #e5e7eb)',
                fontSize: '0.825rem',
                color: 'var(--text-muted)',
              }}
            >
              <FiSend style={{ color: 'var(--primary)', marginRight: '6px' }} />
              <strong>Note:</strong> All enrolled students in your assigned groups will receive a notification notice upon submission.
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" type="button" onClick={() => setIsApplyModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default LeaveManagement;
