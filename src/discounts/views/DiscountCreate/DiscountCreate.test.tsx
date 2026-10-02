import { useExitFormDialog } from "@dashboard/components/Form/useExitFormDialog";
import {
  type PromotionCreateMutation,
  PromotionTypeEnum,
  usePromotionCreateMutation,
} from "@dashboard/graphql";
import useNavigator from "@dashboard/hooks/useNavigator";
import { useNotifier } from "@dashboard/hooks/useNotifier/useNotifier";
import { render } from "@testing-library/react";
import type React from "react";
import { IntlProvider } from "react-intl";

import { DiscountCreate } from "./DiscountCreate";

jest.mock("@dashboard/components/AppLayout/AppChannelContext", () => () => ({
  availableChannels: [],
}));
jest.mock("@dashboard/components/Form/useExitFormDialog");
jest.mock("@dashboard/components/WindowTitle", () => ({ WindowTitle: () => null }));
jest.mock("@dashboard/discounts/components/DiscountCreatePage/DiscountCreatePage", () => ({
  DiscountCreatePage: () => null,
}));
jest.mock("@dashboard/graphql", () => ({
  ...(jest.requireActual("@dashboard/graphql") as object),
  usePromotionCreateMutation: jest.fn(),
}));
jest.mock("@dashboard/hooks/useNavigator");
jest.mock("@dashboard/hooks/useNotifier/useNotifier");
jest.mock("../DiscountDetails/context/provider", () => ({
  EmpptyLabelsMapsProvider: ({ children }: { children: React.ReactNode }) => children,
}));
jest.mock("./handlers", () => ({ useDiscountCreate: () => jest.fn() }));

describe("DiscountCreate", () => {
  it("clears dirty form state before navigating after successful creation", () => {
    // Arrange
    const calls: string[] = [];
    const resetFormsState = jest.fn(() => calls.push("reset"));
    const navigate = jest.fn(() => calls.push("navigate"));
    const notify = jest.fn();
    let onCompleted: (data: PromotionCreateMutation) => void = () => undefined;

    (useExitFormDialog as jest.Mock).mockReturnValue({ resetFormsState });
    (useNavigator as jest.Mock).mockReturnValue(navigate);
    (useNotifier as jest.Mock).mockReturnValue(notify);
    (usePromotionCreateMutation as jest.Mock).mockImplementation(options => {
      onCompleted = options.onCompleted;

      return [jest.fn(), { loading: false, status: "default" }];
    });
    render(
      <IntlProvider locale="en">
        <DiscountCreate />
      </IntlProvider>,
    );

    // Act
    const result: PromotionCreateMutation = {
      __typename: "Mutation",
      promotionCreate: {
        __typename: "PromotionCreate",
        errors: [],
        promotion: {
          __typename: "Promotion",
          id: "promotion-id",
          name: "Promotion",
          type: PromotionTypeEnum.CATALOGUE,
          description: null,
          startDate: "2026-09-16T00:00:00Z",
          endDate: null,
          rules: [],
        },
      },
    };

    onCompleted(result);

    // Assert
    expect(resetFormsState).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledTimes(1);
    expect(calls).toEqual(["reset", "navigate"]);
  });
});
