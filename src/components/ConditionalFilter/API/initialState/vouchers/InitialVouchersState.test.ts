import { UrlEntry, UrlToken } from "../../../ValueProvider/UrlToken";
import { InitialVouchersStateResponse } from "./InitialVouchersState";

describe("ConditionalFilter / API / Page / InitialVouchersState", () => {
  it("should filter by channel", () => {
    // Arrange
    const initialPageState = InitialVouchersStateResponse.empty();

    initialPageState.channels = [
      {
        label: "Channel 1",
        value: "chan-1",
        slug: "chan-1",
      },
      {
        label: "Channel 2",
        value: "chan-2",
        slug: "chan-2",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s0.channel", "chan-2"));
    const expectedOutput = [
      {
        label: "Channel 2",
        value: "chan-2",
        slug: "chan-2",
      },
    ];

    // Act
    const result = initialPageState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should filter by discount types", () => {
    // Arrange
    const initialPageState = InitialVouchersStateResponse.empty();

    initialPageState.discountType = [
      {
        label: "FIXED",
        value: "FIXED",
        slug: "FIXED",
      },
      {
        label: "PERCENTAGE",
        value: "PERCENTAGE",
        slug: "PERCENTAGE",
      },
      {
        label: "SHIPPING",
        value: "SHIPPING",
        slug: "SHIPPING",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s2.discountType", ["FIXED", "SHIPPING"]));
    const expectedOutput = [
      {
        label: "FIXED",
        value: "FIXED",
        slug: "FIXED",
      },
      {
        label: "SHIPPING",
        value: "SHIPPING",
        slug: "SHIPPING",
      },
    ];

    // Act
    const result = initialPageState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });

  it("should filter by voucher status", () => {
    // Arrange
    const initialPageState = InitialVouchersStateResponse.empty();

    initialPageState.voucherStatus = [
      {
        label: "ACTIVE",
        value: "ACTIVE",
        slug: "ACTIVE",
      },
      {
        label: "EXPIRED",
        value: "EXPIRED",
        slug: "EXPIRED",
      },
      {
        label: "SCHEDULED",
        value: "SCHEDULED",
        slug: "SCHEDULED",
      },
    ];

    const token = UrlToken.fromUrlEntry(new UrlEntry("s2.voucherStatus", ["ACTIVE", "SCHEDULED"]));
    const expectedOutput = [
      {
        label: "ACTIVE",
        value: "ACTIVE",
        slug: "ACTIVE",
      },
      {
        label: "SCHEDULED",
        value: "SCHEDULED",
        slug: "SCHEDULED",
      },
    ];

    // Act
    const result = initialPageState.filterByUrlToken(token);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
