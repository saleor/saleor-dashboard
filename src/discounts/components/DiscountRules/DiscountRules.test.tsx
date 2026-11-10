import { MockedProvider } from "@apollo/client/testing";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton/ConfirmButton";
import { mockResizeObserver } from "@dashboard/components/Datagrid/testUtils";
import { type Rule } from "@dashboard/discounts/models/Rule";
import { PromotionTypeEnum } from "@dashboard/graphql";
import { type CommonError } from "@dashboard/utils/errors/common";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode, useState } from "react";
import { MemoryRouter } from "react-router-dom";

import {
  searchCategoriesMock,
  searchCollectionsMock,
  searchProductsMock,
  searchVariantsMock,
} from "./componenets/RuleForm/components/RuleConditionValues/hooks/options/mocks";
import { variantsWithProductDataMock } from "./componenets/RuleForm/components/RuleRewardGifts/mock";
import { DiscountRules } from "./DiscountRules";
import { catalogComplexRules, catalogRules, channels, orderRules } from "./mocksData";

jest.mock("@dashboard/hooks/useNotifier/useNotifier", () => ({
  useNotifier: jest.fn((): (() => void) => {
    return (): void => undefined;
  }),
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

const Wrapper = ({ children }: { children: ReactNode }): React.ReactNode => {
  return (
    <MemoryRouter>
      <MockedProvider
        mocks={[
          searchCategoriesMock,
          searchCollectionsMock,
          searchProductsMock,
          searchVariantsMock,
          variantsWithProductDataMock,
        ]}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </MockedProvider>
    </MemoryRouter>
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
    expect(
      screen.getByText(/each rule is an alternative\. customers get the best matching discount\./i),
    ).toBeInTheDocument();
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
      expect(screen.getByText("Catalog rule 2")).toBeInTheDocument();
    });
    // Assert
    expect(screen.getByText("Catalog rule 2")).toBeInTheDocument();
    expect(screen.getByText("Catalog rule 1")).toBeInTheDocument();
    expect(screen.getAllByTestId("rule-summary").length).toBe(2);
    expect(screen.getAllByText("Applies to")).toHaveLength(2);
    expect(screen.getAllByTestId("rule-value-chip")).toHaveLength(2);
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
      expect(screen.getByText("order rule 2")).toBeInTheDocument();
    });
    // Assert
    expect(screen.getByText("order rule 2")).toBeInTheDocument();
    expect(screen.getByText("Order rule 1")).toBeInTheDocument();
    expect(screen.getAllByTestId("rule-summary").length).toBe(2);
    expect(screen.getAllByText("Applies to")).toHaveLength(2);
    expect(screen.getAllByTestId("rule-value-chip")).toHaveLength(2);
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
  it.each(["0.05", "0.001", "12.05"])("keeps a typed reward value of %s as typed", async typed => {
    // Arrange
    render(
      <DiscountRules
        promotionId={null}
        discountType={PromotionTypeEnum.CATALOGUE}
        channels={channels}
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
    await act(async () => {
      await userEvent.click(await screen.findByRole("button", { name: /add rule/i }));
    });

    const rewardValueInput = screen.getByRole("input", { name: "Reward value" });
    const shownWhenOpened = (rewardValueInput as HTMLInputElement).value;

    // Act
    await userEvent.type(rewardValueInput, typed);

    // Assert
    expect(shownWhenOpened).toBe("");
    expect(rewardValueInput).toHaveDisplayValue(typed);
  });

  it("saves a typed reward value below 1 without dropping digits", async () => {
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
    await act(async () => {
      await userEvent.click(await screen.findByRole("button", { name: /add rule/i }));
    });
    await userEvent.type(screen.getByRole("input", { name: "Name" }), "Small discount");
    await userEvent.click(screen.getByTestId("channel-dropdown"));
    expect(await screen.findByText(/test/i)).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getAllByTestId("select-option")[0]);
    });

    // Act
    await userEvent.type(screen.getByRole("input", { name: "Reward value" }), "0.05");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    // Assert
    await waitFor(() => {
      expect(onRuleAdd).toHaveBeenCalledWith(expect.objectContaining({ rewardValue: 0.05 }), null);
    });
  });

  it.each([
    ["stays open with the draft when saving the rule fails", false, true],
    ["closes once the rule is saved", true, false],
  ])("the rule dialog %s", async (_case, saved, staysOpen) => {
    // Arrange
    const onRuleSubmit = jest.fn(() => Promise.resolve(saved));

    render(
      <DiscountRules
        promotionId="promotion-1"
        discountType={PromotionTypeEnum.CATALOGUE}
        channels={channels}
        rules={[]}
        errors={[]}
        onRuleSubmit={onRuleSubmit}
        onRuleDelete={jest.fn()}
        disabled={false}
        deleteButtonState="default"
        getRuleConfirmButtonState={jest.fn(() => "default")}
      />,
      { wrapper: Wrapper },
    );
    await act(async () => {
      await userEvent.click(await screen.findByRole("button", { name: /add rule/i }));
    });
    await userEvent.type(screen.getByRole("input", { name: "Name" }), "Weekend sale");
    await userEvent.click(screen.getByTestId("channel-dropdown"));
    expect(await screen.findByText(/test/i)).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getAllByTestId("select-option")[0]);
    });
    await userEvent.type(screen.getByRole("input", { name: "Reward value" }), "10");

    // Act
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => expect(onRuleSubmit).toHaveBeenCalled());
    // Let the dialog act on the save's result, and React render that, before looking.
    await act(async () => {
      await onRuleSubmit.mock.results[0].value;
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Assert
    expect(screen.queryByRole("input", { name: "Name" }) !== null).toBe(staysOpen);

    if (staysOpen) {
      expect(screen.getByRole("input", { name: "Name" })).toHaveValue("Weekend sale");
    }
  });

  it("shows the API's error for the reward until the value changes, and not in the next dialog", async () => {
    // Arrange
    const precisionError: CommonError<string> = {
      code: "INVALID_PRECISION",
      field: "rewardValue",
      message: "Invalid amount precision.",
    };
    // Like the details page: a failed save hands the API's errors back to the rules card.
    const PageWithFailingSave = (): React.ReactNode => {
      const [errors, setErrors] = useState<Array<CommonError<string>>>([]);

      return (
        <DiscountRules
          promotionId="promotion-1"
          discountType={PromotionTypeEnum.CATALOGUE}
          channels={channels}
          rules={[]}
          errors={errors}
          onRuleSubmit={async () => {
            setErrors([precisionError]);

            return false;
          }}
          onRuleDelete={jest.fn()}
          disabled={false}
          deleteButtonState="default"
          getRuleConfirmButtonState={jest.fn(() => "default")}
        />
      );
    };

    render(<PageWithFailingSave />, { wrapper: Wrapper });
    await act(async () => {
      await userEvent.click(await screen.findByRole("button", { name: /add rule/i }));
    });
    await userEvent.type(screen.getByRole("input", { name: "Name" }), "Weekend sale");
    await userEvent.click(screen.getByTestId("channel-dropdown"));
    expect(await screen.findByText(/test/i)).toBeInTheDocument();
    await act(async () => {
      await userEvent.click(screen.getAllByTestId("select-option")[0]);
    });
    await userEvent.type(screen.getByRole("input", { name: "Reward value" }), "10");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));

    const shownAfterFailedSave = (await screen.findByText("Invalid amount precision.")).isConnected;

    // Act
    await userEvent.type(screen.getByRole("input", { name: "Reward value" }), "5");

    const shownAfterChange = screen.queryByText("Invalid amount precision.") !== null;

    await userEvent.click(screen.getByRole("button", { name: /back/i }));
    await act(async () => {
      await userEvent.click(await screen.findByRole("button", { name: /add rule/i }));
    });

    // Assert
    expect(shownAfterFailedSave).toBe(true);
    expect(shownAfterChange).toBe(false);
    expect(screen.queryByText("Invalid amount precision.")).not.toBeInTheDocument();
  });

  it("keeps an edited field when the rule list refreshes while the dialog is open", async () => {
    // Arrange
    const ruleProps = {
      promotionId: "promotion-1",
      discountType: PromotionTypeEnum.CATALOGUE,
      channels,
      errors: [],
      onRuleSubmit: jest.fn(),
      onRuleDelete: jest.fn(),
      disabled: false,
      deleteButtonState: "default" as const,
      getRuleConfirmButtonState: jest.fn((): ConfirmButtonTransitionState => "default"),
    };
    const { rerender } = render(<DiscountRules {...ruleProps} rules={[catalogRules[0]]} />, {
      wrapper: Wrapper,
    });

    await act(async () => {
      await userEvent.click((await screen.findAllByTestId("rule-edit-button"))[0]);
    });

    const name = screen.getByRole("input", { name: "Name" });

    await userEvent.clear(name);
    await userEvent.type(name, "Draft name");

    // Act
    // The page rebuilds its rules, as it does while a save runs, with a change to another field.
    rerender(
      <DiscountRules {...ruleProps} rules={[{ ...catalogRules[0], description: "Refreshed" }]} />,
    );

    // Assert
    expect(screen.getByRole("input", { name: "Name" })).toHaveValue("Draft name");
  });

  const renderRuleAndEdit = async (rule: Rule): Promise<void> => {
    render(
      <DiscountRules
        promotionId="promotion-1"
        discountType={PromotionTypeEnum.CATALOGUE}
        channels={channels}
        rules={[rule]}
        errors={[]}
        onRuleSubmit={jest.fn()}
        onRuleDelete={jest.fn()}
        disabled={false}
        deleteButtonState="default"
        getRuleConfirmButtonState={jest.fn(() => "default")}
      />,
      { wrapper: Wrapper },
    );
    await act(async () => {
      await userEvent.click((await screen.findAllByTestId("rule-edit-button"))[0]);
    });
  };
  const otherChannelsNote =
    "This rule also applies in Channel-PLN. You can edit the rule here, but not its channels.";

  it("names a rule's other channels and locks its channel", async () => {
    // Arrange
    const rule: Rule = {
      ...catalogRules[0],
      otherChannels: [{ id: "channel-pln", name: "Channel-PLN", currencyCode: "PLN" }],
    };

    // Act
    await renderRuleAndEdit(rule);

    // Assert
    expect(screen.getByTestId("channel-dropdown")).toBeDisabled();
    expect(screen.getByText(otherChannelsNote)).toBeInTheDocument();
  });

  it("lets a rule on one channel change its channel", async () => {
    // Arrange
    const rule: Rule = { ...catalogRules[0], otherChannels: undefined };

    // Act
    await renderRuleAndEdit(rule);

    // Assert
    expect(screen.getByTestId("channel-dropdown")).toBeEnabled();
    expect(screen.queryByText(otherChannelsNote)).not.toBeInTheDocument();
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
    await userEvent.click(screen.getByTestId("fixed-reward-value-type"));
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
    await userEvent.click(await screen.findByTestId(/condition-name-0/i));
    await userEvent.click(screen.getAllByTestId("select-option")[0]);
    await userEvent.click(await screen.findByTestId(/condition-value-0/i));
    await userEvent.click(await screen.getAllByTestId("select-option")[1]);
    // Edit reward
    await userEvent.click(screen.getByTestId("fixed-reward-value-type"));

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
            id: "product",
            type: "is",
            value: [
              {
                label: "Banana Juice",
                value: "UHJvZHVjdDo3NA==",
              },
            ],
          },
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
    await userEvent.click(await screen.findByTestId(/condition-name-0/i));
    await userEvent.click(screen.getAllByTestId("select-option")[0]);
    await userEvent.click(await screen.findByTestId(/condition-type-0/i));
    await userEvent.click(screen.getAllByTestId("select-option")[1]);
    await userEvent.clear(await screen.findByTestId(/condition-value-0/i));
    await userEvent.type(await screen.findByTestId(/condition-value-0/i), "100");
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
            id: "baseSubtotalPrice",
            type: "lower",
            value: "100",
          },
          {
            id: "baseTotalPrice",
            type: "greater",
            value: "144",
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
