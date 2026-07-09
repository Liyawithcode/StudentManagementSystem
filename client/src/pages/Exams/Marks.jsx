import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Dropdown from '../../components/common/Dropdown.jsx';
import Table from '../../components/common/Table.jsx';
import { studentService } from '../../services/studentService.js';
import { examService } from '../../services/examService.js';
import { toast } from '../../utils/toast.js';

export const Marks = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const sRes = await studentService.getAllStudents();
        setStudents(sRes.students || sRes || []);

        const eRes = await examService.getExamSchedules();
        setExams(eRes.schedules || eRes || []);
      } catch (err) {
        toast.error('Failed to load students/exams');
      }
    };
    loadDetails();
  }, []);

  const handleMarksChange = (studentId, value) => {
    setMarks({ ...marks, [studentId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExam) return toast.error('Please select an exam');
    setLoading(true);
    try {
      const records = students.map((s) => ({
        studentId: s._id,
        marksObtained: Number(marks[s._id] || 0),
      }));

      await examService.enterMarks({
        examId: selectedExam,
        records,
      });

      toast.success('Marks recorded successfully!');
      navigate('/exams');
    } catch (err) {
      toast.error(err.message || 'Failed to submit marks');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header title="Enter Examination Marks" subtitle="Log academic performance scores." />

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="card mb-4" style={{ maxWidth: '400px' }}>
          <Dropdown
            label="Select Exam Sheet"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            options={exams.map((ex) => ({ value: ex._id, label: ex.examName || ex.name }))}
            required
          />
        </div>

        <div className="card">
          <Table
            headers={['Student ID', 'Student Name', 'Marks Obtained (out of 100)']}
            data={students}
            renderRow={(student) => (
              <tr key={student._id}>
                <td>{student.studentId || 'N/A'}</td>
                <td style={{ fontWeight: 500 }}>{student.firstName} {student.lastName}</td>
                <td>
                  <Input
                    type="number"
                    style={{ maxWidth: '100px', margin: 0 }}
                    value={marks[student._id] || ''}
                    onChange={(e) => handleMarksChange(student._id, e.target.value)}
                    placeholder="0"
                    min="0"
                    max="100"
                  />
                </td>
              </tr>
            )}
          />

          <div className="flex gap-4 mt-6">
            <Button type="submit" variant="primary" loading={loading}>Save Marks Ledger</Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/exams')}>Cancel</Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Marks;
