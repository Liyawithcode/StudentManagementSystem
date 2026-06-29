export const generateReport = (title, summary, data = {}) => {
  return {
    title,
    generatedAt: new Date(),
    summary,
    data,
    status: "Draft"
  };
};

export default generateReport;
