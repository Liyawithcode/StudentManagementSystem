import React from 'react';
import Header from '../../components/layout/Header.jsx';
import AttendanceChart from '../../components/charts/AttendanceChart.jsx';

export const AttendanceReport = () => {
  return (
    <div>
      <Header title="Attendance Reports" subtitle="Aggregate logs analytics visualization." />
      <div className="card mt-4">
        <h4 className="mb-4" style={{ fontFamily: 'Outfit', fontWeight: 600 }}>Monthly Attendance Averages</h4>
        <AttendanceChart />
      </div>
    </div>
  );
};

export default AttendanceReport;
