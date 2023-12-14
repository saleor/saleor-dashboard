import { Rule } from "@dashboard/discounts/models";
import { RewardValueTypeEnum } from "@dashboard/graphql";
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { ReactNode } from "react";

import { DiscountRules } from "./DiscountRules";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => (
    <>{defaultMessage}</>
  ),
}));

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <LegacyThemeProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </LegacyThemeProvider>
  );
};

const rules = [
  {
    id: "cat-1",
    name: "Catalog rule 1",
    description: "",
    channel: { label: "Channel-1", value: "chan-1" },
    conditions: [
      {
        type: "product",
        condition: "is",
        values: [
          { label: "Product-1", value: "prod-1" },
          { label: "Product-2", value: "prod-2" },
        ],
      },
    ],
    rewardValue: 12,
    rewardValueType: RewardValueTypeEnum.FIXED,
  },
  {
    id: "cat-2",
    name: "Catalog rule 2",
    description: "",
    channel: { label: "Channel-3", value: "chan-3" },
    conditions: [
      {
        type: "category",
        condition: "is",
        values: [{ label: "Category-1", value: "cat-1" }],
      },
    ],
    rewardValue: 34,
    rewardValueType: RewardValueTypeEnum.PERCENTAGE,
  },
] as Rule[];

describe("DiscountRules", () => {
  it("should render placeholder when no rules", () => {
    // Arrange & Act
    render(
      <DiscountRules
        channels={[]}
        rules={[]}
        errors={[]}
        onRuleAdd={jest.fn()}
        onRuleDelete={jest.fn()}
        onRuleEdit={jest.fn()}
        disabled={false}
        ruleConditionsOptionsDetailsLoading={false}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(
      screen.getByText(/add your first rule to set up a promotion/i),
    ).toBeInTheDocument();
  });

  it("should render discount rules", () => {
    // Arrange & Act
    render(
      <DiscountRules
        channels={[]}
        rules={rules}
        errors={[]}
        onRuleAdd={jest.fn()}
        onRuleDelete={jest.fn()}
        onRuleEdit={jest.fn()}
        disabled={false}
        ruleConditionsOptionsDetailsLoading={false}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(
      screen.getByText(/catalog rule: catalog rule 2/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/catalog rule: catalog rule 1/i),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(
        /discount of {value} on the purchase of {items} through the {channel}/i,
      ).length,
    ).toBe(2);
  });

  it("should allow to add new rule", async () => {
    // Arrange
    const onRuleAdd = jest.fn();
    render(
      <DiscountRules
        channels={[]}
        rules={[]}
        errors={[]}
        onRuleAdd={onRuleAdd}
        onRuleDelete={jest.fn()}
        onRuleEdit={jest.fn()}
        disabled={false}
        ruleConditionsOptionsDetailsLoading={false}
      />,
      { wrapper: Wrapper },
    );

    // Act
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /add rule/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/^catalog$/i)).toBeInTheDocument();
    });

    await act(async () => {
      await userEvent.click(screen.getByText(/^catalog$/i));
    });

    // Assert
    expect(onRuleAdd).toHaveBeenCalled();
  });

  it("should allow to to handle delete rule", async () => {
    // Arrange
    const onRuleDelete = jest.fn();

    render(
      <DiscountRules
        channels={[]}
        rules={rules}
        errors={[]}
        onRuleAdd={jest.fn()}
        onRuleDelete={onRuleDelete}
        onRuleEdit={jest.fn()}
        disabled={false}
        ruleConditionsOptionsDetailsLoading={false}
      />,
      { wrapper: Wrapper },
    );

    // Act
    await act(async () => {
      await userEvent.click(screen.getAllByTestId("rule-delete-button")[0]);
    });

    // Assert
    expect(onRuleDelete).toHaveBeenCalled();
  });

  it("should allow to to handle update rule", async () => {
    // Arrange
    const onRuleEdit = jest.fn();

    render(
      <DiscountRules
        channels={[]}
        rules={rules}
        errors={[]}
        onRuleAdd={jest.fn()}
        onRuleDelete={jest.fn()}
        onRuleEdit={onRuleEdit}
        disabled={false}
        ruleConditionsOptionsDetailsLoading={false}
      />,
      { wrapper: Wrapper },
    );

    // Act
    await act(async () => {
      await userEvent.click(screen.getAllByTestId("rule-edit-button")[1]);
    });

    // Assert
    expect(onRuleEdit).toHaveBeenCalled();
  });

  it("should show error in rule", async () => {
    // Arrange & Act
    render(
      <DiscountRules
        channels={[]}
        rules={rules}
        errors={[
          {
            field: "rewardValue",
            message: "Reward value is required",
            code: "GRAPHQL_ERROR",
            index: 0,
          },
        ]}
        onRuleAdd={jest.fn()}
        onRuleDelete={jest.fn()}
        onRuleEdit={jest.fn()}
        disabled={false}
        ruleConditionsOptionsDetailsLoading={false}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(
      screen.getByText(/rule has error, open rule to see details/i),
    ).toBeInTheDocument();
  });
});
