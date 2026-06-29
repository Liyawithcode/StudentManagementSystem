export const calculatePercentage = (obtained, total) => {
  if (!total || isNaN(obtained) || isNaN(total)) return 0;
  return parseFloat(((obtained / total) * 100).toFixed(2));
};

export default calculatePercentage;
