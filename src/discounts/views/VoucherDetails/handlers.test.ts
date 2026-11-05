import { ApolloError, type FetchResult } from "@apollo/client";
import { initialForm } from "@dashboard/discounts/components/VoucherCreatePage/const";
import { type VoucherDetailsPageFormData } from "@dashboard/discounts/components/VoucherDetailsPage/VoucherDetailsPage";
import { voucherDetails } from "@dashboard/discounts/fixtures";
import {
  DiscountErrorCode,
  type VoucherCataloguesAddMutation,
  type VoucherCataloguesRemoveMutation,
  type VoucherChannelListingUpdateMutation,
  type VoucherCodeBulkDeleteMutation,
  type VoucherDetailsFragment,
  type VoucherFragment,
  type VoucherInput,
  type VoucherUpdateMutation,
} from "@dashboard/graphql";
import { GraphQLError } from "graphql";

import {
  createUpdateHandler,
  getVoucherSaveRequestErrors,
  hasSavedVoucherDetailsChanges,
} from "./handlers";
import {
  createEmptyVoucherCatalogueDraft,
  type VoucherCatalogueDraft,
} from "./voucherCatalogueDraft";

const voucherUpdateOk: FetchResult<VoucherUpdateMutation> = {
  data: {
    __typename: "Mutation",
    voucherUpdate: { __typename: "VoucherUpdate", errors: [], voucher: null },
  },
};
const voucherUpdateRejected: FetchResult<VoucherUpdateMutation> = {
  data: {
    __typename: "Mutation",
    voucherUpdate: {
      __typename: "VoucherUpdate",
      errors: [
        {
          __typename: "DiscountError",
          code: DiscountErrorCode.ALREADY_EXISTS,
          field: "codes",
          channels: null,
          message: "Promo code already exists.",
          voucherCodes: ["TAKEN"],
        },
      ],
      voucher: null,
    },
  },
};
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
const codesDeleteOk: FetchResult<VoucherCodeBulkDeleteMutation> = {
  data: {
    __typename: "Mutation",
    voucherCodeBulkDelete: { __typename: "VoucherCodeBulkDelete", count: 1, errors: [] },
  },
};
const formData: VoucherDetailsPageFormData = { ...initialForm, name: "Renamed" };
const catalogueDraftWithCategory: VoucherCatalogueDraft = {
  ...createEmptyVoucherCatalogueDraft(),
  categories: { idsToAdd: ["category-1"], idsToRemove: [], toDisplay: [{ id: "category-1" }] },
};

const setup = ({
  voucherUpdateResult,
  channelsResult = channelsOk,
  pendingRemovedCodeIds = [],
  catalogueDraft = createEmptyVoucherCatalogueDraft(),
}: {
  voucherUpdateResult: Awaited<ReturnType<Parameters<typeof createUpdateHandler>[2]>>;
  channelsResult?: FetchResult<VoucherChannelListingUpdateMutation>;
  pendingRemovedCodeIds?: string[];
  catalogueDraft?: VoucherCatalogueDraft;
}): { handler: ReturnType<typeof createUpdateHandler>; calls: string[] } => {
  const calls: string[] = [];
  const updateVoucher = jest.fn(async () => {
    calls.push("voucherUpdate");

    return voucherUpdateResult;
  });
  const updateChannels = jest.fn(async () => {
    calls.push("channels");

    return channelsResult;
  });
  const voucherCodesDelete = jest.fn(async () => {
    calls.push("codesDelete");

    return codesDeleteOk;
  });
  const cataloguesAdd = jest.fn(async (): Promise<FetchResult<VoucherCataloguesAddMutation>> => {
    calls.push("cataloguesAdd");

    return {
      data: {
        __typename: "Mutation",
        voucherCataloguesAdd: { __typename: "VoucherAddCatalogues", errors: [], voucher: null },
      },
    };
  });
  const cataloguesRemove = jest.fn(
    async (): Promise<FetchResult<VoucherCataloguesRemoveMutation>> => {
      calls.push("cataloguesRemove");

      return {
        data: {
          __typename: "Mutation",
          voucherCataloguesRemove: {
            __typename: "VoucherRemoveCatalogues",
            errors: [],
            voucher: null,
          },
        },
      };
    },
  );
  const handler = createUpdateHandler(voucherDetails, [], updateVoucher, updateChannels, {
    cataloguesAdd,
    cataloguesRemove,
    voucherCodesDelete,
    getCatalogueDraft: () => catalogueDraft,
    getPendingRemovedCodeIds: () => pendingRemovedCodeIds,
    catalogueQueryVariables: {
      includeProducts: false,
      includeCollections: false,
      includeCategories: false,
      includeVariants: false,
      PERMISSION_MANAGE_PRODUCTS: true,
    },
  });

  return { handler, calls };
};

