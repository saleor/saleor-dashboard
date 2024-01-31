import { MockedProvider } from "@apollo/client/testing";
import { mockResizeObserver } from "@dashboard/components/Datagrid/testUtils";
import { Rule } from "@dashboard/discounts/models";
import {
  ChannelFragment,
  PromotionTypeEnum,
  RewardTypeEnum,
  RewardValueTypeEnum,
} from "@dashboard/graphql";
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { ReactNode } from "react";

import {
  searchCategoriesMock,
  searchCollectionsMock,
  searchProductsMock,
  searchVariantsMock,
} from "./componenets/RuleForm/components/RuleConditionValues/hooks/options/mocks";
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

jest.mock("@dashboard/hooks/useNotifier", () => ({
  __esModule: true,
  default: jest.fn(() => () => undefined),
}));

jest.setTimeout(30000); // Timeout was increased because of error throw in update test when run all tests

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <MockedProvider
      mocks={[
        searchCategoriesMock,
        searchCollectionsMock,
        searchProductsMock,
        searchVariantsMock,
      ]}
    >
      <LegacyThemeProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </LegacyThemeProvider>
    </MockedProvider>
  );
};

const channels = [
  // Apollo mocks only work with test channel
  // oif you want to use different channel, you need to update mocks
  {
    currencyCode: "$",
    id: "Q2hhbm5lcDoy",
    name: "Test",
    slug: "test",
    isActive: true,
  },
] as ChannelFragment[];

const catalogRules = [
  {
    id: "cat-1",
    name: "Catalog rule 1",
    description: "",
    channel: { label: "Test", value: "Q2hhbm5lcDoy" },
    conditions: [
      {
        id: "product",
        type: "is",
        value: [
          { label: "Product-1", value: "prod-1" },
          { label: "Product-2", value: "prod-2" },
        ],
      },
      {
        id: "category",
        type: "is",
        value: [{ label: "Category-2", value: "cat-2" }],
      },
    ],
    rewardValue: 12,
    rewardType: RewardTypeEnum.SUBTOTAL_DISCOUNT,
    rewardValueType: RewardValueTypeEnum.FIXED,
  },
  {
    id: "cat-2",
    name: "Catalog rule 2",
    description: "",
    channel: { label: "Test", value: "Q2hhbm5lcDoy" },
    conditions: [
      {
        id: "category",
        type: "is",
        value: [{ label: "Category-1", value: "cat-1" }],
      },
    ],
    rewardType: RewardTypeEnum.SUBTOTAL_DISCOUNT,
    rewardValue: 34,
    rewardValueType: RewardValueTypeEnum.PERCENTAGE,
  },
] as Rule[];

const orderRule = [
  {
    id: "order-1",
    name: "Order rule 1",
    description: "",
    channel: { label: "Test", value: "Q2hhbm5lcDoy" },
    conditions: [
      {
        id: "baseSubtotalPrice",
        type: "greater",
        value: "33",
      },
      {
        id: "baseTotalPrice",
        type: "greater",
        value: "55",
      },
    ],
    rewardValue: 12,
    rewardType: RewardTypeEnum.SUBTOTAL_DISCOUNT,
    rewardValueType: RewardValueTypeEnum.FIXED,
  },
  {
    id: "order-2",
    name: "order rule 2",
    description: "",
    channel: { label: "Test", value: "Q2hhbm5lcDoy" },
    conditions: [
      {
        id: "baseSubtotalPrice",
        type: "between",
        value: ["33", "44"],
      },
      {
        id: "baseTotalPrice",
        type: "between",
        value: ["33", "44"],
      },
    ],
    rewardType: RewardTypeEnum.SUBTOTAL_DISCOUNT,
    rewardValue: 34,
    rewardValueType: RewardValueTypeEnum.PERCENTAGE,
  },
] as Rule[];

