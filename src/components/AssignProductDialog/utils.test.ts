import { ChannelVoucherData } from "@dashboard/channels/utils";

import { ProductChannels } from "./types";
import { isProductAvailableInVoucherChannels } from "./utils";

describe("isProductAvailableInVoucherChannels", () => {
  it("should return trun when product has at least one channel common with voucher", () => {
    // Arrange
    const mockProductChannels = [
      { channel: { id: "1" } },
      { channel: { id: "2" } },
    ] as ProductChannels;
    const mockVariantChannels = [
      { id: "1" },
      { id: "33" },
    ] as ChannelVoucherData[];

    // Act
    const result = isProductAvailableInVoucherChannels(
      mockProductChannels,
      mockVariantChannels,
    );

    // Assert
    expect(result).toBe(true);
  });

  it("should return false when product has not common channels with voucher", () => {
    // Arrange
    const mockProductChannels = [
      { channel: { id: "1" } },
      { channel: { id: "2" } },
    ] as ProductChannels;
    const mockVariantChannels = [
      { id: "12" },
      { id: "33" },
    ] as ChannelVoucherData[];

    // Act
    const result = isProductAvailableInVoucherChannels(
      mockProductChannels,
      mockVariantChannels,
    );

    // Assert
    expect(result).toBe(false);
  });

  it("should return false when no product channels", () => {
    // Arrange
    const mockProductChannels = [] as ProductChannels;

    const mockVariantChannels = [
      { id: "12" },
      { id: "33" },
    ] as ChannelVoucherData[];

    // Act
    const result = isProductAvailableInVoucherChannels(
      mockProductChannels,
      mockVariantChannels,
    );

    // Assert
    expect(result).toBe(false);
  });

  it("should return false when no voucher channels", () => {
    // Arrange
    const mockProductChannels = [
      { channel: { id: "1" } },
      { channel: { id: "2" } },
    ] as ProductChannels;
    const mockVariantChannels = [] as ChannelVoucherData[];

    // Act
    const result = isProductAvailableInVoucherChannels(
      mockProductChannels,
      mockVariantChannels,
    );

    // Assert
    expect(result).toBe(false);
  });

  it("should return false when no voucher and product channels", () => {
    // Arrange
    const mockProductChannels = [] as ProductChannels;
    const mockVariantChannels = [] as ChannelVoucherData[];

    // Act
    const result = isProductAvailableInVoucherChannels(
      mockProductChannels,
      mockVariantChannels,
    );

    // Assert
    expect(result).toBe(false);
  });
});
