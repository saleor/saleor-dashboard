import { ChannelVoucherData } from "@dashboard/channels/utils";
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
});
