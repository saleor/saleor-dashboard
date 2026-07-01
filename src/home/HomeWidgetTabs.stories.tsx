import { type Extension } from "@dashboard/extensions/types";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { HomeWidgetTabs } from "./HomeWidgetTabs";

const buildExtension = (overrides: Partial<Extension>): Extension => ({
  id: "ext-1",
  app: {
    __typename: "App",
    id: "app-1",
    appUrl: "https://my-app.saleor.app",
    name: "Saleor App",
    brand: null,
  },
  accessToken: "token",
  permissions: [],
  label: "Widget",
  mountName: "HOMEPAGE_WIDGETS",
  url: "https://my-app.saleor.app/widget",
  open: () => undefined,
  targetName: "WIDGET",
  settings: null,
  isSaleorOfficial: true,
  fromCache: false,
  ...overrides,
});

const officialExtension = buildExtension({
  id: "official",
  label: "Sales Insights",
  app: {
    __typename: "App",
    id: "saleor-app",
    appUrl: "https://insights.saleor.app",
    name: "Saleor Insights",
    brand: null,
  },
  url: "https://insights.saleor.app/widget",
  isSaleorOfficial: true,
});

const externalExtension = buildExtension({
  id: "external",
  label: "Third-party widget",
  app: {
    __typename: "App",
    id: "external-app",
    appUrl: "https://third-party.example.com",
    name: "Acme Analytics",
    brand: null,
  },
  url: "https://third-party.example.com/widget",
  isSaleorOfficial: false,
});

const meta: Meta<typeof HomeWidgetTabs> = {
  title: "Home/HomeWidgetTabs",
  component: HomeWidgetTabs,
  args: {
    activeTab: { kind: "extension", id: officialExtension.id },
    fullscreenExtensions: [officialExtension, externalExtension],
    showWidgetsTab: false,
  },
};

export default meta;

type Story = StoryObj<typeof HomeWidgetTabs>;

export const Default: Story = {};

export const WithWidgetsTab: Story = {
  args: {
    fullscreenExtensions: [officialExtension, externalExtension],
    showWidgetsTab: true,
  },
};

export const WidgetsTabActive: Story = {
  args: {
    fullscreenExtensions: [officialExtension, externalExtension],
    showWidgetsTab: true,
    activeTab: { kind: "widgets" },
  },
};

export const OnlyOfficialApps: Story = {
  args: {
    fullscreenExtensions: [
      officialExtension,
      buildExtension({
        id: "official-2",
        label: "Order Tools",
        app: {
          __typename: "App",
          id: "saleor-orders",
          appUrl: "https://orders.saleor.app",
          name: "Saleor Orders",
          brand: null,
        },
        url: "https://orders.saleor.app/widget",
        isSaleorOfficial: true,
      }),
    ],
  },
};

export const OnlyExternalApps: Story = {
  args: {
    activeTab: { kind: "extension", id: externalExtension.id },
    fullscreenExtensions: [
      externalExtension,
      buildExtension({
        id: "external-2",
        label: "Marketing Hub",
        app: {
          __typename: "App",
          id: "marketing-app",
          appUrl: "https://marketing.example.com",
          name: "Marketing Co.",
          brand: null,
        },
        url: "https://marketing.example.com/widget",
        isSaleorOfficial: false,
      }),
    ],
  },
};

export const SingleTab: Story = {
  args: {
    fullscreenExtensions: [officialExtension],
  },
};

export const OnlyWidgetsTab: Story = {
  args: {
    fullscreenExtensions: [],
    showWidgetsTab: true,
    activeTab: { kind: "widgets" },
  },
};
