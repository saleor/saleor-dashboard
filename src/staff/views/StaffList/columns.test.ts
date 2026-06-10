import {
  getStaffListColumns,
  shouldMigrateStaffListColumns,
  staffListColumnsWithCustomer,
} from "./columns";

describe("staff list columns", () => {
  it("migrates the old default staff columns to include customer status", () => {
    // Arrange
    const columns = ["name", "email", "status"];

    // Act
    const shouldMigrate = shouldMigrateStaffListColumns(columns);
    const migratedColumns = getStaffListColumns(columns);

    // Assert
    expect(shouldMigrate).toBe(true);
    expect(migratedColumns).toEqual(staffListColumnsWithCustomer);
  });

  it("does not migrate custom staff columns", () => {
    // Arrange
    const columns = ["name", "status", "email"];

    // Act
    const shouldMigrate = shouldMigrateStaffListColumns(columns);
    const migratedColumns = getStaffListColumns(columns);

    // Assert
    expect(shouldMigrate).toBe(false);
    expect(migratedColumns).toBe(columns);
  });
});
