export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatWeight = (weight) => {
  return `${parseFloat(weight).toFixed(2)}g`;
};

export const formatCarat = (carat) => {
  return `${parseFloat(carat).toFixed(1)}K`;
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

export const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'approved':
      return 'success';
    case 'inactive':
    case 'rejected':
      return 'danger';
    case 'pending':
      return 'warning';
    default:
      return 'secondary';
  }
};