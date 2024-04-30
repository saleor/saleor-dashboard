import { DiscountTypeEnum, RequirementsPicker } from "@dashboard/discounts/types";
import { VoucherTypeEnum } from "@dashboard/graphql";

import { FormData } from "./types";

export const initialForm: FormData = {
  applyOncePerCustomer: false,
  applyOncePerOrder: false,
  onlyForStaff: false,
  channelListings: [],
  name: "",
  discountType: DiscountTypeEnum.VALUE_FIXED,
  endDate: "",
  endTime: "",
  hasEndDate: false,
  hasUsageLimit: false,
  minCheckoutItemsQuantity: "0",
  requirementsPicker: RequirementsPicker.NONE,
  startDate: "",
  startTime: "",
  type: VoucherTypeEnum.ENTIRE_ORDER,
  used: 1,
  usageLimit: 1,
  singleUse: false,
  codes: [],
  value: 0,
  metadata: [],
  privateMetadata: [],
};
