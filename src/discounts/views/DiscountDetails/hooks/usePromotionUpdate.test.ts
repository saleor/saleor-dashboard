import type * as ApolloClientModule from "@apollo/client";
import { ApolloError } from "@apollo/client";
import { type MutationOutcome } from "@dashboard/discounts/voucherSaveRequestErrors";
import {
  PromotionDetailsDocument,
  PromotionUpdateErrorCode,
  type PromotionUpdateMutation,
} from "@dashboard/graphql";
import type * as GraphqlTypes from "@dashboard/graphql/types.generated";
import { act, renderHook } from "@testing-library/react";
import type * as ReactIntl from "react-intl";

import { usePromotionUpdate } from "./usePromotionUpdate";

interface MutationOptions {
  disableErrorHandling?: boolean;
  update?: (cache: unknown, result: { data?: PromotionUpdateMutation | null }) => void;
  onCompleted?: (data: PromotionUpdateMutation) => void;
}

const mockUpdate = jest.fn();
const mockRestore = jest.fn();
const mockQuery = jest.fn();
const mockNotify = jest.fn();
let mainOptions: MutationOptions = {};

jest.mock("@dashboard/graphql", () => ({
  ...jest.requireActual<typeof GraphqlTypes>("@dashboard/graphql/types.generated"),
  usePromotionUpdateMutation: (options: MutationOptions): [jest.Mock, object] => {
    if (options.disableErrorHandling) {
      return [mockRestore, { loading: false }];
    }

    mainOptions = options;

    return [mockUpdate, { loading: false }];
  },
}));
jest.mock("@apollo/client", () => ({
  ...jest.requireActual<typeof ApolloClientModule>("@apollo/client"),
  useApolloClient: (): { query: jest.Mock } => ({ query: mockQuery }),
}));
jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: (): jest.Mock => mockNotify,
}));
jest.mock("react-intl", () => ({
  ...jest.requireActual<typeof ReactIntl>("react-intl"),
  useIntl: (): { formatMessage: (message: { defaultMessage: string }) => string } => ({
    formatMessage: message => message.defaultMessage,
  }),
}));

const savedUpdate: PromotionUpdateMutation = {
  __typename: "Mutation",
  promotionUpdate: { __typename: "PromotionUpdate", errors: [], promotion: null },
};
const refusedRestore: MutationOutcome<PromotionUpdateMutation> = {
  data: {
    __typename: "Mutation",
    promotionUpdate: {
      __typename: "PromotionUpdate",
      errors: [
        {
          __typename: "PromotionUpdateError",
          field: "endDate",
          code: PromotionUpdateErrorCode.INVALID,
          message: "End date cannot be before the start date.",
        },
      ],
      promotion: null,
    },
  },
};
const failedRestore: MutationOutcome<PromotionUpdateMutation> = {
  data: null,
  errors: new ApolloError({ errorMessage: "Failed to fetch" }),
};
const notRestoredToast = {
  status: "error",
  text: "The end date was removed and could not be put back. The promotion now has no end date.",
};

describe("usePromotionUpdate", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockQuery.mockResolvedValue({});
  });

  it("shows no success toast and writes nothing to the cache for a silent update", async () => {
    // Arrange
    const cache = { readQuery: jest.fn(), writeQuery: jest.fn() };
    const { result } = renderHook(() => usePromotionUpdate("promotion-1"));

    // Act
    await act(async () => {
      await result.current.promotionUpdate({
        variables: { id: "promotion-1", input: { endDate: null } },
        silent: true,
      });
    });
    mainOptions.update?.(cache, { data: savedUpdate });
    mainOptions.onCompleted?.(savedUpdate);

    // Assert
    expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ fetchPolicy: "no-cache" }));
    expect(cache.readQuery).not.toHaveBeenCalled();
    expect(mockNotify).not.toHaveBeenCalled();
  });

  it("shows the success toast for the main update", async () => {
    // Arrange
    const { result } = renderHook(() => usePromotionUpdate("promotion-1"));

    // Act
    await act(async () => {
      await result.current.promotionUpdate({
        variables: { id: "promotion-1", input: { name: "Winter sale" } },
      });
    });
    mainOptions.onCompleted?.(savedUpdate);

    // Assert
    expect(mockUpdate).toHaveBeenCalledWith(expect.objectContaining({ fetchPolicy: undefined }));
    expect(mockNotify).toHaveBeenCalledWith({ status: "success", text: "Promotion updated" });
  });

  it("puts the end date back without a message when the API accepts it", async () => {
    // Arrange
    mockRestore.mockResolvedValue({ data: savedUpdate });

    const { result } = renderHook(() => usePromotionUpdate("promotion-1"));
    let restored: boolean | undefined;

    // Act
    await act(async () => {
      restored = await result.current.restoreEndDate("2020-06-01T15:00:00+00:00");
    });

    // Assert
    expect(restored).toBe(true);
    expect(mockRestore).toHaveBeenCalledWith({
      variables: { id: "promotion-1", input: { endDate: "2020-06-01T15:00:00+00:00" } },
    });
    expect(mockNotify).not.toHaveBeenCalled();
    expect(mockQuery).not.toHaveBeenCalled();
  });

  it("says the end date is gone and reloads the promotion when the API refuses it", async () => {
    // Arrange
    mockRestore.mockResolvedValue(refusedRestore);

    const { result } = renderHook(() => usePromotionUpdate("promotion-1"));
    let restored: boolean | undefined;

    // Act
    await act(async () => {
      restored = await result.current.restoreEndDate("2020-06-01T15:00:00+00:00");
    });

    // Assert
    expect(restored).toBe(false);
    expect(mockNotify).toHaveBeenCalledWith(notRestoredToast);
    expect(mockQuery).toHaveBeenCalledWith({
      query: PromotionDetailsDocument,
      variables: { id: "promotion-1" },
      fetchPolicy: "network-only",
    });
  });

  it("says the end date is gone but keeps the edits when the request fails", async () => {
    // Arrange
    mockRestore.mockResolvedValue(failedRestore);

    const { result } = renderHook(() => usePromotionUpdate("promotion-1"));
    let restored: boolean | undefined;

    // Act
    await act(async () => {
      restored = await result.current.restoreEndDate("2020-06-01T15:00:00+00:00");
    });

    // Assert
    expect(restored).toBe(false);
    expect(mockNotify).toHaveBeenCalledWith(notRestoredToast);
    expect(mockQuery).not.toHaveBeenCalled();
  });
});
