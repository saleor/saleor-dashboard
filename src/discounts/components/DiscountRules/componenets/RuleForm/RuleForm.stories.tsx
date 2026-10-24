import { DiscountRulesContextProvider } from "@dashboard/discounts/components/DiscountRules/context/provider";
import {
  AllocationStrategyEnum,
  type ChannelFragment,
  PromotionTypeEnum,
} from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import { RuleFormModal } from "../RuleFormModal/RuleFormModal";
import { RuleForm } from "./RuleForm";

const channel: ChannelFragment = {
  __typename: "Channel",
  id: "Q2hhbm5lbDox",
  isActive: true,
  name: "US Store",
  slug: "us-store",
  currencyCode: "USD",
  defaultCountry: { __typename: "CountryDisplay", code: "US", country: "United States" },
  stockSettings: {
    __typename: "StockSettings",
    allocationStrategy: AllocationStrategyEnum.PRIORITIZE_SORTING_ORDER,
  },
};

const meta: Meta<typeof RuleForm> = {
  title: "Discounts / RuleForm",
  component: RuleForm,
  args: {
    errors: [],
    openPlayground: fn(),
  },
  render: (args: ComponentProps<typeof RuleForm>) => (
    <DiscountRulesContextProvider
      discountType={PromotionTypeEnum.CATALOGUE}
      channels={[channel]}
      disabled={false}
    >
      <RuleFormModal confirmButtonState="default" onClose={fn()} onSubmit={fn()}>
        <RuleForm {...args} />
      </RuleFormModal>
    </DiscountRulesContextProvider>
  ),
};

export default meta;
type Story = StoryObj<typeof RuleForm>;

export const NewRule: Story = {};

/** A new rule offers the fixed amount first once the channel's currency is known. */
export const NewRuleDefaultsToFixedAmount: Story = {
  play: async () => {
    // Arrange
    const body = within(document.body);

    // Act
    await userEvent.click(await body.findByTestId("channel-dropdown"));
    await userEvent.click(await body.findByRole("option", { name: "US Store" }));

    // Assert
    await expect(await body.findByRole("radio", { name: "Fixed amount" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(body.getByRole("radio", { name: "Percentage" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  },
};
