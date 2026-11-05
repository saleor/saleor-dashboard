import { ApolloError } from "@apollo/client";
import { type FormData } from "@dashboard/discounts/components/VoucherCreatePage/types";
import { voucherDetails } from "@dashboard/discounts/fixtures";
import { DiscountTypeEnum, RequirementsPicker } from "@dashboard/discounts/types";
import { type MutationOutcome } from "@dashboard/discounts/voucherSaveRequestErrors";
import {
  DiscountErrorCode,
  type VoucherChannelListingUpdateMutation,
  type VoucherCreateMutation,
  type VoucherDeleteMutation,
  VoucherTypeEnum,
} from "@dashboard/graphql";

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

const created: MutationOutcome<VoucherCreateMutation> = {
  data: {
    __typename: "Mutation",
    voucherCreate: {
      __typename: "VoucherCreate",
      errors: [],
      voucher: null,
    },
  },
};
const createdWithId = (id: string): MutationOutcome<VoucherCreateMutation> => ({
  data: {
    __typename: "Mutation",
    voucherCreate: {
      __typename: "VoucherCreate",
      errors: [],
      // Only the id is read; the rest of the fragment doesn't matter here.
      voucher: { ...voucherDetails, id },
    },
  },
});
const channelsOk: MutationOutcome<VoucherChannelListingUpdateMutation> = {
  data: {
    __typename: "Mutation",
    voucherChannelListingUpdate: {
      __typename: "VoucherChannelListingUpdate",
      errors: [],
      voucher: null,
    },
  },
};
const channelsRejected: MutationOutcome<VoucherChannelListingUpdateMutation> = {
  data: {
    __typename: "Mutation",
    voucherChannelListingUpdate: {
      __typename: "VoucherChannelListingUpdate",
      errors: [
        {
          __typename: "DiscountError",
          code: DiscountErrorCode.INVALID,
          field: "discountValue",
          channels: ["channel-pln"],
          message: "Invalid value.",
          voucherCodes: null,
        },
      ],
      voucher: null,
    },
  },
};
const deleted: MutationOutcome<VoucherDeleteMutation> = {
  data: { __typename: "Mutation", voucherDelete: { __typename: "VoucherDelete", errors: [] } },
};
const deleteFailed: MutationOutcome<VoucherDeleteMutation> = {
  errors: new ApolloError({ errorMessage: "Failed to fetch" }),
};

const setup = ({
  createResult = createdWithId("voucher-1"),
  channelsResult = channelsOk,
  deleteResult = deleted,
  valid = true,
}: {
  createResult?: MutationOutcome<VoucherCreateMutation>;
  channelsResult?: MutationOutcome<VoucherChannelListingUpdateMutation>;
  deleteResult?: MutationOutcome<VoucherDeleteMutation>;
  valid?: boolean;
}): {
  handler: ReturnType<typeof createHandler>;
  voucherCreate: jest.Mock;
  updateChannels: jest.Mock;
  deleteVoucher: jest.Mock;
} => {
  const voucherCreate = jest.fn(async () => createResult);
  const updateChannels = jest.fn(async () => channelsResult);
  const deleteVoucher = jest.fn(async () => deleteResult);
  const handler = createHandler(voucherCreate, updateChannels, deleteVoucher, () => valid);

  return { handler, voucherCreate, updateChannels, deleteVoucher };
};

describe("createHandler", () => {
  it("returns validationFailed without calling mutations when validation fails", async () => {
    // Arrange
    const { handler, voucherCreate } = setup({ valid: false });

    // Act
    const result = await handler(formData);

    // Assert
    expect(result).toEqual({ validationFailed: true });
    expect(voucherCreate).not.toHaveBeenCalled();
  });

  it("doesn't save channels when the voucher isn't created", async () => {
    // Arrange
    const { handler, updateChannels } = setup({
      createResult: { errors: new ApolloError({ errorMessage: "Failed to fetch" }) },
    });

    // Act
    const result = await handler(formData);

    // Assert
    expect(result).toEqual({
      errors: [{ field: null, code: "GRAPHQL_ERROR", message: "Failed to fetch" }],
    });
    expect(updateChannels).not.toHaveBeenCalled();
  });

  it("treats a create response without a voucher as failed", async () => {
    // Arrange
    const { handler, updateChannels } = setup({ createResult: created });

    // Act
    const result = await handler(formData);

    // Assert
    expect(result).toEqual({ errors: [expect.objectContaining({ code: "GRAPHQL_ERROR" })] });
    expect(updateChannels).not.toHaveBeenCalled();
  });

  it("returns the new voucher id when the channel values are saved", async () => {
    // Arrange
    const { handler, deleteVoucher } = setup({});

    // Act
    const result = await handler(formData);

    // Assert
    expect(result).toEqual({ id: "voucher-1" });
    expect(deleteVoucher).not.toHaveBeenCalled();
  });

  it("deletes the new voucher again when its channel values are rejected", async () => {
    // Arrange
    const { handler, deleteVoucher } = setup({ channelsResult: channelsRejected });

    // Act
    const result = await handler(formData);

    // Assert
    expect(deleteVoucher).toHaveBeenCalledWith("voucher-1");
    expect(result).toEqual({ errors: [expect.objectContaining({ field: "discountValue" })] });
  });

  it("returns the voucher that couldn't be deleted again", async () => {
    // Arrange
    const { handler } = setup({ channelsResult: channelsRejected, deleteResult: deleteFailed });

    // Act
    const result = await handler(formData);

    // Assert
    expect(result).toEqual({
      errors: [expect.objectContaining({ field: "discountValue" })],
      createdWithoutChannelsId: "voucher-1",
    });
  });
});
