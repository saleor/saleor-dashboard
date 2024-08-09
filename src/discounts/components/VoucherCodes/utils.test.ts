import { hasSavedVoucherCodesToDelete } from "./utils";

describe("hasSavedVoucherCodesToDelete", () => {
  it("should return true if there are saved voucher codes to delete", () => {
    // Arrange
    const voucherCodesIdsToDelete = ["voucherCode1", "voucherCode2"];
    const voucherCodes = [
      {
        code: "voucherCode1",
        isActive: true,
      },
      {
        code: "voucherCode1",
        status: "Draft",
      },
      {
        code: "voucherCode2",
        isActive: false,
      },
    ];

    // Act
    const result = hasSavedVoucherCodesToDelete(voucherCodesIdsToDelete, voucherCodes);

    // Assert
    expect(result).toBe(true);
  });
  it("should return false if there are no saved voucher codes to delete", () => {
    // Arrange
    const voucherCodesIdsToDelete = ["voucherCode1", "voucherCode2"];
    const voucherCodes = [
      {
        code: "voucherCode1",
        status: "Draft",
      },
      {
        code: "voucherCode2",
        status: "Draft",
      },
    ];

    // Act
    const result = hasSavedVoucherCodesToDelete(voucherCodesIdsToDelete, voucherCodes);

    // Assert
    expect(result).toBe(false);
  });
});
