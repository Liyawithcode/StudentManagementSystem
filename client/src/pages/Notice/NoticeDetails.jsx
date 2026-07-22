import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import { noticeService } from '../../services/noticeService.js';
import { formatDate } from '../../utils/dateFormatter.js';
import { toast } from '../../utils/toast.js';
import { useAuth } from '../../hooks/useAuth.js';
import { FiArrowLeft, FiTrash } from 'react-icons/fi';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';

export const NoticeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await noticeService.getNotices();
        const found = (res.notices || res || []).find((n) => (n._id || n.id) === id);
        setNotice(found);
      } catch (err) {
        console.error('Failed to load notices list');
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleDelete = async () => {
    try {
      await noticeService.deleteNotice(id);
      toast.success('Notice deleted successfully');
      navigate('/notice');
    } catch (err) {
      toast.error('Failed to delete notice');
    }
  };

  if (loading) return <Loader />;
  if (!notice) return <div className="text-center mt-8">Notice not found</div>;

  return (
    <div>
      <Header
        title={notice.title}
        subtitle={`Posted on ${formatDate(notice.createdAt || notice.date)}`}
        actions={
          <div className="flex gap-2">
            <Link to="/notice">
              <Button variant="secondary">
                <FiArrowLeft /> Back to Board
              </Button>
            </Link>
            {role === 'admin' && (
              <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                <FiTrash /> Delete Notice
              </Button>
            )}
          </div>
        }
      />

      <div className="card mt-4" style={{ maxWidth: '800px', padding: '2rem' }}>
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: 'var(--text-main)' }}>
          {notice.message || notice.content}
        </p>
      </div>

      <ConfirmDialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this notice? This action cannot be undone."
      />
    </div>
  );
};

export default NoticeDetails;

