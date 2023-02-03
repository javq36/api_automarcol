export const paginateAll = (array, pageSize) => {
  const pageCount = Math.ceil(array.length / pageSize);
  return Array.from({ length: pageCount }, (_, i) =>
    array.slice(i * pageSize, (i + 1) * pageSize)
  );
};
