import {
  generateDraftVoucherCode,
  generateMultipleVoucherCodes,
} from "@dashboard/discounts/components/VoucherCreatePage/utils";
import { v4 as uuidv4 } from "uuid";

jest.mock("uuid");

describe("generateDraftVoucherCode", () => {
  it("should return draft voucher code", () => {
    // Act
    const draftVoucherCode = generateDraftVoucherCode("test1");

    // Assert
    expect(draftVoucherCode).toEqual({
      code: "test1",
      status: "Draft",
    });
  });
});

describe("generateMultipleVoucherCodes", () => {
  it("should return multiple voucher codes", () => {
    // Arrange
    (uuidv4 as jest.Mock).mockImplementation(() => "uuid");

    // Act
    const draftVoucherCodes = generateMultipleVoucherCodes("2", "test");

    // Assert
    expect(draftVoucherCodes).toEqual([
      { code: "test-uuid", status: "Draft" },
      { code: "test-uuid", status: "Draft" },
    ]);
  });
});
