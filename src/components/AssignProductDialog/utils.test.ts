import { type ProductChannels, type SelectedChannel } from "./types";
import {
  getSelectedIdsFromDict,
  hasMultiSelectionChanged,
  hasSingleSelectionChanged,
  isProductAvailableInVoucherChannels,
} from "./utils";

describe("getSelectedIdsFromDict", () => {
  it("returns only ids marked as selected, sorted", () => {
    // Arrange
    const selection: Record<string, boolean> = {
      "product-2": true,
      "product-1": true,
      "product-3": false,
    };

    // Act
    const result = getSelectedIdsFromDict(selection);

    // Assert
    expect(result).toEqual(["product-1", "product-2"]);
  });
});

describe("hasMultiSelectionChanged", () => {
  it("returns false when selection matches initial state", () => {
    // Arrange
    const initial: Record<string, boolean> = { "product-1": true };

    // Act
    const result = hasMultiSelectionChanged(initial, initial);

    // Assert
    expect(result).toBe(false);
  });

  it("returns true when a new product is selected", () => {
    // Arrange
    const initial: Record<string, boolean> = {};
    const current: Record<string, boolean> = { "product-1": true };

    // Act
    const result = hasMultiSelectionChanged(current, initial);

    // Assert
    expect(result).toBe(true);
  });

  it("returns true when a selected product is removed", () => {
    // Arrange
    const initial: Record<string, boolean> = { "product-1": true, "product-2": true };
    const current: Record<string, boolean> = { "product-1": true, "product-2": false };

    // Act
    const result = hasMultiSelectionChanged(current, initial);

    // Assert
    expect(result).toBe(true);
  });
});

describe("hasSingleSelectionChanged", () => {
  it("returns false when selection is unchanged", () => {
    // Act & Assert
    expect(hasSingleSelectionChanged("product-1", "product-1")).toBe(false);
  });

  it("returns true when selection changes", () => {
    // Act & Assert
    expect(hasSingleSelectionChanged("product-2", "product-1")).toBe(true);
  });
});

describe("isProductAvailableInVoucherChannels", () => {
  it("should return true when product has at least one channel common with voucher", () => {
    // Arrange
    const mockProductChannels = [
      { channel: { id: "1" } },
      { channel: { id: "2" } },
    ] as ProductChannels;
    const mockVariantChannels = [{ id: "1" }, { id: "33" }] as SelectedChannel[];

    // Act
    const result = isProductAvailableInVoucherChannels(mockProductChannels, mockVariantChannels);

    // Assert
    expect(result).toBe(true);
  });

  it("should return false when product has not common channels with voucher", () => {
    // Arrange
    const mockProductChannels = [
      { channel: { id: "1" } },
      { channel: { id: "2" } },
    ] as ProductChannels;
    const mockVariantChannels = [{ id: "12" }, { id: "33" }] as SelectedChannel[];

    // Act
    const result = isProductAvailableInVoucherChannels(mockProductChannels, mockVariantChannels);

    // Assert
    expect(result).toBe(false);
  });

  it("should return false when empty product channels", () => {
    // Arrange
    const mockProductChannels = [] as ProductChannels;

    const mockVariantChannels = [{ id: "12" }, { id: "33" }] as SelectedChannel[];

    // Act
    const result = isProductAvailableInVoucherChannels(mockProductChannels, mockVariantChannels);

    // Assert
    expect(result).toBe(false);
  });

  it("should return false when empty voucher channels", () => {
    // Arrange
    const mockProductChannels = [
      { channel: { id: "1" } },
      { channel: { id: "2" } },
    ] as ProductChannels;
    const mockVariantChannels = [] as SelectedChannel[];

    // Act
    const result = isProductAvailableInVoucherChannels(mockProductChannels, mockVariantChannels);

    // Assert
    expect(result).toBe(false);
  });

  it("should return false when empty voucher and product channels", () => {
    // Arrange
    const mockProductChannels = [] as ProductChannels;
    const mockVariantChannels = [] as SelectedChannel[];

    // Act
    const result = isProductAvailableInVoucherChannels(mockProductChannels, mockVariantChannels);

    // Assert
    expect(result).toBe(false);
  });

  it("should return true when no voucher channels", () => {
    // Arrange
    const mockProductChannels = [] as ProductChannels;
    const mockVariantChannels = undefined;

    // Act
    const result = isProductAvailableInVoucherChannels(mockProductChannels, mockVariantChannels);

    // Assert
    expect(result).toBe(true);
  });

  it("should return false when no products channels", () => {
    // Arrange
    const mockProductChannels = undefined;
    const mockVariantChannels = [] as SelectedChannel[];

    // Act
    const result = isProductAvailableInVoucherChannels(mockProductChannels, mockVariantChannels);

    // Assert
    expect(result).toBe(false);
  });
});
