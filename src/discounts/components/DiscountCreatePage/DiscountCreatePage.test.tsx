import { type Rule } from "@dashboard/discounts/models/Rule";
import { RewardValueTypeEnum } from "@dashboard/graphql";
import Wrapper from "@test/wrapper";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";

import { DiscountCreatePage } from "./DiscountCreatePage";

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

// The real Savebar portals into a ref that AppLayout provides.
jest.mock("@dashboard/components/Savebar");
// Editor.js doesn't run in jsdom, and the description plays no part in the type change.
jest.mock("@dashboard/components/RichTextEditor/RichTextEditor", () => ({
  __esModule: true,
  default: () => null,
}));
jest.mock("@dashboard/components/RichTextEditor/RichTextEditorClamp", () => ({
  RichTextEditorClamp: () => null,
}));
jest.mock("../DiscountDates/DiscountDatesWithController", () => ({
  DiscountDatesWithController: () => null,
}));
// The rules card needs condition queries; this stand-in adds a rule and lists the rules it gets.
jest.mock("../DiscountRules/DiscountRules", () => ({
  DiscountRules: ({
    rules,
    onRuleSubmit,
  }: {
    rules: Rule[];
    onRuleSubmit: (rule: Rule, index: number | null) => void;
  }) => (
    <>
      <button type="button" onClick={() => onRuleSubmit(keepMeRule, null)}>
        Add rule
      </button>
      <ul aria-label="Rules">
        {rules.map(rule => (
          <li key={rule.name}>{rule.name}</li>
        ))}
      </ul>
    </>
  ),
}));

const RouterWrapper = ({ children }: { children: ReactNode }) => (
  <Wrapper>
    <MemoryRouter>{children}</MemoryRouter>
  </Wrapper>
);

const renderCreatePage = (): void => {
  render(
    <DiscountCreatePage
      channels={[]}
      disabled={false}
      errors={[]}
      submitButtonState="default"
      onBack={jest.fn()}
      onSubmit={jest.fn()}
    />,
    { wrapper: RouterWrapper },
  );
};

// The type select is the only combobox on the page. Its label isn't linked in jsdom, so it has no name.
const typeSelect = (): HTMLElement => screen.getByRole("combobox");

const pickType = async (name: string): Promise<void> => {
  await userEvent.click(typeSelect());
  await userEvent.click(await screen.findByRole("option", { name }));
};

const shownRules = (): string[] =>
  within(screen.getByRole("list", { name: "Rules" }))
    .queryAllByRole("listitem")
    .map(item => item.textContent ?? "");

describe("DiscountCreatePage type change", () => {
  it("changes the type right away when no rules have been added", async () => {
    // Arrange
    renderCreatePage();

    // Act
    await pickType("Order");

    // Assert
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(typeSelect()).toHaveTextContent("Order");
  });

  it("asks before the change removes the added rules, and keeps type and rules on Cancel", async () => {
    // Arrange
    renderCreatePage();
    await userEvent.click(screen.getByRole("button", { name: "Add rule" }));

    // Act
    await pickType("Order");

    const dialogText = (await screen.findByRole("dialog")).textContent;

    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    // Assert
    expect(dialogText).toContain(
      "The rule you added only works for Catalog discounts. Changing the type removes it.",
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(typeSelect()).toHaveTextContent("Catalog");
    expect(shownRules()).toEqual(["Keep me"]);
  });

  it("asks again when Order is picked after a Cancel", async () => {
    // Arrange
    renderCreatePage();
    await userEvent.click(screen.getByRole("button", { name: "Add rule" }));
    await pickType("Order");
    await userEvent.click(await screen.findByRole("button", { name: "Cancel" }));

    // Act
    await pickType("Order");

    // Assert
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("changes the type and removes the rules once the merchant confirms", async () => {
    // Arrange
    renderCreatePage();
    await userEvent.click(screen.getByRole("button", { name: "Add rule" }));
    await pickType("Order");

    // Act
    await userEvent.click(await screen.findByRole("button", { name: "Change type" }));

    // Assert
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(typeSelect()).toHaveTextContent("Order");
    expect(shownRules()).toEqual([]);
  });
});
