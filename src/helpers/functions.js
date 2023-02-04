export const paginateAll = (array, pageSize) => {
  const pageCount = Math.ceil(array.length / pageSize);
  return Array.from({ length: pageCount }, (_, i) =>
    array.slice(i * pageSize, (i + 1) * pageSize)
  );
};


export const formatCOP = amount => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(amount);
};