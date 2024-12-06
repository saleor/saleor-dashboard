import { MockedProvider } from "@apollo/client/testing";
import { mockResizeObserver } from "@dashboard/components/Datagrid/testUtils";
import { PromotionTypeEnum } from "@dashboard/graphql";
import { ThemeProvider as LegacyThemeProvider } from "@saleor/macaw-ui";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactNode } from "react";

import {
  searchCategoriesMock,
  searchCollectionsMock,
  searchProductsMock,
  searchVariantsMock,
} from "./componenets/RuleForm/components/RuleConditionValues/hooks/options/mocks";
import { variantsWithProductDataMock } from "./componenets/RuleForm/components/RuleRewardGifts/mock";
import { DiscountRules } from "./DiscountRules";
import { catalogComplexRules, catalogRules, channels, orderRules } from "./mocksData";

jest.mock("react-intl", () => ({
  useIntl: jest.fn(() => ({
    formatMessage: jest.fn(x => x.defaultMessage),
  })),
  defineMessages: jest.fn(x => x),
  FormattedMessage: ({ defaultMessage }: { defaultMessage: string }) => <>{defaultMessage}</>,
}));
jest.mock("@dashboard/hooks/useNotifier", () => ({
  __esModule: true,
  default: jest.fn(() => () => undefined),
}));
jest.mock("@dashboard/discounts/views/DiscountDetails/context/context", () => ({
  __esModule: true,
  useLabelMapsContext: jest.fn(() => ({
    ruleConditionsValues: {
      labels: {},
      loading: false,
    },
    gifts: {
      labels: [],
      loading: false,
    },
  })),
}));
jest.mock("./hooks/useGraphQLPlayground", () => ({
  useGraphQLPlayground: jest.fn(() => ({
    opepnGrapQLPlayground: jest.fn(),
  })),
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
        variantsWithProductDataMock,
      ]}
    >
      <LegacyThemeProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </LegacyThemeProvider>
    </MockedProvider>
  );
};

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
        promotionId={null}
        discountType={PromotionTypeEnum.CATALOGUE}
        channels={[]}
        rules={[]}
        errors={[]}
        onRuleSubmit={jest.fn()}
        onRuleDelete={jest.fn()}
        disabled={false}
        deleteButtonState="default"
        getRuleConfirmButtonState={jest.fn(() => "default")}
      />,
      { wrapper: Wrapper },
    );
    // Assert
    expect(screen.getByText(/add your first rule to set up a promotion/i)).toBeInTheDocument();
  });
  it("should render catalog discount rules", async () => {
    // Arrange & Act
    render(
      <DiscountRules
        promotionId={null}
        discountType={PromotionTypeEnum.CATALOGUE}
        channels={[]}
        rules={catalogRules}
        errors={[]}
        onRuleSubmit={jest.fn()}
        onRuleDelete={jest.fn()}
        disabled={false}
        deleteButtonState="default"
        getRuleConfirmButtonState={jest.fn(() => "default")}
      />,
      { wrapper: Wrapper },
    );
    await waitFor(() => {
      expect(screen.getByText(/catalog rule: catalog rule 2/i)).toBeInTheDocument();
    });
    // Assert
    expect(screen.getByText(/catalog rule: catalog rule 2/i)).toBeInTheDocument();
    expect(screen.getByText(/catalog rule: catalog rule 1/i)).toBeInTheDocument();
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
        promotionId={null}
        discountType={PromotionTypeEnum.ORDER}
        channels={[]}
        rules={orderRules}
        errors={[]}
        onRuleSubmit={jest.fn()}
        onRuleDelete={jest.fn()}
        disabled={false}
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
        promotionId={null}
        discountType={PromotionTypeEnum.CATALOGUE}
        channels={channels}
        rules={[]}
        errors={[]}
        onRuleSubmit={onRuleAdd}
        onRuleDelete={jest.fn()}
        disabled={false}
        deleteButtonState="default"
        getRuleConfirmButtonState={jest.fn(() => "default")}
      />,
      { wrapper: Wrapper },
    );
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /add rule/i })).toBeInTheDocument();
    });
    // Act
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /add rule/i }));
    });
    await userEvent.type(screen.getByRole("input", { name: "Name" }), "Name 123");
    // Select channel
    await userEvent.click(screen.getByTestId("channel-dropdown"));
    expect(await screen.findByText(/test/i)).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getAllByTestId("select-option")[0]);
    });
    // Add condition
    await userEvent.click(screen.getByRole("button", { name: /add condition/i }));
    await userEvent.click(await screen.findByTestId(/condition-name-0/i));
    await userEvent.click(screen.getAllByTestId("select-option")[0]);
    await userEvent.click(await screen.findByTestId(/condition-value-0/i));
    await userEvent.click(await screen.getAllByTestId("select-option")[0]);
    // Add reward value
    await userEvent.type(screen.getByRole("input", { name: "Reward value" }), "22");
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
        rewardGifts: [],
        rewardType: null,
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
        promotionId={null}
        discountType={PromotionTypeEnum.ORDER}
        channels={channels}
        rules={[]}
        errors={[]}
        onRuleSubmit={onRuleAdd}
        onRuleDelete={jest.fn()}
        disabled={false}
        deleteButtonState="default"
        getRuleConfirmButtonState={jest.fn(() => "default")}
      />,
      { wrapper: Wrapper },
    );
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /add rule/i })).toBeInTheDocument();
    });
    // Act
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /add rule/i }));
    });
    await userEvent.type(screen.getByRole("input", { name: "Name" }), "Order rule 123");
    // Channel select
    await userEvent.click(screen.getByTestId("channel-dropdown"));
    expect(await screen.findByText(/test/i)).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getAllByTestId("select-option")[0]);
    });
    // Condition select
    await userEvent.click(screen.getByRole("button", { name: /add condition/i }));
    await userEvent.click(await screen.findByTestId(/condition-name-0/i));
    await userEvent.click(screen.getAllByTestId("select-option")[0]);
    await userEvent.click(await screen.findByTestId(/condition-type-0/i));
    await userEvent.click(screen.getAllByTestId("select-option")[2]);
    await userEvent.type(await screen.findByTestId(/condition-value-0/i), "144");
    // Reward value
    await userEvent.click(screen.getByRole("radio", { name: "$" }));
    await userEvent.type(screen.getByRole("input", { name: "Reward value" }), "22");
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
        rewardGifts: [],
        rewardType: "SUBTOTAL_DISCOUNT",
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
        promotionId={null}
        discountType={PromotionTypeEnum.CATALOGUE}
        channels={channels}
        rules={catalogRules}
        errors={[]}
        onRuleSubmit={onRuleEdit}
        onRuleDelete={jest.fn()}
        disabled={false}
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
      await userEvent.click(screen.getByRole("button", { name: /add condition/i }));
    });
    await userEvent.click(await screen.findByTestId(/condition-name-1/i));
    await userEvent.click(screen.getAllByTestId("select-option")[0]);
    await userEvent.click(await screen.findByTestId(/condition-value-1/i));
    await userEvent.click(await screen.getAllByTestId("select-option")[1]);
    // Edit reward
    await userEvent.click(screen.getByRole("radio", { name: "$" }));

    const discountValueField = screen.getByRole("input", {
      name: "Reward value",
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
                label: "Carrot Juice - 1l",
                value: "UHJvZHVjdFZhcmlhbnQ6MjA2",
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
        rewardGifts: [],
        rewardType: null,
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
        promotionId={null}
        discountType={PromotionTypeEnum.ORDER}
        channels={channels}
        rules={orderRules}
        errors={[]}
        onRuleSubmit={onRuleEdit}
        onRuleDelete={jest.fn()}
        disabled={false}
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
    await userEvent.type(await screen.findByTestId(/condition-value-0/i), "144");
    // Add new condition
    await act(async () => {
      await userEvent.click(screen.getByRole("button", { name: /add condition/i }));
    });
    await userEvent.click(await screen.findByTestId(/condition-name-1/i));
    await userEvent.click(screen.getAllByTestId("select-option")[0]);
    await userEvent.click(await screen.findByTestId(/condition-type-1/i));
    await userEvent.click(screen.getAllByTestId("select-option")[1]);
    await userEvent.clear(await screen.findByTestId(/condition-value-1/i));
    await userEvent.type(await screen.findByTestId(/condition-value-1/i), "100");
    // Edit reward gifts
    await userEvent.click(screen.getByTestId("reward-type-select"));
    await userEvent.click(screen.getAllByTestId("select-option")[1]);
    await userEvent.click(screen.getByTestId("reward-gifts-select"));
    await userEvent.click(screen.getAllByTestId("select-option")[0]);
    await userEvent.click(screen.getAllByTestId("select-option")[2]);
    await userEvent.click(screen.getAllByTestId("select-option")[3]);
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
        rewardType: "GIFT",
        rewardGifts: [
          {
            label: "Code Division T-shirt - L",
            value: "UHJvZHVjdFZhcmlhbnQ6MjUz",
          },
          {
            label: "Blue Hoodie - S",
            value: "UHJvZHVjdFZhcmlhbnQ6MzAx",
          },
          {
            label: "Black Hoodie - XL",
            value: "UHJvZHVjdFZhcmlhbnQ6Mjk5",
          },
        ],
        rewardValue: null,
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
        promotionId={null}
        discountType={PromotionTypeEnum.CATALOGUE}
        channels={[]}
        rules={catalogRules}
        errors={[]}
        onRuleSubmit={jest.fn()}
        onRuleDelete={onRuleDelete}
        disabled={false}
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
  it("should display warning info when  rule is too complex", async () => {
    // Arrange
    render(
      <DiscountRules
        promotionId="1"
        discountType={PromotionTypeEnum.CATALOGUE}
        channels={[]}
        rules={catalogComplexRules}
        errors={[]}
        onRuleSubmit={jest.fn()}
        onRuleDelete={jest.fn()}
        disabled={false}
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
      await userEvent.click(screen.getAllByTestId("rule-edit-button")[2]);
    });
    await screen.findAllByText(/edit rule/i);
    // Assert
    expect(
      screen.getByText(/too complex conditions to display, use playground to see details/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("openPlaygroundButton")).toBeInTheDocument();
  });
  it("should show error in rule", async () => {
    // Arrange & Act
    render(
      <DiscountRules
        promotionId={null}
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
        deleteButtonState="default"
        getRuleConfirmButtonState={jest.fn(() => "default")}
      />,
      { wrapper: Wrapper },
    );
    // Assert
    expect(screen.getByText(/rule has error, open rule to see details/i)).toBeInTheDocument();
  });
});
