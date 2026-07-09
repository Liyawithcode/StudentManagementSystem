import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchNotices } from '../../redux/slices/noticeSlice.js';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { FiPlus, FiEye, FiTrash } from 'react-icons/fi';
import { noticeService } from '../../services/noticeService.js';
import { formatDate } from '../../utils/dateFormatter.js';
import { toast } from '../../utils/toast.js';

export const NoticeList = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.notices);
  const { role } = useAuth();

  useEffect(() => {
    dispatch(fetchNotices());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      await noticeService.deleteNotice(id);
      toast.success('Notice deleted');
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

      {loading ? (
        <Loader />
      ) : (
        <Table
          headers={['Notice Title', 'Date Posted', 'Actions']}
          data={list}
          renderRow={(notice) => (
            <tr key={notice._id || notice.id}>
              <td style={{ fontWeight: 600 }}>{notice.title}</td>
              <td>{formatDate(notice.createdAt || notice.date)}</td>
              <td className="flex gap-2">
                <Link to={`/notice/details/${notice._id || notice.id}`}>
                  <Button variant="secondary" style={{ padding: '0.4rem' }}><FiEye /></Button>
                </Link>
                {role === 'admin' && (
                  <Button variant="danger" style={{ padding: '0.4rem' }} onClick={() => handleDelete(notice._id || notice.id)}>
                    <FiTrash />
                  </Button>
                )}
              </td>
            </tr>
          )}
          emptyMessage="No notices currently posted"
        />
      )}
    </div>
  );
};

export default NoticeList;
