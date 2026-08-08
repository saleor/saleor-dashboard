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
    percentageDiscountValue: "8",
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
  percentageDiscountValue: "",
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
  it("clears fixed drafts when saving percentage", () => {
    // Arrange
    const formData: VoucherDetailsPageFormData = {
      ...baseForm,
      discountType: DiscountTypeEnum.VALUE_PERCENTAGE,
      channelListings,
    };

    // Act
    const result = clearInactiveVoucherDiscountDrafts(formData);

    // Assert
    expect(result.channelListings.map(channel => channel.discountValue)).toEqual([""]);
    expect(result.channelListings.map(channel => channel.percentageDiscountValue)).toEqual(["8"]);
  });

  it("clears percentage drafts when saving fixed", () => {
    // Arrange
    const formData: VoucherDetailsPageFormData = {
      ...baseForm,
      discountType: DiscountTypeEnum.VALUE_FIXED,
      channelListings,
    };

    // Act
    const result = clearInactiveVoucherDiscountDrafts(formData);

    // Assert
    expect(result.channelListings.map(channel => channel.discountValue)).toEqual(["10"]);
    expect(result.channelListings.map(channel => channel.percentageDiscountValue)).toEqual([""]);
  });

  it("clears both amount drafts when saving shipping", () => {
    // Arrange
    const formData: VoucherDetailsPageFormData = {
      ...baseForm,
      discountType: DiscountTypeEnum.SHIPPING,
      channelListings,
    };

    // Act
    const result = clearInactiveVoucherDiscountDrafts(formData);

    // Assert
    expect(result.channelListings.map(channel => channel.discountValue)).toEqual([""]);
    expect(result.channelListings.map(channel => channel.percentageDiscountValue)).toEqual([""]);
  });
});
