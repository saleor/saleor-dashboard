import type { Meta, StoryObj } from "@storybook/react-vite";

import { TaxAppLabel } from "./TaxAppLabel";

const meta: Meta<typeof TaxAppLabel> = {
  title: "Taxes/TaxAppLabel",
  component: TaxAppLabel,
};

export default meta;

type Story = StoryObj<typeof TaxAppLabel>;

export const WithNameAndDate: Story = {
  args: {
    name: "Avalara",
    logoUrl: undefined,
    created: "2024-01-15T10:30:00Z",
    id: "app-1",
  },
};

export const WithLogo: Story = {
  args: {
    name: "TaxJar",
    logoUrl: "https://placeholdit.com/128x128/dddddd/999999?text=app",
    created: "2024-06-20T14:00:00Z",
    id: "app-2",
  },
};

export const WithoutDate: Story = {
  args: {
    name: "Tax App",
    logoUrl: undefined,
    created: null,
    id: "app-3",
  },
};

export const WithoutName: Story = {
  args: {
    name: null,
    logoUrl: undefined,
    created: "2024-03-10T08:00:00Z",
    id: "app-4",
  },
};

export const MinimalProps: Story = {
  args: {
    name: null,
    logoUrl: undefined,
    created: null,
    id: "app-5",
  },
};