describe("DiscountRules", () => {
  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    });
    window.IntersectionObserver = mockIntersectionObserver;

    mockResizeObserver();
  });

  it("should render placeholder when no rules", () => {
    // Arrange & Act
    render(
      <DiscountRules
        discountType={PromotionTypeEnum.CATALOGUE}
        channels={[]}
        rules={[]}
        errors={[]}
        onRuleSubmit={jest.fn()}
        onRuleDelete={jest.fn()}
        disabled={false}
        loading={false}
        deleteButtonState="default"
        getRuleConfirmButtonState={jest.fn(() => "default")}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(
      screen.getByText(/add your first rule to set up a promotion/i),
    ).toBeInTheDocument();
  });

  it("should render catalog discount rules", async () => {
    // Arrange & Act
    render(
      <DiscountRules
        discountType={PromotionTypeEnum.CATALOGUE}
        channels={[]}
        rules={catalogRules}
        errors={[]}
        onRuleSubmit={jest.fn()}
        onRuleDelete={jest.fn()}
        disabled={false}
        loading={false}
        deleteButtonState="default"
        getRuleConfirmButtonState={jest.fn(() => "default")}
      />,
      { wrapper: Wrapper },
    );

    await waitFor(() => {
      expect(
        screen.getByText(/catalog rule: catalog rule 2/i),
      ).toBeInTheDocument();
    });

    // Assert
    expect(
      screen.getByText(/catalog rule: catalog rule 2/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/catalog rule: catalog rule 1/i),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(
        /discount of {value} on the purchase of {conditions} through the {channel}/i,
      ).length,
    ).toBe(2);
  });

  it("should render order discount rules", async () => {
    // Arrange & Act
    render(
      <DiscountRules
        discountType={PromotionTypeEnum.ORDER}
        channels={[]}
        rules={orderRule}
        errors={[]}
        onRuleSubmit={jest.fn()}
        onRuleDelete={jest.fn()}
        disabled={false}
        loading={false}
        deleteButtonState="default"
        getRuleConfirmButtonState={jest.fn(() => "default")}
      />,
      { wrapper: Wrapper },
    );

    await waitFor(() => {
      expect(screen.getByText(/order rule: order rule 2/i)).toBeInTheDocument();
    });

    // Assert
    expect(screen.getByText(/order rule: order rule 2/i)).toBeInTheDocument();
    expect(screen.getByText(/order rule: order rule 1/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(
        /discount of {value} on the purchase of {conditions} through the {channel}/i,
      ).length,
    ).toBe(2);
  });

  it("should allow to add new catalog rule", async () => {
    // Arrange
    const onRuleAdd = jest.fn();
    render(
      <DiscountRules
        discountType={PromotionTypeEnum.CATALOGUE}
        channels={channels}
        rules={[]}
        errors={[]}
        onRuleSubmit={onRuleAdd}
        onRuleDelete={jest.fn()}
        disabled={false}
        loading={false}
        deleteButtonState="default"
        getRuleConfirmButtonState={jest.fn(() => "default")}
      />,
      { wrapper: Wrapper },
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /add rule/i }),
      ).toBeInTheDocument();
    });

    // Act
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /add rule/i }));
    });

    await userEvent.type(
      screen.getByRole("input", { name: "Name" }),
      "Name 123",
    );

    // Select channel
    await userEvent.click(screen.getByRole("combobox"));
    expect(await screen.findByText(/test/i)).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(screen.getAllByTestId("select-option")[0]);
    });

    // Add condition
    await userEvent.click(
      screen.getByRole("button", { name: /add condition/i }),
    );
    await userEvent.click(await screen.findByTestId(/condition-name-0/i));
    await userEvent.click(screen.getAllByTestId("select-option")[0]);

    await userEvent.click(await screen.findByTestId(/condition-value-0/i));
    await userEvent.click(await screen.getAllByTestId("select-option")[0]);

    // Add reward value
    await userEvent.type(
      screen.getByRole("input", { name: "Discount value" }),
      "22",
    );

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    // Assert
    expect(onRuleAdd).toHaveBeenCalledWith(
      {
        channel: {
          label: "Test",
          value: "Q2hhbm5lcDoy",
        },
        conditions: [
          {
            id: "product",
            type: "is",
            value: [
              {
                label: "Apple Juice",
                value: "UHJvZHVjdDo3Mg==",
              },
            ],
          },
        ],
        description: "",
        id: "",
        name: "Name 123",
        rewardValue: 22,
        rewardValueType: "FIXED",
      },
      null,
    );
  });

  it("should allow to add new order rule", async () => {
    // Arrange
    const onRuleAdd = jest.fn();
    render(
      <DiscountRules
        discountType={PromotionTypeEnum.ORDER}
        channels={channels}
        rules={[]}
        errors={[]}
        onRuleSubmit={onRuleAdd}
        onRuleDelete={jest.fn()}
        disabled={false}
        loading={false}
        deleteButtonState="default"
        getRuleConfirmButtonState={jest.fn(() => "default")}
      />,
      { wrapper: Wrapper },
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /add rule/i }),
      ).toBeInTheDocument();
    });

    // Act
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /add rule/i }));
    });

    await userEvent.type(
      screen.getByRole("input", { name: "Name" }),
      "Order rule 123",
    );

    // Channel select
    await userEvent.click(screen.getByRole("combobox"));
    expect(await screen.findByText(/test/i)).toBeInTheDocument();

    await act(async () => {
      await userEvent.click(screen.getAllByTestId("select-option")[0]);
    });

    // Condition select
    await userEvent.click(
      screen.getByRole("button", { name: /add condition/i }),
    );
    await userEvent.click(await screen.findByTestId(/condition-name-0/i));
    await userEvent.click(screen.getAllByTestId("select-option")[0]);

    await userEvent.click(await screen.findByTestId(/condition-type-0/i));
    await userEvent.click(screen.getAllByTestId("select-option")[2]);

    await userEvent.type(
      await screen.findByTestId(/condition-value-0/i),
      "144",
    );

    await userEvent.type(
      screen.getByRole("input", { name: "Discount value" }),
      "22",
    );

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    // Assert
    expect(onRuleAdd).toHaveBeenCalledWith(
      {
        channel: {
          label: "Test",
          value: "Q2hhbm5lcDoy",
        },
        conditions: [
          {
            id: "baseSubtotalPrice",
            type: "greater",
            value: "144",
          },
        ],
        description: "",
        id: "",
        name: "Order rule 123",
        rewardValue: 22,
        rewardValueType: "FIXED",
      },
      null,
    );
  });

  it("should allow to to handle update catalog rule", async () => {
    // Arrange
    const onRuleEdit = jest.fn();

    render(
      <DiscountRules
        discountType={PromotionTypeEnum.CATALOGUE}
        channels={channels}
        rules={catalogRules}
        errors={[]}
        onRuleSubmit={onRuleEdit}
        onRuleDelete={jest.fn()}
        disabled={false}
        loading={false}
        deleteButtonState="default"
        getRuleConfirmButtonState={jest.fn(() => "default")}
      />,
      { wrapper: Wrapper },
    );

    await waitFor(() => {
      expect(screen.getAllByTestId("rule-edit-button")[0]).toBeInTheDocument();
    });

    // Act
    await act(async () => {
      await userEvent.click(screen.getAllByTestId("rule-edit-button")[0]);
    });

    await screen.findAllByText(/edit rule/i);

    // Edit name
    const nameField = screen.getByRole("input", { name: "Name" });
    await userEvent.clear(nameField);
    await userEvent.type(nameField, "New name");

    // Edit condition
    await userEvent.click(await screen.findByTestId(/condition-name-0/i));
    await userEvent.click(screen.getAllByTestId("select-option")[1]);

    await userEvent.click(await screen.findByTestId(/condition-value-0/i));
    await userEvent.click(await screen.getAllByTestId("select-option")[2]);

    // Remove condition
    await act(async () => {
      await userEvent.click(await screen.findByTestId(/condition-remove-1/i));
    });

    // Add new condition
    await act(async () => {
      await userEvent.click(
        screen.getByRole("button", { name: /add condition/i }),
      );
    });
    await userEvent.click(await screen.findByTestId(/condition-name-1/i));
    await userEvent.click(screen.getAllByTestId("select-option")[0]);

    await userEvent.click(await screen.findByTestId(/condition-value-1/i));
    await userEvent.click(await screen.getAllByTestId("select-option")[1]);

    // Edit reward
    await userEvent.click(screen.getByRole("radio", { name: "$" }));
    const discountValueField = screen.getByRole("input", {
      name: "Discount value",
    });
    await userEvent.clear(discountValueField);
    await userEvent.type(discountValueField, "122");

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    // Assert
    expect(onRuleEdit).toHaveBeenCalledWith(
      {
        id: "cat-1",
        name: "New name",
        channel: {
          label: "Test",
          value: "Q2hhbm5lcDoy",
        },
        conditions: [
          {
            id: "variant",
            type: "is",
            value: [
              {
                label: "55cm x 55cm",
                value: "UHJvZHVjdFZhcmlhbnQ6OTg4",
              },
            ],
          },
          {
            id: "product",
            type: "is",
            value: [
              {
                label: "Banana Juice",
                value: "UHJvZHVjdDo3NA==",
              },
            ],
          },
        ],
        description: "",
        rewardValue: 122,
        rewardValueType: "FIXED",
      },
      0,
    );
  });

  it("should allow to to handle update order rule", async () => {
    // Arrange
    const onRuleEdit = jest.fn();

    render(
      <DiscountRules
        discountType={PromotionTypeEnum.ORDER}
        channels={channels}
        rules={orderRule}
        errors={[]}
        onRuleSubmit={onRuleEdit}
        onRuleDelete={jest.fn()}
        disabled={false}
        loading={false}
        deleteButtonState="default"
        getRuleConfirmButtonState={jest.fn(() => "default")}
      />,
      { wrapper: Wrapper },
    );

    await waitFor(() => {
      expect(screen.getAllByTestId("rule-edit-button")[0]).toBeInTheDocument();
    });

    // Act
    await act(async () => {
      await userEvent.click(screen.getAllByTestId("rule-edit-button")[0]);
    });

    await screen.findAllByText(/edit rule/i);

    // Edit name
    const nameField = screen.getByRole("input", { name: "Name" });
    await userEvent.clear(nameField);
    await userEvent.type(nameField, "New name");

    // Remove condition
    await act(async () => {
      await userEvent.click(await screen.findByTestId(/condition-remove-1/i));
    });

    // Edit condition
    await userEvent.click(await screen.findByTestId(/condition-name-0/i));
    await userEvent.click(screen.getAllByTestId("select-option")[0]);

    await userEvent.click(await screen.findByTestId(/condition-type-0/i));
    await userEvent.click(screen.getAllByTestId("select-option")[2]);

    await userEvent.clear(await screen.findByTestId(/condition-value-0/i));
    await userEvent.type(
      await screen.findByTestId(/condition-value-0/i),
      "144",
    );

    // Add new condition
    await act(async () => {
      await userEvent.click(
        screen.getByRole("button", { name: /add condition/i }),
      );
    });
    await userEvent.click(await screen.findByTestId(/condition-name-1/i));
    await userEvent.click(screen.getAllByTestId("select-option")[0]);

    await userEvent.click(await screen.findByTestId(/condition-type-1/i));
    await userEvent.click(screen.getAllByTestId("select-option")[1]);

    await userEvent.clear(await screen.findByTestId(/condition-value-1/i));
    await userEvent.type(
      await screen.findByTestId(/condition-value-1/i),
      "100",
    );

    // Edit reward value
    await userEvent.click(screen.getByRole("radio", { name: "$" }));
    const discountValueField = screen.getByRole("input", {
      name: "Discount value",
    });
    await userEvent.clear(discountValueField);
    await userEvent.type(discountValueField, "122");

    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    // Assert
    expect(onRuleEdit).toHaveBeenCalledWith(
      {
        id: "order-1",
        name: "New name",
        channel: {
          label: "Test",
          value: "Q2hhbm5lcDoy",
        },
        conditions: [
          {
            id: "baseTotalPrice",
            type: "greater",
            value: "144",
          },
          {
            id: "baseSubtotalPrice",
            type: "lower",
            value: "100",
          },
        ],
        description: "",
        rewardValue: 122,
        rewardValueType: "FIXED",
      },
      0,
    );
  });

  it("should allow to to handle delete rule", async () => {
    // Arrange
    const onRuleDelete = jest.fn();

    render(
      <DiscountRules
        discountType={PromotionTypeEnum.CATALOGUE}
        channels={[]}
        rules={catalogRules}
        errors={[]}
        onRuleSubmit={jest.fn()}
        onRuleDelete={onRuleDelete}
        disabled={false}
        loading={false}
        deleteButtonState="default"
        getRuleConfirmButtonState={jest.fn(() => "default")}
      />,
      { wrapper: Wrapper },
    );

    // Act
    await act(async () => {
      await userEvent.click(screen.getAllByTestId("rule-delete-button")[0]);
    });

    await screen.findByText(/delete rule/i);

    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    });

    // Assert
    expect(onRuleDelete).toHaveBeenCalledWith(0);
    expect(screen.queryByText(/delete rule/i)).not.toBeInTheDocument();
  });

  it("should show error in rule", async () => {
    // Arrange & Act
    render(
      <DiscountRules
        discountType={PromotionTypeEnum.CATALOGUE}
        channels={[]}
        rules={catalogRules}
        errors={[
          {
            field: "rewardValue",
            message: "Reward value is required",
            code: "GRAPHQL_ERROR",
            index: 0,
          } as any,
        ]}
        onRuleSubmit={jest.fn()}
        onRuleDelete={jest.fn()}
        disabled={false}
        loading={false}
        deleteButtonState="default"
        getRuleConfirmButtonState={jest.fn(() => "default")}
      />,
      { wrapper: Wrapper },
    );

    // Assert
    expect(
      screen.getByText(/rule has error, open rule to see details/i),
    ).toBeInTheDocument();
  });
});
