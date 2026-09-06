import {
  PostalCodeRuleInclusionTypeEnum,
  type ShippingMethodTypeFragment,
} from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { expect, fn, userEvent, within } from "storybook/test";

import ShippingZonePostalCodes from "./ShippingZonePostalCodes";

const postalCodes: ShippingMethodTypeFragment["postalCodeRules"] = [
  {
    __typename: "ShippingMethodPostalCodeRule",
    id: "rule-1",
    inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
    start: "00-100",
    end: "00-200",
  },
  {
    __typename: "ShippingMethodPostalCodeRule",
    id: "rule-2",
    inclusionType: PostalCodeRuleInclusionTypeEnum.EXCLUDE,
    start: "12-345",
    end: null,
  },
];

const meta: Meta<typeof ShippingZonePostalCodes> = {
  title: "Shipping/ShippingZonePostalCodes",
  component: ShippingZonePostalCodes,
  args: {
    disabled: false,
    postalCodes,
    onPostalCodeDelete: fn(),
    onPostalCodeInclusionChange: fn(),
    onPostalCodeRangeAdd: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ShippingZonePostalCodes>;
type Props = ComponentProps<typeof ShippingZonePostalCodes>;

export const Default: Story = {};

export const IncludeSelected: Story = {
  args: { inclusionType: PostalCodeRuleInclusionTypeEnum.INCLUDE },
};

export const NoPostalCodes: Story = {
  args: { postalCodes: [] },
};

export const Loading: Story = {
  args: { postalCodes: undefined },
};

const getRadio = (canvas: ReturnType<typeof within>, testId: string) =>
  within(canvas.getByTestId(testId)).getByRole("radio");

/** Switching to "Include" flips the meaning of every range below, so it reports up. */
export const SwitchingToIncludeReportsInclusionType: Story = {
  play: async ({ args, canvasElement }: { args: Props; canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);

    await expect(getRadio(canvas, PostalCodeRuleInclusionTypeEnum.EXCLUDE)).toHaveAttribute(
      "aria-checked",
      "true",
    );

    // Act
    await userEvent.click(getRadio(canvas, PostalCodeRuleInclusionTypeEnum.INCLUDE));

    // Assert
    await expect(args.onPostalCodeInclusionChange).toHaveBeenCalledExactlyOnceWith(
      PostalCodeRuleInclusionTypeEnum.INCLUDE,
    );
  },
};

export const SwitchingToExcludeReportsInclusionType: Story = {
  args: { inclusionType: PostalCodeRuleInclusionTypeEnum.INCLUDE },
  play: async ({ args, canvasElement }: { args: Props; canvasElement: HTMLElement }) => {
    // Arrange
    const canvas = within(canvasElement);

    // Act
    await userEvent.click(getRadio(canvas, PostalCodeRuleInclusionTypeEnum.EXCLUDE));

    // Assert
    await expect(args.onPostalCodeInclusionChange).toHaveBeenCalledExactlyOnceWith(
      PostalCodeRuleInclusionTypeEnum.EXCLUDE,
    );
  },
};
