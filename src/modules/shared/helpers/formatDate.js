export const formatDate = (dateStr) => {
  if (!dateStr) {
    return '';
  }

  const cleanDate = String(dateStr).split('T')[0];
  const parts = cleanDate.split('-');

  if (parts.length !== 3) {
    return cleanDate;
  }

  const [year, month, day] = parts;

  return `${day}/${month}/${year}`;
};
