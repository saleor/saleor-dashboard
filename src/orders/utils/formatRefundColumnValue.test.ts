import { Locale } from "@dashboard/components/Locale";

import { formatRefundColumnValue } from "./formatRefundColumnValue";

describe("formatRefundColumnValue", () => {
  it("returns dash when quantity is zero", () => {
    // Arrange // Act
    const value = formatRefundColumnValue(0, { amount: 10, currency: "USD" }, Locale.EN);

    // Assert
    expect(value).toBe("—");
  });

  it("returns quantity and formatted money when both are available", () => {
    // Arrange // Act
    const value = formatRefundColumnValue(2, { amount: 25, currency: "USD" }, Locale.EN);

    // Assert
    expect(value).toBe("2 · $25.00");
  });
});
