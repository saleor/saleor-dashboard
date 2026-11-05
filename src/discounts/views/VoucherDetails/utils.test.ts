import { type VoucherCode } from "@dashboard/discounts/components/VoucherCodesDatagrid/types";

import { isCodesPageEmptiedBySave } from "./utils";

const page: VoucherCode[] = [
  { id: "code-11", code: "SPRING11", used: 0 },
  { id: "code-12", code: "SPRING12", used: 0 },
];

describe("isCodesPageEmptiedBySave", () => {
  it("is true when every code on a later page was removed", () => {
    // Arrange & Act
    const emptied = isCodesPageEmptiedBySave({
      pageCodes: page,
      removedIds: ["code-1", "code-11", "code-12"],
      hasPreviousPage: true,
    });

    // Assert
    expect(emptied).toBe(true);
  });

  it("is false while the page keeps a code", () => {
    // Arrange & Act
    const emptied = isCodesPageEmptiedBySave({
      pageCodes: page,
      removedIds: ["code-11"],
      hasPreviousPage: true,
    });

    // Assert
    expect(emptied).toBe(false);
  });

  it("is false on the first page", () => {
    // Arrange & Act
    const emptied = isCodesPageEmptiedBySave({
      pageCodes: page,
      removedIds: ["code-11", "code-12"],
      hasPreviousPage: false,
    });

    // Assert
    expect(emptied).toBe(false);
  });
});
