import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchNotices } from '../../redux/slices/noticeSlice.js';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { FiPlus, FiEye, FiTrash } from 'react-icons/fi';
import { noticeService } from '../../services/noticeService.js';
import { formatDate } from '../../utils/dateFormatter.js';
import { toast } from '../../utils/toast.js';
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx';

export const NoticeList = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.notices);
  const { role } = useAuth();
  const [search, setSearch] = useState('');
  const [deleteNoticeId, setDeleteNoticeId] = useState(null);

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  const filteredNotices = list.filter((notice) => {
    const term = search.toLowerCase();
    const title = (notice.title || '').toLowerCase();
    return title.includes(term);
  });

  const handleDelete = async () => {
    if (!deleteNoticeId) return;
    try {
      await noticeService.deleteNotice(deleteNoticeId);
      toast.success('Notice deleted');
      setDeleteNoticeId(null);
      dispatch(fetchNotices());
    } catch (err) {
      toast.error('Failed to delete notice');
    }
  };


  return (
    <div>
      <Header
        title="Noticeboard Announcements"
        subtitle="General notices and announcements boards."
        actions={
          role === 'admin' && (
            <Link to="/notice/add">
              <Button variant="primary"><FiPlus /> Create Notice</Button>
            </Link>
          )
        }
      />


      <div className="flex justify-between items-center mb-4 flex-responsive">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by notice title..."
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <Table
          headers={['Notice Title', 'Date Posted', 'Actions']}
          data={filteredNotices}
          renderRow={(notice) => (
            <tr key={notice._id || notice.id}>
              <td style={{ fontWeight: 600 }}>{notice.title}</td>
              <td>{formatDate(notice.createdAt || notice.date)}</td>
              <td className="flex gap-2">
                <Link to={`/notice/details/${notice._id || notice.id}`}>
                  <Button variant="secondary" style={{ padding: '0.4rem' }}><FiEye /></Button>
                </Link>
                {role === 'admin' && (
                  <Button variant="danger" style={{ padding: '0.4rem' }} onClick={() => setDeleteNoticeId(notice._id || notice.id)}>
                    <FiTrash />
                  </Button>
                )}
              </td>
            </tr>
          )}
          emptyMessage="No notices currently posted"
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteNoticeId}
        onClose={() => setDeleteNoticeId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this notice? This action cannot be undone."
      />
    </div>
  );
};

export default NoticeList;

