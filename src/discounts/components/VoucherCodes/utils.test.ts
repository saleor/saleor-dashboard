import { hasSavedVoucherCodesToDelete } from "./utils";

describe("hasSavedVoucherCodesToDelete", () => {
  it("should return true if there are saved voucher codes to delete", () => {
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

    expect(hasSavedVoucherCodesToDelete(voucherCodesIdsToDelete, voucherCodes)).toBe(true);
  });
  it("should return false if there are no saved voucher codes to delete", () => {
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

    expect(hasSavedVoucherCodesToDelete(voucherCodesIdsToDelete, voucherCodes)).toBe(false);
  });
});
