import React, { useEffect, useState } from 'react';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import { examService } from '../../services/examService.js';
import { toast } from '../../utils/toast.js';
import { formatDate } from '../../utils/dateFormatter.js';
import { FiPlus, FiCalendar, FiFileText, FiDownload } from 'react-icons/fi';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';

export const ExamList = () => {
  const { role } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteExamId, setDeleteExamId] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await examService.getExamSchedules();
        setExams(res.exams || []);
      } catch (err) {
        toast.error('Failed to load exam schedules');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  const handleDelete = async () => {
    if (!deleteExamId) return;
    try {
      await examService.deleteExamSchedule(deleteExamId);
      toast.success('Exam schedule deleted');
      setExams(exams.filter((e) => (e._id || e.id) !== deleteExamId));
      setDeleteExamId(null);
    } catch (err) {
      toast.error('Failed to delete schedule');
    }
  };



  const handleDownloadExams = () => {
    if (exams.length === 0) {
      toast.error('No exam schedules available to download');
      return;
    }

    const title = "Semester Examination Schedule";
    const headers = ["Exam Name", "Date", "Time", "Room"];

    const rows = exams.map(exam => [
      exam.examName,
      formatDate(exam.examDate),
      exam.time || '-',
      exam.room || '-'
    ]);

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              color: #1e293b;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #4f46e5;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #4f46e5;
              margin: 0 0 10px 0;
              font-size: 28px;
            }
            .header p {
              margin: 0;
              color: #64748b;
              font-size: 14px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #e2e8f0;
              padding: 12px 15px;
              text-align: left;
            }
            th {
              background-color: #f1f5f9;
              color: #4f46e5;
              font-weight: 600;
            }
            tr:nth-child(even) {
              background-color: #f8fafc;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #94a3b8;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <p>IntelliCampus Portal</p>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
          </div>
          <table>
            <thead>
              <tr>
                ${headers.map(h => `<th>${h}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `
                <tr>
                  ${row.map(cell => `<td>${cell}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} IntelliCampus. All rights reserved.</p>
          </div>
        </body>
      </html>
    `);
    doc.close();

    iframe.contentWindow.focus();
    setTimeout(() => {
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    }, 500);
    toast.success('Exam schedule PDF generated successfully!');
  };

  return (
    <div>
      <Header
        title="Examination Schedules"
        subtitle="Manage upcoming semester examinations."
        actions={
          <div className="flex gap-2">
            {exams.length > 0 && (
              <Button variant="download" onClick={handleDownloadExams} className="btn-download flex items-center gap-2">
                <FiDownload /> Download PDF
              </Button>
            )}
            {['admin', 'faculty'].includes(role) && (
              <>
                <Link to="/exams/add">
                  <Button variant="primary"><FiPlus /> Schedule Exam</Button>
                </Link>
                <Link to="/exams/marks">
                  <Button variant="secondary"><FiFileText /> Enter Marks</Button>
                </Link>
              </>
            )}
          </div>
        }
      />

      {loading ? (
        <Loader />
      ) : (
        <div className="card mt-4">
          <Table
            headers={['Exam Name', 'Date', 'Time', 'Room', 'Actions']}
            data={exams}
            renderRow={(exam) => {
              const eid = exam._id || exam.id;
              return (
                <tr key={eid}>
                  <td style={{ fontWeight: 600 }}>{exam.examName}</td>
                  <td>{formatDate(exam.examDate)}</td>
                  <td>{exam.time || '-'}</td>
                  <td>{exam.room || '-'}</td>
                  <td>
                    {role === 'admin' && (
                      <Button variant="danger" style={{ padding: '0.4rem' }} onClick={() => setDeleteExamId(eid)}>
                        Cancel Exam
                      </Button>
                    )}
                  </td>
                </tr>
              );
            }}

            emptyMessage="No examinations scheduled at this time"
          />
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteExamId}
        onClose={() => setDeleteExamId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to cancel and delete this exam schedule? This action cannot be undone."
      />
    </div>
  );
};

export default ExamList;

