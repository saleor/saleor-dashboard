import { ApolloError, type FetchResult } from "@apollo/client";
import { DiscountErrorCode, type VoucherChannelListingUpdateMutation } from "@dashboard/graphql";

import { getVoucherSaveRequestErrors } from "./voucherSaveRequestErrors";

const channelsOk: FetchResult<VoucherChannelListingUpdateMutation> = {
  data: {
    __typename: "Mutation",
    voucherChannelListingUpdate: {
      __typename: "VoucherChannelListingUpdate",
      errors: [],
      voucher: null,
    },
  },
};
const channelsRejected: FetchResult<VoucherChannelListingUpdateMutation> = {
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
          message: "Invalid percentage value.",
          voucherCodes: null,
        },
      ],
      voucher: null,
    },
  },
};

describe("getVoucherSaveRequestErrors", () => {
  it("returns the payload errors of a completed request", () => {
    // Arrange
    const result: FetchResult<VoucherChannelListingUpdateMutation> = channelsRejected;

    // Act
    const errors = getVoucherSaveRequestErrors(
      result,
      data => data.voucherChannelListingUpdate?.errors,
    );

    // Assert
    expect(errors).toEqual([expect.objectContaining({ field: "discountValue" })]);
  });

  it("counts a network failure without GraphQL errors as failed", () => {
    // Arrange
    const result = { errors: new ApolloError({ errorMessage: "Failed to fetch" }) };

    // Act
    const errors = getVoucherSaveRequestErrors(
      result,
      (data: VoucherChannelListingUpdateMutation) => data.voucherChannelListingUpdate?.errors,
    );

    // Assert
    expect(errors).toEqual([{ field: null, code: "GRAPHQL_ERROR", message: "Failed to fetch" }]);
  });

  it("reads an empty errors array as no request error", () => {
    // Arrange
    const result: FetchResult<VoucherChannelListingUpdateMutation> = {
      ...channelsOk,
      errors: [],
    };

    // Act
    const errors = getVoucherSaveRequestErrors(
      result,
      data => data.voucherChannelListingUpdate?.errors,
    );

    // Assert
    expect(errors).toEqual([]);
  });

  it("counts a request without a payload as failed", () => {
    // Arrange
    const result: FetchResult<VoucherChannelListingUpdateMutation> = { data: null };

    // Act
    const errors = getVoucherSaveRequestErrors(
      result,
      data => data.voucherChannelListingUpdate?.errors,
    );

    // Assert
    expect(errors).toEqual([{ field: null, code: "GRAPHQL_ERROR", message: null }]);
  });
});
