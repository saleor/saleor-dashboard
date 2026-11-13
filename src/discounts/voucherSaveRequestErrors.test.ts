import { ApolloError, type FetchResult } from "@apollo/client";
import { DiscountErrorCode, type VoucherChannelListingUpdateMutation } from "@dashboard/graphql";
import { GraphQLError } from "graphql";

import { getVoucherSaveRequestErrors, type VoucherSaveError } from "./voucherSaveRequestErrors";

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

const getChannelErrors = (
  data: VoucherChannelListingUpdateMutation,
): VoucherSaveError[] | undefined => data.voucherChannelListingUpdate?.errors;

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

  const withStatus = (name: string, statusCode: number): Error =>
    Object.assign(new Error(`${name} ${statusCode}`), { name, statusCode });

  it.each([
    ["got no answer", new TypeError("Failed to fetch"), true],
    ["got a server error", withStatus("ServerError", 500), true],
    ["got an answer that isn't JSON", withStatus("ServerParseError", 200), true],
    ["was refused by a proxy", withStatus("ServerParseError", 413), false],
  ])(
    "marks whether a save that %s may have gone through anyway",
    (_case, networkError, unknown) => {
      // Arrange
      const result = { errors: new ApolloError({ networkError }) };

      // Act
      const errors = getVoucherSaveRequestErrors(result, getChannelErrors);

      // Assert
      expect(errors).toHaveLength(1);
      expect(!!errors[0].outcomeUnknown).toBe(unknown);
    },
  );

  it("doesn't mark a request the API rejected with GraphQL errors", () => {
    // Arrange
    const result = {
      errors: new ApolloError({ graphQLErrors: [new GraphQLError("You don't have permission.")] }),
    };

    // Act
    const errors = getVoucherSaveRequestErrors(result, getChannelErrors);

    // Assert
    expect(errors[0].outcomeUnknown).toBeUndefined();
  });
});
