export const byDuplicates = <T extends { id: string }>(column: T, index: number, self: T[]) =>
  self.findIndex(c => c.id === column.id) === index;
