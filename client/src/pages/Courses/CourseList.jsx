import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCourses } from '../../redux/slices/courseSlice.js';
import Header from '../../components/layout/Header.jsx';
import Table from '../../components/common/Table.jsx';
import SearchBar from '../../components/common/SearchBar.jsx';
import Loader from '../../components/common/Loader.jsx';
import Button from '../../components/common/Button.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { FiPlus, FiEdit, FiTrash } from 'react-icons/fi';
import { courseService } from '../../services/courseService.js';
import { toast } from '../../utils/toast.js';

export const CourseList = () => {
  const dispatch = useDispatch();
  const { coursesList, loading } = useSelector((state) => state.courses);
  const { role } = useAuth();
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const filteredCourses = coursesList.filter((course) => {
    const term = search.toLowerCase();
    const code = (course.courseCode || course.code || '').toLowerCase();
    const name = (course.courseName || course.name || '').toLowerCase();
    return code.includes(term) || name.includes(term);
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await courseService.deleteCourse(id);
      toast.success('Course deleted');
      dispatch(fetchCourses());
    } catch (err) {
      toast.error('Failed to delete course');
    }
  };

  return (
    <div>
      <Header
        title="Courses Registry"
        subtitle="Manage educational courses and program codes."
        actions={
          role === 'admin' && (
            <Link to="/courses/add">
              <Button variant="primary"><FiPlus /> Add Course</Button>
            </Link>
          )
        }
      />


      <div className="flex justify-between items-center mb-4 flex-responsive">
        <SearchBar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by course name or code..."
        />
      </div>

      {loading ? (
        <Loader />
      ) : (
        <Table
          headers={['Course Code', 'Course Name', 'Credits', 'Actions']}
          data={filteredCourses}
          renderRow={(course) => (
            <tr key={course._id}>
              <td style={{ fontWeight: 600 }}>{course.courseCode || course.code}</td>
              <td>{course.courseName || course.name}</td>
              <td>{course.credits || 3}</td>
              <td className="flex gap-2">
                {role === 'admin' && (
                  <>
                    <Link to={`/courses/edit/${course._id}`}>
                      <Button variant="secondary" style={{ padding: '0.4rem' }}><FiEdit /></Button>
                    </Link>
                    <Button variant="danger" style={{ padding: '0.4rem' }} onClick={() => handleDelete(course._id)}><FiTrash /></Button>
                  </>
                )}
              </td>
            </tr>
          )}
          emptyMessage="No courses matching criteria found"
        />
      )}
    </div>
  );
};

export default CourseList;
