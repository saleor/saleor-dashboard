import { VoucherDetailsPageFormData } from "@dashboard/discounts/components/VoucherDetailsPage";
import { DiscountTypeEnum, RequirementsPicker } from "@dashboard/discounts/types";
import { VoucherTypeEnum } from "@dashboard/graphql";

import { createHandler } from "./handlers";

const formData: VoucherDetailsPageFormData = {
  applyOncePerCustomer: false,
  applyOncePerOrder: false,
  onlyForStaff: false,
  channelListings: [],
  name: "name",
  discountType: DiscountTypeEnum.SHIPPING,
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
};

describe("createHandler", () => {
  it("should not call channel update when voucherCreate return error", async () => {
    // Arrange
    const voucherCreate = jest.fn().mockResolvedValue({ errors: ["error"] });
    const updateChannels = jest.fn();
    const validateFn = jest.fn().mockReturnValue(true);
    const handler = createHandler(voucherCreate, updateChannels, validateFn);

    // Act
    const result = await handler(formData);

    // Assert
    expect(result).toEqual({ errors: ["Could not update channels"] });
    expect(voucherCreate).toHaveBeenCalled();
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
