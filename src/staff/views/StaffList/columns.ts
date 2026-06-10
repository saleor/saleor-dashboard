const oldStaffListColumns = ["name", "email", "status"];

export const staffListColumnsWithCustomer = ["name", "status", "customer", "email"];

export const shouldMigrateStaffListColumns = (columns: string[] | undefined) =>
  columns?.length === oldStaffListColumns.length &&
  oldStaffListColumns.every((column, index) => columns[index] === column);

export const getStaffListColumns = (columns: string[] | undefined) =>
  shouldMigrateStaffListColumns(columns) ? staffListColumnsWithCustomer : columns;
