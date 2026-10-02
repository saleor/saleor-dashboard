import { type FetchResult } from "@apollo/client";
import { CustomerTypeCreateErrorCode, type CustomerTypeCreateMutation } from "@dashboard/graphql";
import type * as GraphqlTypes from "@dashboard/graphql/types.generated";
import { act, renderHook } from "@testing-library/react";
import { GraphQLError } from "graphql";
import type * as ReactIntl from "react-intl";

import { useCreateCustomerType } from "./useCreateCustomerType";

const mockMutate = jest.fn();
const mockTrackEvent = jest.fn();

jest.mock("@dashboard/graphql", () => ({
  ...jest.requireActual<typeof GraphqlTypes>("@dashboard/graphql/types.generated"),
  useCustomerTypeCreateMutation: (): [jest.Mock, object] => [mockMutate, {}],
}));
jest.mock("@dashboard/components/ProductAnalytics/useAnalytics", () => ({
  useAnalytics: (): { trackEvent: jest.Mock } => ({ trackEvent: mockTrackEvent }),
}));
jest.mock("@dashboard/hooks/useNavigator", () => ({
  __esModule: true,
  default: (): jest.Mock => jest.fn(),
}));
jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: (): jest.Mock => jest.fn(),
}));
jest.mock("react-intl", () => ({
  ...jest.requireActual<typeof ReactIntl>("react-intl"),
  useIntl: (): { formatMessage: jest.Mock } => ({ formatMessage: jest.fn() }),
}));

const successfulResponse: FetchResult<CustomerTypeCreateMutation> = {
  data: {
    __typename: "Mutation",
    customerTypeCreate: { __typename: "CustomerTypeCreate", errors: [], customerType: null },
  },
};
const cases: Array<[string, FetchResult<CustomerTypeCreateMutation>, "success" | "error"]> = [
  ["successful payload", successfulResponse, "success"],
  ["missing data", {}, "error"],
  ["null payload", { data: { __typename: "Mutation", customerTypeCreate: null } }, "error"],
  ["operation errors", { ...successfulResponse, errors: [new GraphQLError("Failed")] }, "error"],
  [
    "payload errors",
    {
      data: {
        __typename: "Mutation",
        customerTypeCreate: {
          __typename: "CustomerTypeCreate",
          customerType: null,
          errors: [
            {
              __typename: "CustomerTypeCreateError",
              code: CustomerTypeCreateErrorCode.INVALID,
              field: "name",
              message: "Failed",
            },
          ],
        },
      },
    },
    "error",
  ],
];

describe("useCreateCustomerType analytics", () => {
  beforeEach(() => jest.clearAllMocks());

  it.each(cases)("tracks the outcome for %s", async (_description, response, outcome) => {
    // Arrange
    mockMutate.mockResolvedValueOnce(response);

    const { result } = renderHook(() => useCreateCustomerType({ onClose: jest.fn() }));

    // Act
    await act(async () => {
      await result.current.onSubmit({ name: "Wholesale" });
    });

    // Assert
    expect(mockTrackEvent).toHaveBeenCalledWith("customer_type_created", { result: outcome });
  });
});
