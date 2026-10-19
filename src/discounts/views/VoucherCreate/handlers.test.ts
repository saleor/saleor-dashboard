import { type FetchResult } from "@apollo/client";
import { type FormData } from "@dashboard/discounts/components/VoucherCreatePage/types";
import { DiscountTypeEnum, RequirementsPicker } from "@dashboard/discounts/types";
import { type VoucherCreateMutation, VoucherTypeEnum } from "@dashboard/graphql";
import { GraphQLError } from "graphql";

import { createHandler } from "./handlers";

const formData: FormData = {
  applyOncePerCustomer: false,
  applyOncePerOrder: false,
  onlyForStaff: false,
  channelListings: [],
  name: "name",
  value: 1,
  discountType: DiscountTypeEnum.SHIPPING,
  percentageDiscountValue: "",
  endDate: "2021-01-01",
  endTime: "00:00",
  hasEndDate: false,
  hasUsageLimit: false,
  minCheckoutItemsQuantity: "1",
  requirementsPicker: RequirementsPicker.NONE,
  startDate: "2021-02-01",
  startTime: "00:00",
  type: VoucherTypeEnum.ENTIRE_ORDER,
  codes: [],
  usageLimit: 1,
  used: 1,
  singleUse: false,
  metadata: [],
  privateMetadata: [],
  products: [],
  collections: [],
  categories: [],
  countries: [],
  variants: [],
};

describe("createHandler", () => {
  it("returns the execution error without updating channels when voucher creation fails", async () => {
    // Arrange
    const error = new GraphQLError("Voucher creation failed");
    const response: FetchResult<VoucherCreateMutation> = { errors: [error] };
    const voucherCreate = jest.fn().mockResolvedValue(response);
    const updateChannels = jest.fn();
    const validateFn = jest.fn().mockReturnValue(true);
    const handler = createHandler(voucherCreate, updateChannels, validateFn);

    // Act
    const result = await handler(formData);

    // Assert
    expect(result).toEqual({ errors: [error] });
    expect(voucherCreate).toHaveBeenCalled();
    expect(updateChannels).not.toHaveBeenCalled();
  });

  it("returns validationFailed without calling mutations when validateFn fails", async () => {
    // Arrange
    const voucherCreate = jest.fn();
    const updateChannels = jest.fn();
    const validateFn = jest.fn().mockReturnValue(false);
    const handler = createHandler(voucherCreate, updateChannels, validateFn);

    // Act
    const result = await handler(formData);

    // Assert
    expect(result).toEqual({ validationFailed: true });
    expect(voucherCreate).not.toHaveBeenCalled();
    expect(updateChannels).not.toHaveBeenCalled();
  });

  it("should call channel update when voucherCreate successes", async () => {
    // Arrange
    const voucherCreate = jest
      .fn()
      .mockResolvedValue({ data: { voucherCreate: { voucher: { id: "id" } } } });
    const updateChannels = jest.fn();
    const validateFn = jest.fn().mockReturnValue(true);
    const handler = createHandler(voucherCreate, updateChannels, validateFn);

    // Act
    await handler(formData);

    // Assert
    expect(voucherCreate).toHaveBeenCalled();
    expect(updateChannels).toHaveBeenCalled();
  });
});
