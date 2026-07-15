import type { UserContext as UserContextType } from "@dashboard/auth/types";
import { UserContext } from "@dashboard/auth/useUser";
import type { UserFragment } from "@dashboard/graphql";
import { TerminalIcon } from "@dashboard/icons/TerminalIcon";
import { Button } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Trash2 } from "lucide-react";
import type { ComponentType } from "react";
import { fn } from "storybook/test";

import { TopNav } from "./index";

const mockUser: UserFragment = {
  __typename: "User",
  id: "user-1",
  email: "admin@example.com",
  firstName: "Admin",
  lastName: "User",
  isStaff: true,
  dateJoined: "2024-01-01T00:00:00Z",
  metadata: [],
  userPermissions: [],
  avatar: null,
  accessibleChannels: [],
  restrictedAccessToChannels: false,
};

const mockUserContext: UserContextType = {
  login: undefined,
  loginByExternalPlugin: undefined,
  logout: undefined,
  requestLoginByExternalPlugin: undefined,
  authenticating: false,
  isCredentialsLogin: false,
  authenticated: true,
  errors: [],
  refetchUser: undefined,
  user: mockUser,
};

const meta: Meta<typeof TopNav> = {
  title: "Components/AppLayout/TopNav",
  component: TopNav,
  decorators: [
    (Story: ComponentType) => (
      <UserContext.Provider value={mockUserContext}>
        <Story />
      </UserContext.Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TopNav>;

export const Default: Story = {
  render: () => <TopNav title="Products" />,
};

export const WithBackLink: Story = {
  render: () => <TopNav title="Product Details" href="/products" />,
};

export const WithChildren: Story = {
  render: () => (
    <TopNav title="Products">
      <Button variant="primary">Create product</Button>
    </TopNav>
  ),
};

export const WithMenu: Story = {
  render: () => (
    <TopNav title="Product Details" href="/products">
      <TopNav.Menu
        items={[
          { label: "Edit", onSelect: fn(), icon: <TerminalIcon /> },
          { label: "Delete", onSelect: fn(), color: "critical1", icon: <Trash2 size={16} /> },
        ]}
      />
    </TopNav>
  ),
};

export const WithDetailPageActions: Story = {
  render: () => (
    <TopNav title="Product Details" href="/products" actionsGap={3}>
      <TopNav.MetadataButton title="Edit product metadata" onClick={fn()} />
      <TopNav.Menu
        items={[
          {
            label: "Open in GraphiQL",
            onSelect: fn(),
            testId: "graphiql-redirect",
            icon: <TerminalIcon />,
          },
          {
            label: "Delete",
            onSelect: fn(),
            testId: "delete-item",
            color: "critical1",
            icon: <Trash2 size={16} />,
          },
        ]}
      />
    </TopNav>
  ),
};

export const WithoutBorder: Story = {
  render: () => <TopNav title="Dashboard" withoutBorder />,
};

export const WithSubtitle: Story = {
  render: () => (
    <TopNav title="Category" subtitle="Home / Electronics / Phones" href="/categories" />
  ),
};

export const WithSubtitleTop: Story = {
  render: () => (
    <TopNav title="Category" subtitleTop="Home / Electronics / Phones" href="/categories" />
  ),
};

export const LeftAligned: Story = {
  render: () => (
    <TopNav title="Products" isAlignToRight={false}>
      <Button variant="primary">Create product</Button>
    </TopNav>
  ),
};
