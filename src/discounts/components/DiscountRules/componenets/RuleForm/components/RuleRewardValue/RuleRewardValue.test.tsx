import { type Rule } from "@dashboard/discounts/models";
import { PromotionTypeEnum, RewardValueTypeEnum } from "@dashboard/graphql";
import { ThemeProvider } from "@saleor/macaw-ui-next";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { DiscountRulesContextProvider } from "../../../../context";
import { RuleRewardValue } from "./RuleRewardValue";

const defaultValues = {
  rewardValue: null,
  rewardValueType: RewardValueTypeEnum.FIXED,
} as unknown as Rule;

let submittedValue: number | null | undefined;

const Wrapper = ({ children }: { children: ReactNode }) => {
  const methods = useForm<Rule>({ defaultValues });

  submittedValue = methods.watch("rewardValue");

  return (
    <ThemeProvider>
      <DiscountRulesContextProvider
        discountType={PromotionTypeEnum.CATALOGUE}
        channels={[]}
        disabled={false}
      >
        <FormProvider {...methods}>{children}</FormProvider>
      </DiscountRulesContextProvider>
    </ThemeProvider>
  );
};

const renderRewardValue = () =>
  render(<RuleRewardValue currencySymbol="USD" error={undefined} />, { wrapper: Wrapper });

describe("RuleRewardValue", () => {
  beforeEach(() => {
    submittedValue = undefined;
  });

  it("keeps the fractional part of a decimal reward value", async () => {
    // Arrange
    renderRewardValue();

    const input = screen.getByTestId("reward-value-input");

    // Act
    await userEvent.type(input, "12.55");

    // Assert
    expect(submittedValue).toBe(12.55);
  });

  it("keeps a reward value below one", async () => {
    // Arrange
    renderRewardValue();

    const input = screen.getByTestId("reward-value-input");

    // Act
    await userEvent.type(input, "0.5");

    // Assert
    expect(submittedValue).toBe(0.5);
  });

  it("clears the reward value when the input is emptied", async () => {
    // Arrange
    renderRewardValue();

    const input = screen.getByTestId("reward-value-input");

    await userEvent.type(input, "12");

    // Act
    await userEvent.clear(input);

    // Assert
    expect(submittedValue).toBeNull();
  });

  it("allows decimals to be entered", () => {
    // Arrange & Act
    renderRewardValue();

    // Assert
    expect(screen.getByTestId("reward-value-input")).toHaveAttribute("step", "any");
  });
});