describe("createUpdateHandler", () => {
  it("saves nothing else when the voucher update is rejected", async () => {
    // Arrange
    const { handler, calls } = setup({
      voucherUpdateResult: voucherUpdateRejected,
      pendingRemovedCodeIds: ["code-1"],
      catalogueDraft: catalogueDraftWithCategory,
    });

    // Act
    const outcome = await handler(formData);

    // Assert
    expect(calls).toEqual(["voucherUpdate"]);
    expect(outcome.errors).toEqual([expect.objectContaining({ field: "codes" })]);
    expect(outcome.saved).toEqual({
      details: false,
      codeRemovals: false,
      catalogueAdds: false,
      catalogueRemoves: false,
    });
    expect(outcome.savedDetailsChanges).toBe(false);
  });

  it("treats a failed voucher update request as a failed save", async () => {
    // Arrange
    const { handler, calls } = setup({
      // Mutation hooks with an onError handler resolve a failed request with the ApolloError.
      voucherUpdateResult: {
        errors: new ApolloError({
          graphQLErrors: [new GraphQLError("Int cannot represent non 32-bit signed integer value")],
        }),
      },
    });

    // Act
    const outcome = await handler(formData);

    // Assert
    expect(calls).toEqual(["voucherUpdate"]);
    expect(outcome.errors).toEqual([
      {
        field: null,
        code: "GRAPHQL_ERROR",
        message: "Int cannot represent non 32-bit signed integer value",
      },
    ]);
    expect(outcome.saved.details).toBe(false);
  });

  it("removes codes and saves the catalogue only after the voucher update", async () => {
    // Arrange
    const { handler, calls } = setup({
      voucherUpdateResult: voucherUpdateOk,
      pendingRemovedCodeIds: ["code-1"],
      catalogueDraft: catalogueDraftWithCategory,
    });

    // Act
    const outcome = await handler(formData);

    // Assert
    expect(calls[0]).toBe("voucherUpdate");
    expect(calls.slice(1).sort()).toEqual(["cataloguesAdd", "channels", "codesDelete"]);
    expect(outcome.errors).toEqual([]);
    expect(outcome.saved).toEqual({
      details: true,
      codeRemovals: true,
      catalogueAdds: true,
      catalogueRemoves: false,
    });
  });

  it("reports which parts were saved when the channel values are rejected", async () => {
    // Arrange
    const { handler } = setup({
      voucherUpdateResult: voucherUpdateOk,
      channelsResult: channelsRejected,
      pendingRemovedCodeIds: ["code-1"],
    });

    // Act
    const outcome = await handler(formData);

    // Assert
    expect(outcome.errors).toEqual([expect.objectContaining({ field: "discountValue" })]);
    expect(outcome.saved).toEqual({
      details: true,
      codeRemovals: true,
      catalogueAdds: false,
      catalogueRemoves: false,
    });
    expect(outcome.savedDetailsChanges).toBe(true);
  });

  it("doesn't report a partial save when the voucher update changed nothing", async () => {
    // Arrange
    const unchangedForm: VoucherDetailsPageFormData = {
      ...initialForm,
      applyOncePerCustomer: voucherDetails.applyOncePerCustomer,
      applyOncePerOrder: voucherDetails.applyOncePerOrder,
      onlyForStaff: voucherDetails.onlyForStaff,
      singleUse: voucherDetails.singleUse,
    };
    const { handler } = setup({
      voucherUpdateResult: {
        data: {
          __typename: "Mutation",
          voucherUpdate: { __typename: "VoucherUpdate", errors: [], voucher: voucherDetails },
        },
      },
      channelsResult: channelsRejected,
    });

    // Act
    const outcome = await handler(unchangedForm);

    // Assert
    expect(outcome.saved.details).toBe(true);
    expect(outcome.savedDetailsChanges).toBe(false);
  });
});

describe("hasSavedVoucherDetailsChanges", () => {
  const unchangedInput: VoucherInput = {
    applyOncePerCustomer: voucherDetails.applyOncePerCustomer,
    applyOncePerOrder: voucherDetails.applyOncePerOrder,
    onlyForStaff: voucherDetails.onlyForStaff,
    singleUse: voucherDetails.singleUse,
    addCodes: [],
  };

  it("ignores the date format and seconds the API returns, and an unset quantity saved as 0", () => {
    // Arrange
    const before: VoucherDetailsFragment = {
      ...voucherDetails,
      startDate: "2026-11-05T01:48:13.120636+00:00",
      minCheckoutItemsQuantity: null,
    };
    const after: VoucherFragment = {
      ...before,
      startDate: "2026-11-04T17:48:00-08:00",
      minCheckoutItemsQuantity: 0,
    };

    // Act
    const changed = hasSavedVoucherDetailsChanges(before, unchangedInput, after);

    // Assert
    expect(changed).toBe(false);
  });

  it("detects a rename, a moved date and a changed setting", () => {
    // Arrange
    const renamed: VoucherFragment = { ...voucherDetails, name: "Renamed" };
    const moved: VoucherFragment = { ...voucherDetails, startDate: "2031-01-01T00:00:00+00:00" };
    const singleUseInput: VoucherInput = {
      ...unchangedInput,
      singleUse: !voucherDetails.singleUse,
    };

    // Act & Assert
    expect(hasSavedVoucherDetailsChanges(voucherDetails, unchangedInput, renamed)).toBe(true);
    expect(hasSavedVoucherDetailsChanges(voucherDetails, unchangedInput, moved)).toBe(true);
    expect(hasSavedVoucherDetailsChanges(voucherDetails, singleUseInput, voucherDetails)).toBe(
      true,
    );
  });
});

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
