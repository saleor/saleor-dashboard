import { Button, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { SearchInput } from "../SearchInput/SearchInput";
import { AssignableListCard } from "./AssignableListCard";

const meta: Meta<typeof AssignableListCard> = {
  title: "Components / AssignableListCard",
  component: AssignableListCard,
};

export default meta;
type Story = StoryObj<typeof AssignableListCard>;

const TablePlaceholder = (): JSX.Element => (
  <Text size={3} color="default2" padding={6} display="block">
    Table heading + rows live here. Hover a row to reveal delete.
  </Text>
);

export const TitleOnly: Story = {
  args: {
    title: "Attribute Values",
    children: <TablePlaceholder />,
  },
};

export const WithHeaderAction: Story = {
  args: {
    title: "Products in Summer",
    headerEnd: (
      <Button variant="secondary" type="button">
        Assign product
      </Button>
    ),
    children: <TablePlaceholder />,
  },
};

export const WithSearch: Story = {
  args: {
    title: "Attribute Values",
    headerEnd: (
      <Button variant="secondary" type="button">
        Assign value
      </Button>
    ),
    search: (
      <SearchInput value="" onChange={() => undefined} placeholder="Search attribute values..." />
    ),
    children: <TablePlaceholder />,
  },
};
