export const byDuplicates = (column, index, self) =>
  self.findIndex(c => c.id === column.id) === index;
