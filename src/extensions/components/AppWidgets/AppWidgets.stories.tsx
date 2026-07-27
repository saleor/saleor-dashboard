import { type ExtensionWithParams } from "@dashboard/extensions/types";
import { Box } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ComponentType, type ReactElement } from "react";
import { fn } from "storybook/test";

import { AppWidgets } from "./AppWidgets";

const buildExtension = (overrides: Partial<ExtensionWithParams> = {}): ExtensionWithParams => ({
  id: "extension-1",
  app: {
    __typename: "App",
    id: "app-1",
    appUrl: "https://example.com",
    name: "Example app",
    brand: null,
  },
  accessToken: "token",
  permissions: [],
  label: "Extension",
  identifier: null,
  mountName: "PRODUCT_DETAILS_WIDGETS",
  url: "https://example.com/widget",
  open: fn(),
  targetName: "WIDGET",
  settings: {},
  isSaleorOfficial: false,
  fromCache: false,
  ...overrides,
});

const appPageExtension = buildExtension({
  id: "product-launch",
  app: {
    __typename: "App",
    id: "product-launch-app",
    appUrl: "https://product-launch.example.com",
    name: "Product launch",
    brand: null,
  },
  label: "Product launch checklist",
  targetName: "APP_PAGE",
});

const newTabExtension = buildExtension({
  id: "product-documentation",
  app: {
    __typename: "App",
    id: "product-documentation-app",
    appUrl: "https://product-documentation.example.com",
    name: "Product documentation",
    brand: null,
  },
  label: "Open product documentation",
  targetName: "NEW_TAB",
});

const popupExtension = buildExtension({
  id: "product-support",
  app: {
    __typename: "App",
    id: "product-support-app",
    appUrl: "https://product-support.example.com",
    name: "Product support",
    brand: null,
  },
  label: "Contact product support",
  targetName: "POPUP",
});

const cachedWidgetExtension = buildExtension({
  id: "product-timestamps",
  app: {
    __typename: "App",
    id: "product-timestamps-app",
    appUrl: "https://product-timestamps.example.com",
    name: "Product Timestamps",
    brand: null,
  },
  label: "Product Timestamps",
  fromCache: true,
});

const meta: Meta<typeof AppWidgets> = {
  title: "Extensions/AppWidgets",
  component: AppWidgets,
  decorators: [
    (Story: ComponentType): ReactElement => (
      <Box
        borderColor="default1"
        borderLeftStyle="solid"
        borderLeftWidth={1}
        maxWidth="100%"
        paddingY={6}
        style={{ width: 440 }}
      >
        <Story />
      </Box>
    ),
  ],
  args: {
    extensions: [appPageExtension, newTabExtension, popupExtension, cachedWidgetExtension],
    params: {
      productId: "product-1",
      productSlug: "example-product",
    },
  },
};

export default meta;

type Story = StoryObj<typeof AppWidgets>;

export const MixedMountTypes: Story = {};

export const TextMounts: Story = {
  args: {
    extensions: [appPageExtension, newTabExtension, popupExtension],
  },
};

export const WidgetCards: Story = {
  args: {
    extensions: [
      cachedWidgetExtension,
      buildExtension({
        id: "product-insights",
        app: {
          __typename: "App",
          id: "product-insights-app",
          appUrl: "https://product-insights.example.com",
          name: "Product Insights",
          brand: null,
        },
        label: "Product Insights",
        fromCache: true,
      }),
    ],
  },
};
