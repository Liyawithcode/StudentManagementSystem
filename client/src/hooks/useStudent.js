import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudents, fetchStudentById } from '../redux/slices/studentSlice.js';

export const useStudent = (studentId = null) => {
  const dispatch = useDispatch();
  const { list, currentStudent, loading, error } = useSelector((state) => state.students);

  useEffect(() => {
    if (studentId) {
      dispatch(fetchStudentById(studentId));
    } else {
      dispatch(fetchStudents());
    }
  }, [dispatch, studentId]);

  return { students: list, student: currentStudent, loading, error };
};
export default useStudent;
