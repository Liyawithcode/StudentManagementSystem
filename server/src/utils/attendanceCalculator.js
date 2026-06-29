export const calculateAttendanceStats = (records = []) => {
  const totalClasses = records.length;
  if (totalClasses === 0) {
    return {
      totalClasses: 0,
      presentCount: 0,
      absentCount: 0,
      attendancePercentage: 0
    };
  }

  const presentCount = records.filter(r => r.status === "Present" || r.status === "present" || r.status === "P").length;
  const absentCount = totalClasses - presentCount;
  const attendancePercentage = parseFloat(((presentCount / totalClasses) * 100).toFixed(2));

  return {
    totalClasses,
    presentCount,
    absentCount,
    attendancePercentage
  };
};

export default calculateAttendanceStats;
