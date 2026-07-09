import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/layout/Header.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import { noticeService } from '../../services/noticeService.js';
import { formatDate } from '../../utils/dateFormatter.js';
import { FiArrowLeft } from 'react-icons/fi';

export const NoticeDetails = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <Loader />;
  if (!notice) return <div className="text-center mt-8">Notice not found</div>;

  return (
    <div>
      <Header
        title={notice.title}
        subtitle={`Posted on ${formatDate(notice.createdAt || notice.date)}`}
        actions={
          <Link to="/notice">
            <Button variant="secondary">
              <FiArrowLeft /> Back to Board
            </Button>
          </Link>
        }
      />

      <div className="card mt-4" style={{ maxWidth: '800px', padding: '2rem' }}>
        <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: 'var(--text-main)' }}>
          {notice.message || notice.content}
        </p>
      </div>
    </div>
  );
};

export default NoticeDetails;
