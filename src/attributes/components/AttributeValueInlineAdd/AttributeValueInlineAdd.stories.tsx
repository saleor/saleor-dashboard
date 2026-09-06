import { ResponsiveTable } from "@dashboard/components/ResponsiveTable/ResponsiveTable";
import { TableBody, TableCell, TableRow } from "@dashboard/components/Table/Table";
import { AttributeErrorCode, AttributeInputTypeEnum } from "@dashboard/graphql";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentProps } from "react";
import { fn } from "storybook/test";

import { AttributeValueInlineAdd } from "./AttributeValueInlineAdd";

const meta: Meta<typeof AttributeValueInlineAdd> = {
  title: "Attributes/AttributeValueInlineAdd",
  component: AttributeValueInlineAdd,
  render: (args: ComponentProps<typeof AttributeValueInlineAdd>) => (
    <ResponsiveTable>
      {args.hasRowsAbove && (
        <TableBody>
          <TableRow>
            <TableCell colSpan={args.columnSpan}>Red</TableCell>
          </TableRow>
        </TableBody>
      )}
      <AttributeValueInlineAdd {...args} />
    </ResponsiveTable>
  ),
  args: {
    columnSpan: 3,
    disabled: false,
    error: null,
    hasRowsAbove: true,
    inputType: AttributeInputTypeEnum.DROPDOWN,
    onAdd: fn(),
    onAddMany: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof AttributeValueInlineAdd>;

/** Table footer under existing values. */
export const Default: Story = {};

/** First value on a brand new attribute — no divider above. */
export const NoRowsAbove: Story = {
  args: { hasRowsAbove: false },
};

/** Swatch attributes add a colour/image picker and lose multi-paste. */
export const Swatch: Story = {
  args: { inputType: AttributeInputTypeEnum.SWATCH },
};

/** Rendered outside a table, e.g. in the attribute create form. */
export const SectionVariant: Story = {
  args: { variant: "section" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const WithError: Story = {
  args: {
    error: {
      __typename: "AttributeError",
      code: AttributeErrorCode.UNIQUE,
      field: "name",
      message: "Value with this name already exists",
    },
  },
};
