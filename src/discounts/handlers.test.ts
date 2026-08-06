import { type ChannelVoucherData } from "@dashboard/channels/utils";
import { DiscountTypeEnum, RequirementsPicker } from "@dashboard/discounts/types";

import { validateChannelListing } from "./handlers";

describe("Discounts / handlers / validateChannelListing", () => {
  it("should return valid as true when discount type is SHIPPING", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "10" },
      { id: "2", discountValue: "20" },
    ] as ChannelVoucherData[];
    const discountType = DiscountTypeEnum.SHIPPING;
    const requirementsPicker = RequirementsPicker.ORDER;

    // Act
    const result = validateChannelListing(channelListings, discountType, requirementsPicker);

    // Assert
    expect(result.valid).toBe(true);
    expect(result.invalidChannels).toHaveLength(0);
  });

  it("returns valid as true when there are no invalid channels", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "10" },
      { id: "2", discountValue: "20" },
    ] as ChannelVoucherData[];
    const discountType = DiscountTypeEnum.VALUE_FIXED;
    const requirementsPicker = RequirementsPicker.ORDER;

    // Act
    const result = validateChannelListing(channelListings, discountType, requirementsPicker);

    // Assert
    expect(result.valid).toBe(true);
    expect(result.invalidChannels).toHaveLength(0);
  });

  it("returns valid as false when there are invalid channels", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "10" },
      { id: "2", discountValue: "" },
    ] as ChannelVoucherData[];
    const discountType = DiscountTypeEnum.VALUE_FIXED;
    const requirementsPicker = RequirementsPicker.ORDER;

    // Act
    const result = validateChannelListing(channelListings, discountType, requirementsPicker);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.invalidChannels).toEqual(["2"]);
  });

  it("validates percentage draft separately from per-channel fixed drafts", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "" },
      { id: "2", discountValue: "" },
    ] as ChannelVoucherData[];

    // Act
    const invalid = validateChannelListing(
      channelListings,
      DiscountTypeEnum.VALUE_PERCENTAGE,
      RequirementsPicker.NONE,
      "",
    );
    const valid = validateChannelListing(
      channelListings,
      DiscountTypeEnum.VALUE_PERCENTAGE,
      RequirementsPicker.NONE,
      "15",
    );

    // Assert
    expect(invalid.valid).toBe(false);
    expect(invalid.invalidChannels).toEqual(["1", "2"]);
    expect(valid.valid).toBe(true);
  });

  it("does not block percentage validation when no channels are assigned", () => {
    // Arrange / Act
    const result = validateChannelListing(
      [],
      DiscountTypeEnum.VALUE_PERCENTAGE,
      RequirementsPicker.NONE,
      "",
    );

    // Assert
    expect(result.valid).toBe(true);
    expect(result.invalidChannels).toEqual([]);
  });

  it("does not treat a valid percentage as invalid when order min-spent is required", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "", minSpent: "50" },
      { id: "2", discountValue: "", minSpent: "50" },
    ] as ChannelVoucherData[];

    // Act
    const result = validateChannelListing(
      channelListings,
      DiscountTypeEnum.VALUE_PERCENTAGE,
      RequirementsPicker.ORDER,
      "8",
    );

    // Assert
    expect(result.valid).toBe(true);
    expect(result.invalidChannels).toEqual([]);
  });

  it("still flags missing min-spent on channels when percentage is valid", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "", minSpent: "50" },
      { id: "2", discountValue: "", minSpent: "" },
    ] as ChannelVoucherData[];

    // Act
    const result = validateChannelListing(
      channelListings,
      DiscountTypeEnum.VALUE_PERCENTAGE,
      RequirementsPicker.ORDER,
      "8",
    );

    // Assert
    expect(result.valid).toBe(false);
    expect(result.invalidChannels).toEqual(["2"]);
  });
});
