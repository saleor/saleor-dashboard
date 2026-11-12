import { type Rule } from "@dashboard/discounts/models/Rule";
import { PromotionTypeEnum, RewardValueTypeEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { fireEvent, render, screen } from "@testing-library/react";

import { DiscountCreateForm } from "./DiscountCreateForm";

const keepMeRule: Rule = {
  id: "",
  name: "Keep me",
  description: "",
  channel: { label: "Default channel", value: "channel-1" },
  rewardType: null,
  rewardValue: 10,
  rewardValueType: RewardValueTypeEnum.PERCENTAGE,
  rewardGifts: [],
  conditions: [],
};

const renderCreateForm = (): void => {
  render(
    <DiscountCreateForm onSubmit={jest.fn()}>
      {({ rules, discountType, onRuleSubmit, onTypeChange }) => (
        <>
          <button type="button" onClick={() => onRuleSubmit(keepMeRule, null)}>
            Add rule
          </button>
          <button type="button" onClick={() => onTypeChange(PromotionTypeEnum.ORDER)}>
            Pick Order
          </button>
          <output aria-label="Type">{discountType}</output>
          <ul aria-label="Rules">
            {rules.map(rule => (
              <li key={rule.name}>{rule.name}</li>
            ))}
          </ul>
        </>
      )}
    </DiscountCreateForm>,
    { wrapper: Wrapper },
  );
};

const shownRules = (): string[] =>
  screen.queryAllByRole("listitem").map(item => item.textContent ?? "");

describe("DiscountCreateForm type change", () => {
  it("changes the type right away when no rules have been added", () => {
    // Arrange
    renderCreateForm();

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Pick Order" }));

    // Assert
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Type")).toHaveTextContent(PromotionTypeEnum.ORDER);
  });

  it("asks before the change removes the added rules, and keeps type and rules on Cancel", async () => {
    // Arrange
    renderCreateForm();
    fireEvent.click(screen.getByRole("button", { name: "Add rule" }));

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Pick Order" }));

    const dialog = await screen.findByRole("dialog");
    const dialogText = dialog.textContent;

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    // Assert
    expect(dialogText).toContain(
      "The rule you added only works for Catalog promotions. Changing the type removes it.",
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Type")).toHaveTextContent(PromotionTypeEnum.CATALOGUE);
    expect(shownRules()).toEqual(["Keep me"]);
  });

  it("changes the type and removes the rules once the merchant confirms", async () => {
    // Arrange
    renderCreateForm();
    fireEvent.click(screen.getByRole("button", { name: "Add rule" }));
    fireEvent.click(screen.getByRole("button", { name: "Pick Order" }));
    await screen.findByRole("dialog");

    // Act
    fireEvent.click(screen.getByRole("button", { name: "Change type" }));

    // Assert
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Type")).toHaveTextContent(PromotionTypeEnum.ORDER);
    expect(shownRules()).toEqual([]);
  });
});
