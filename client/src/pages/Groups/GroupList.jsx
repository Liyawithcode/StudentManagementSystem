import React, { useEffect, useState } from 'react';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import Modal from '../../components/common/Modal.jsx';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { groupService } from '../../services/groupService.js';
import { teacherService } from '../../services/teacherService.js';
import { studentService } from '../../services/studentService.js';
import { toast } from '../../utils/toast.js';
import {
  FiUsers,
  FiPlus,
  FiEdit,
  FiTrash2,
  FiUserCheck,
  FiBookOpen,
  FiInfo,
  FiGrid,
  FiLayers
} from 'react-icons/fi';
import './groups.css';

export const GroupList = () => {
  const { user, role } = useAuth();
  const [groups, setGroups] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [selectedGroupDetails, setSelectedGroupDetails] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    department: 'Computer Science',
    facultyId: '',
    facultyName: '',
    studentIds: [],
    description: '',
  });

  // Confirm delete dialog state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [groupRes, teacherRes, studentRes] = await Promise.all([
        groupService.getAllGroups(),
        teacherService.getAllTeachers().catch(() => ({ teachers: [], faculties: [] })),
        studentService.getAllStudents().catch(() => ({ students: [] })),
      ]);

      setGroups(groupRes.groups || []);

      const teacherList = teacherRes.faculties || teacherRes.teachers || teacherRes.data || [];
      setTeachers(teacherList);

      const studentList = studentRes.students || studentRes.data || [];
      setStudents(studentList);
    } catch (err) {
      toast.error('Failed to load group system data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingGroup(null);
    setFormData({
      name: '',
      code: `GRP-${Math.floor(1000 + Math.random() * 9000)}`,
      department: user?.department || 'Computer Science',
      facultyId: role === 'faculty' ? (user?.facultyId || user?._id || '') : '',
      facultyName: role === 'faculty' ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim() : '',
      studentIds: [],
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name || '',
      code: group.code || '',
      department: group.department || 'General',
      facultyId: group.facultyId || '',
      facultyName: group.facultyName || '',
      studentIds: group.studentIds || [],
      description: group.description || '',
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code || !formData.facultyId) {
      toast.error('Please fill in Group Name, Code, and select an Assigned Faculty');
      return;
    }

    setSaving(true);
    try {
      // Find selected faculty name
      const selTeacher = teachers.find(
        (t) => t.facultyId === formData.facultyId || t._id === formData.facultyId
      );
      const facName = selTeacher
        ? `${selTeacher.firstName || ''} ${selTeacher.lastName || ''}`.trim()
        : formData.facultyName || 'Faculty Mentor';

      const payload = {
        ...formData,
        facultyName: facName,
      };

      if (editingGroup) {
        await groupService.updateGroup(editingGroup._id, payload);
        toast.success('Student group updated successfully');
      } else {
        await groupService.createGroup(payload);
        toast.success('New Student group created successfully');
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to save group');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await groupService.deleteGroup(deleteId);
      toast.success('Student group removed successfully');
      setDeleteId(null);
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Failed to delete group');
    } finally {
      setDeleting(false);
    }
  };

  const toggleStudentSelection = (studentId) => {
    setFormData((prev) => {
      const exists = prev.studentIds.includes(studentId);
      if (exists) {
        return { ...prev, studentIds: prev.studentIds.filter((id) => id !== studentId) };
      } else {
        return { ...prev, studentIds: [...prev.studentIds, studentId] };
      }
    });
  };

  const filteredGroups = groups.filter((g) => {
    const term = search.toLowerCase();
    return (
      (g.name && g.name.toLowerCase().includes(term)) ||
      (g.code && g.code.toLowerCase().includes(term)) ||
      (g.facultyName && g.facultyName.toLowerCase().includes(term)) ||
      (g.department && g.department.toLowerCase().includes(term))
    );
  });

  return (
    <div className="page-entrance">
      <Header
        title="Student Grouping System"
        subtitle="Manage academic student batches, assign faculty mentors, and sync dashboard notifications."
        actions={
          (role === 'admin' || role === 'faculty') && (
            <Button variant="primary" onClick={handleOpenAddModal}>
              <FiPlus /> Create Student Group
            </Button>
          )
        }
      />

      {/* Quick Summary Grid */}
      <div className="group-metrics-grid mb-4">
        <div className="group-metric-card">
          <div className="group-metric-icon" style={{ background: 'rgba(59, 130, 246, 0.12)', color: 'var(--primary)' }}>
            <FiLayers />
          </div>
          <div>
            <span className="group-metric-label">Total Groups</span>
            <h3 className="group-metric-val">{groups.length}</h3>
          </div>
        </div>

        <div className="group-metric-card">
          <div className="group-metric-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--success)' }}>
            <FiUserCheck />
          </div>
          <div>
            <span className="group-metric-label">Faculty Mentors</span>
            <h3 className="group-metric-val">
              {new Set(groups.map((g) => g.facultyId)).size}
            </h3>
          </div>
        </div>

        <div className="group-metric-card">
          <div className="group-metric-icon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--warning)' }}>
            <FiUsers />
          </div>
          <div>
            <span className="group-metric-label">Grouped Students</span>
            <h3 className="group-metric-val">
              {groups.reduce((sum, g) => sum + (g.studentIds ? g.studentIds.length : 0), 0)}
            </h3>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4 flex-responsive">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by group name, code, department, or faculty mentor..."
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <Table
          headers={['Group Code', 'Group Name', 'Department', 'Faculty Mentor', 'Students Count', 'Status', 'Actions']}
          data={filteredGroups}
          renderRow={(group) => (
            <tr key={group._id}>
              <td>
                <span className="badge badge-info" style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                  {group.code}
                </span>
              </td>
              <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{group.name}</td>
              <td>{group.department || 'General'}</td>
              <td>
                <span className="group-faculty-pill">
                  <FiUserCheck style={{ color: 'var(--primary)' }} />
                  {group.facultyName || group.facultyId || 'Unassigned'}
                </span>
              </td>
              <td>
                <span className="badge badge-success">
                  <FiUsers style={{ marginRight: '4px' }} />
                  {group.studentIds ? group.studentIds.length : 0} Enrolled
                </span>
              </td>
              <td>
                <span className={`badge ${group.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>
                  {group.status || 'Active'}
                </span>
              </td>
              <td className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedGroupDetails(group)}
                  title="View Details"
                >
                  <FiInfo />
                </Button>
                {(role === 'admin' || role === 'faculty') && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleOpenEditModal(group)}
                    title="Edit Group"
                  >
                    <FiEdit />
                  </Button>
                )}
                {role === 'admin' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeleteId(group._id)}
                    title="Delete Group"
                  >
                    <FiTrash2 />
                  </Button>
                )}
              </td>
            </tr>
          )}
          emptyMessage="No student groups created yet. Click 'Create Student Group' to get started."
        />
      )}

      {/* Group Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingGroup ? 'Edit Student Group' : 'Create New Student Group'}
      >
        <form onSubmit={handleFormSubmit} className="group-form">
          <div className="form-group">
            <label className="form-label">Group Name *</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Computer Science 2026 - Section A"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Group Code *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. CS2026-A"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Computer Science"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Faculty Mentor *</label>
            <select
              className="form-control"
              value={formData.facultyId}
              onChange={(e) => {
                const fid = e.target.value;
                const selFac = teachers.find((t) => (t.facultyId || t._id) === fid);
                setFormData({
                  ...formData,
                  facultyId: fid,
                  facultyName: selFac ? `${selFac.firstName || ''} ${selFac.lastName || ''}`.trim() : '',
                });
              }}
              required
            >
              <option value="">-- Select Faculty Mentor --</option>
              {teachers.map((t) => {
                const facId = t.facultyId || t._id;
                const name = `${t.firstName || ''} ${t.lastName || ''}`.trim() || t.email;
                return (
                  <option key={facId} value={facId}>
                    {name} ({t.department || 'General'}) - ID: {facId}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Student Multiselect Picker */}
          <div className="form-group">
            <label className="form-label">
              Enroll Group Students ({formData.studentIds.length} Selected)
            </label>
            <div className="student-picker-container">
              {students.length === 0 ? (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No student profiles available</div>
              ) : (
                students.map((st) => {
                  const stId = st.studentId || st._id;
                  const stName = `${st.firstName || ''} ${st.lastName || ''}`.trim() || st.email;
                  const isChecked = formData.studentIds.includes(stId);
                  return (
                    <div
                      key={stId}
                      className={`student-picker-item ${isChecked ? 'selected' : ''}`}
                      onClick={() => toggleStudentSelection(stId)}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        style={{ pointerEvents: 'none' }}
                      />
                      <span>
                        <strong>{stName}</strong> <small>({stId})</small>
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description / Remarks</label>
            <textarea
              className="form-control"
              rows="3"
              placeholder="Provide optional details about group syllabus, meeting room, or objectives..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? 'Saving...' : editingGroup ? 'Update Group' : 'Create Group'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Group Detail View Dialog */}
      <Modal
        isOpen={!!selectedGroupDetails}
        onClose={() => setSelectedGroupDetails(null)}
        title="Student Group Details"
      >
        {selectedGroupDetails && (
          <div>
            <div className="group-detail-header mb-4">
              <span className="badge badge-info" style={{ fontFamily: 'monospace' }}>
                {selectedGroupDetails.code}
              </span>
              <h3 style={{ margin: '0.5rem 0 0.25rem 0', fontFamily: 'Outfit' }}>{selectedGroupDetails.name}</h3>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Department: {selectedGroupDetails.department}</p>
            </div>

            <div className="group-detail-meta mb-4">
              <div>
                <strong>Faculty Mentor:</strong> {selectedGroupDetails.facultyName || selectedGroupDetails.facultyId}
              </div>
              <div>
                <strong>Total Students Enrolled:</strong> {selectedGroupDetails.studentIds ? selectedGroupDetails.studentIds.length : 0}
              </div>
              {selectedGroupDetails.description && (
                <div style={{ marginTop: '0.5rem' }}>
                  <strong>Description:</strong> {selectedGroupDetails.description}
                </div>
              )}
            </div>

            <h4 style={{ fontFamily: 'Outfit', fontWeight: 600, marginBottom: '0.5rem' }}>
              Enrolled Students List
            </h4>
            <div className="enrolled-students-list">
              {selectedGroupDetails.studentIds && selectedGroupDetails.studentIds.length > 0 ? (
                selectedGroupDetails.studentIds.map((stId, index) => {
                  const studentObj = students.find((s) => s.studentId === stId || s._id === stId);
                  return (
                    <div key={stId || index} className="enrolled-student-chip">
                      <FiUsers style={{ color: 'var(--primary)' }} />
                      <span>
                        {studentObj ? `${studentObj.firstName} ${studentObj.lastName}` : stId}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No students currently assigned to this group.</p>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <Button variant="secondary" onClick={() => setSelectedGroupDetails(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Student Group"
        message="Are you sure you want to remove this student group? This action cannot be undone."
        loading={deleting}
      />
    </div>
  );
};

export default GroupList;
