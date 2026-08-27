import { Box, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { ConstraintReasonHint } from "./ConstraintReasonHint";

const meta: Meta<typeof ConstraintReasonHint> = {
  title: "ConditionalFilter / ConstraintReasonHint",
  component: ConstraintReasonHint,
};

export default meta;

type Story = StoryObj<typeof ConstraintReasonHint>;

const FilterRowChrome = ({ fields }: { fields: string[] }): JSX.Element => (
  <Box
    __width="560px"
    padding={4}
    display="grid"
    __gridTemplateColumns="auto minmax(0, 1fr)"
    columnGap={2}
    rowGap={3}
    alignItems="start"
    backgroundColor="default1"
    borderRadius={2}
  >
    <Text size={2} color="default2" paddingTop={1.5}>
      where
    </Text>
    <Box display="flex" alignItems="center" gap={2}>
      <Box paddingX={2} paddingY={1} borderRadius={2} backgroundColor="default2" __minWidth="120px">
        <Text size={3}>Price</Text>
      </Box>
      <Box paddingX={2} paddingY={1} borderRadius={2} backgroundColor="default2">
        <Text size={3}>is</Text>
      </Box>
      <Box paddingX={2} paddingY={1} borderRadius={2} backgroundColor="default2" flexGrow="1">
        <Text size={3}>10</Text>
      </Box>
    </Box>
    <Text size={2} color="default2" paddingTop={1.5}>
      and
    </Text>
    <Box display="flex" alignItems="center" gap={2}>
      <ConstraintReasonHint fields={fields} />
      <Box paddingX={2} paddingY={1} borderRadius={2} backgroundColor="default2" __minWidth="120px">
        <Text size={3}>Channel</Text>
      </Box>
      <Box paddingX={2} paddingY={1} borderRadius={2} backgroundColor="default2">
        <Text size={3}>is</Text>
      </Box>
      <Box paddingX={2} paddingY={1} borderRadius={2} backgroundColor="default2" flexGrow="1">
        <Text size={3} color="default2">
          Select channel
        </Text>
      </Box>
    </Box>
  </Box>
);

export const Price: Story = {
  render: () => <FilterRowChrome fields={["Price"]} />,
};

export const Several: Story = {
  render: () => <FilterRowChrome fields={["Price", "Is published", "Is available"]} />,
};

export const Currency: Story = {
  render: () => <FilterRowChrome fields={["Current balance"]} />,
};
