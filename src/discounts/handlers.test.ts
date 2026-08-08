import { type ChannelVoucherData } from "@dashboard/channels/utils";
import { DiscountTypeEnum, RequirementsPicker } from "@dashboard/discounts/types";
import { VoucherTypeEnum } from "@dashboard/graphql";

import { createVoucherScopeChangeHandler, validateChannelListing } from "./handlers";

describe("Discounts / handlers / validateChannelListing", () => {
  it("should return valid as true when discount type is SHIPPING", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "10", percentageDiscountValue: "" },
      { id: "2", discountValue: "20", percentageDiscountValue: "" },
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
      { id: "1", discountValue: "10", percentageDiscountValue: "" },
      { id: "2", discountValue: "20", percentageDiscountValue: "" },
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
      { id: "1", discountValue: "10", percentageDiscountValue: "" },
      { id: "2", discountValue: "", percentageDiscountValue: "" },
    ] as ChannelVoucherData[];
    const discountType = DiscountTypeEnum.VALUE_FIXED;
    const requirementsPicker = RequirementsPicker.ORDER;

    // Act
    const result = validateChannelListing(channelListings, discountType, requirementsPicker);

    // Assert
    expect(result.valid).toBe(false);
    expect(result.invalidChannels).toEqual(["2"]);
  });

  it("validates percentage amounts per channel independently from fixed drafts", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "99", percentageDiscountValue: "" },
      { id: "2", discountValue: "", percentageDiscountValue: "15" },
    ] as ChannelVoucherData[];

    // Act
    const result = validateChannelListing(
      channelListings,
      DiscountTypeEnum.VALUE_PERCENTAGE,
      RequirementsPicker.NONE,
    );

    // Assert
    expect(result.valid).toBe(false);
    expect(result.invalidDiscountValueChannels).toEqual(["1"]);
  });

  it("does not block percentage validation when no channels are assigned", () => {
    // Arrange / Act
    const result = validateChannelListing(
      [],
      DiscountTypeEnum.VALUE_PERCENTAGE,
      RequirementsPicker.NONE,
    );

    // Assert
    expect(result.valid).toBe(true);
    expect(result.invalidChannels).toEqual([]);
  });

  it("allows different valid percentages per channel", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "", percentageDiscountValue: "10", minSpent: "50" },
      { id: "2", discountValue: "", percentageDiscountValue: "25", minSpent: "50" },
    ] as ChannelVoucherData[];

    // Act
    const result = validateChannelListing(
      channelListings,
      DiscountTypeEnum.VALUE_PERCENTAGE,
      RequirementsPicker.ORDER,
    );

    // Assert
    expect(result.valid).toBe(true);
    expect(result.invalidChannels).toEqual([]);
  });

  it("still flags missing min-spent on channels when percentage is valid", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "", percentageDiscountValue: "8", minSpent: "50" },
      { id: "2", discountValue: "", percentageDiscountValue: "8", minSpent: "" },
    ] as ChannelVoucherData[];

    // Act
    const result = validateChannelListing(
      channelListings,
      DiscountTypeEnum.VALUE_PERCENTAGE,
      RequirementsPicker.ORDER,
    );

    // Assert
    expect(result.valid).toBe(false);
    expect(result.invalidMinSpentChannels).toEqual(["2"]);
    expect(result.invalidDiscountValueChannels).toEqual([]);
    expect(result.invalidChannels).toEqual(["2"]);
  });

  it("splits fixed discount and min-spent failures onto separate fields", () => {
    // Arrange
    const channelListings = [
      { id: "1", discountValue: "", percentageDiscountValue: "", minSpent: "10" },
      { id: "2", discountValue: "5", percentageDiscountValue: "", minSpent: "" },
    ] as ChannelVoucherData[];

    // Act
    const result = validateChannelListing(
      channelListings,
      DiscountTypeEnum.VALUE_FIXED,
      RequirementsPicker.ORDER,
    );

    // Assert
    expect(result.valid).toBe(false);
    expect(result.invalidDiscountValueChannels).toEqual(["1"]);
    expect(result.invalidMinSpentChannels).toEqual(["2"]);
    expect(result.invalidChannels).toEqual(["1", "2"]);
  });
});

describe("Discounts / handlers / createVoucherScopeChangeHandler", () => {
  it("clears shipping channel amounts when leaving free shipping", () => {
    // Arrange
    const change = jest.fn();
    const clearShippingChannelAmounts = jest.fn();
    const handleScopeChange = createVoucherScopeChangeHandler(change, clearShippingChannelAmounts);

    // Act
    handleScopeChange(VoucherTypeEnum.SPECIFIC_PRODUCT, DiscountTypeEnum.SHIPPING);

    // Assert
    expect(change).toHaveBeenCalledWith({
      target: { name: "type", value: VoucherTypeEnum.SPECIFIC_PRODUCT },
    });
    expect(change).toHaveBeenCalledWith({
      target: { name: "discountType", value: DiscountTypeEnum.VALUE_PERCENTAGE },
    });
    expect(clearShippingChannelAmounts).toHaveBeenCalledTimes(1);
  });

  it("does not clear channel amounts when switching between non-shipping scopes", () => {
    // Arrange
    const change = jest.fn();
    const clearShippingChannelAmounts = jest.fn();
    const handleScopeChange = createVoucherScopeChangeHandler(change, clearShippingChannelAmounts);

    // Act
    handleScopeChange(VoucherTypeEnum.SPECIFIC_PRODUCT, DiscountTypeEnum.VALUE_PERCENTAGE);

    // Assert
    expect(clearShippingChannelAmounts).not.toHaveBeenCalled();
  });
});
