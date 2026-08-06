import { type ChannelVoucherData } from "@dashboard/channels/utils";
import { DiscountTypeEnum, RequirementsPicker } from "@dashboard/discounts/types";
import { VoucherTypeEnum } from "@dashboard/graphql";

import { type VoucherDetailsPageFormData } from "./components/VoucherDetailsPage";
import { clearInactiveVoucherDiscountDrafts } from "./data";

const channelListings: ChannelVoucherData[] = [
  {
    id: "ch-1",
    name: "USD",
    currency: "USD",
    discountValue: "10",
    minSpent: "",
  },
];

const baseForm: VoucherDetailsPageFormData = {
  applyOncePerCustomer: false,
  applyOncePerOrder: false,
  onlyForStaff: false,
  channelListings,
  name: "Voucher",
  discountType: DiscountTypeEnum.VALUE_PERCENTAGE,
  percentageDiscountValue: "8",
  endDate: "",
  endTime: "",
  hasEndDate: false,
  hasUsageLimit: false,
  minCheckoutItemsQuantity: "0",
  requirementsPicker: RequirementsPicker.NONE,
  startDate: "",
  startTime: "",
  type: VoucherTypeEnum.ENTIRE_ORDER,
  codes: [],
  usageLimit: 1,
  used: 0,
  singleUse: false,
  metadata: [],
  privateMetadata: [],
};

describe("clearInactiveVoucherDiscountDrafts", () => {
  it("clears per-channel fixed drafts when saving percentage", () => {
    // Arrange
    const formData: VoucherDetailsPageFormData = {
      ...baseForm,
      discountType: DiscountTypeEnum.VALUE_PERCENTAGE,
      percentageDiscountValue: "8",
      channelListings,
    };

    // Act
    const result = clearInactiveVoucherDiscountDrafts(formData);

    // Assert
    expect(result.percentageDiscountValue).toBe("8");
    expect(result.channelListings.map(channel => channel.discountValue)).toEqual([""]);
  });

  it("clears percentage draft when saving fixed", () => {
    // Arrange
    const formData: VoucherDetailsPageFormData = {
      ...baseForm,
      discountType: DiscountTypeEnum.VALUE_FIXED,
      percentageDiscountValue: "8",
      channelListings,
    };

    // Act
    const result = clearInactiveVoucherDiscountDrafts(formData);

    // Assert
    expect(result.percentageDiscountValue).toBe("");
    expect(result.channelListings.map(channel => channel.discountValue)).toEqual(["10"]);
  });

  it("clears both amount drafts when saving shipping", () => {
    // Arrange
    const formData: VoucherDetailsPageFormData = {
      ...baseForm,
      discountType: DiscountTypeEnum.SHIPPING,
      percentageDiscountValue: "8",
      channelListings,
    };

    // Act
    const result = clearInactiveVoucherDiscountDrafts(formData);

    // Assert
    expect(result.percentageDiscountValue).toBe("");
    expect(result.channelListings.map(channel => channel.discountValue)).toEqual([""]);
  });
});
