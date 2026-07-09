export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const getStatusBadgeClass = (status) => {
  const s = status ? status.toLowerCase() : '';
  if (['present', 'paid', 'approved', 'active'].includes(s)) return 'badge-success';
  if (['pending', 'partial', 'late'].includes(s)) return 'badge-warning';
  if (['absent', 'overdue', 'rejected', 'inactive'].includes(s)) return 'badge-danger';
  return 'badge-info';
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
