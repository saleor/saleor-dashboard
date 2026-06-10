import { Box, Text } from "@saleor/macaw-ui-next";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { type ReactNode } from "react";

import ArrowSort from "./ArrowSort";
import Attributes from "./Attributes";
import Channels from "./Channels";
import { ConfigurationIcon } from "./Configuration";
import { CustomersIcon } from "./Customers";
import { DisabledIcon } from "./Disabled";
import { DiscountsIcon } from "./Discounts";
import Drag from "./Drag";
import { ErrorCircle } from "./ErrorCircle";
import ErrorExclamationCircle from "./ErrorExclamationCircle";
import { ExclamationIcon } from "./ExclamationIcon";
import { ExclamationIconFilled } from "./ExclamationIconFilled";
import { GraphqlIcon } from "./GraphqlIcon";
import { HomeIcon } from "./Home";
import { MarketplaceIcon } from "./Marketplace";
import ModelingIcon from "./Modeling";
import { OrdersIcon } from "./Orders";
import PermissionGroups from "./PermissionGroups";
import { PluginIcon } from "./PluginIcon";
import { ProductsIcon } from "./Products";
import ProductTypes from "./ProductTypes";
import { RefundedIcon } from "./RefundedIcon";
import { RetryIcon } from "./RetryIcon";
import { ReturnedIcon } from "./ReturnedIcon";
import ShippingMethods from "./ShippingMethods";
import SiteSettings from "./SiteSettings";
import StaffMembers from "./StaffMembers";
import { StrikethroughIcon } from "./StrikethroughIcon";
import Taxes from "./Taxes";
import { TerminalIcon } from "./TerminalIcon";
import { TranslationsIcon } from "./Translations";
import Warehouses from "./Warehouses";
import { WebhookIcon } from "./WebhookIcon";

interface IconEntry {
  name: string;
  group: "navigation" | "configuration" | "status" | "utility" | "extension";
  render: () => ReactNode;
}

const Strikethrough = () => (
  <span aria-label="StrikethroughIcon" dangerouslySetInnerHTML={{ __html: StrikethroughIcon }} />
);

const icons: IconEntry[] = [
  { name: "HomeIcon", group: "navigation", render: () => <HomeIcon /> },
  { name: "ProductsIcon", group: "navigation", render: () => <ProductsIcon /> },
  { name: "OrdersIcon", group: "navigation", render: () => <OrdersIcon /> },
  { name: "CustomersIcon", group: "navigation", render: () => <CustomersIcon /> },
  { name: "DiscountsIcon", group: "navigation", render: () => <DiscountsIcon /> },
  { name: "MarketplaceIcon", group: "navigation", render: () => <MarketplaceIcon /> },
  { name: "TranslationsIcon", group: "navigation", render: () => <TranslationsIcon /> },
  { name: "ModelingIcon", group: "navigation", render: () => <ModelingIcon /> },
  { name: "ConfigurationIcon", group: "navigation", render: () => <ConfigurationIcon /> },
  { name: "Attributes", group: "configuration", render: () => <Attributes /> },
  { name: "Channels", group: "configuration", render: () => <Channels /> },
  { name: "PermissionGroups", group: "configuration", render: () => <PermissionGroups /> },
  { name: "ProductTypes", group: "configuration", render: () => <ProductTypes /> },
  { name: "ShippingMethods", group: "configuration", render: () => <ShippingMethods /> },
  { name: "SiteSettings", group: "configuration", render: () => <SiteSettings /> },
  { name: "StaffMembers", group: "configuration", render: () => <StaffMembers /> },
  { name: "Taxes", group: "configuration", render: () => <Taxes /> },
  { name: "Warehouses", group: "configuration", render: () => <Warehouses /> },
  { name: "DisabledIcon", group: "status", render: () => <DisabledIcon /> },
  { name: "ErrorCircle", group: "status", render: () => <ErrorCircle /> },
  { name: "ErrorExclamationCircle", group: "status", render: () => <ErrorExclamationCircle /> },
  { name: "ExclamationIcon", group: "status", render: () => <ExclamationIcon /> },
  { name: "ExclamationIconFilled", group: "status", render: () => <ExclamationIconFilled /> },
  { name: "RetryIcon", group: "status", render: () => <RetryIcon /> },
  { name: "RefundedIcon", group: "status", render: () => <RefundedIcon /> },
  { name: "ReturnedIcon", group: "status", render: () => <ReturnedIcon /> },
  { name: "Drag", group: "utility", render: () => <Drag /> },
  { name: "ArrowSort", group: "utility", render: () => <ArrowSort /> },
  { name: "StrikethroughIcon", group: "utility", render: () => <Strikethrough /> },
  { name: "PluginIcon", group: "extension", render: () => <PluginIcon /> },
  { name: "WebhookIcon", group: "extension", render: () => <WebhookIcon /> },
  { name: "TerminalIcon", group: "extension", render: () => <TerminalIcon /> },
  { name: "GraphqlIcon", group: "extension", render: () => <GraphqlIcon /> },
];

const groupOrder: Array<IconEntry["group"]> = [
  "navigation",
  "configuration",
  "status",
  "utility",
  "extension",
];

const groupLabels: Record<IconEntry["group"], string> = {
  navigation: "Sidebar navigation",
  configuration: "Configuration menu",
  status: "Status & inline indicators",
  utility: "Utility",
  extension: "Extensions & tooling",
};

const IconCell = ({ name, render }: IconEntry) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    gap={2}
    padding={4}
    borderWidth={1}
    borderStyle="solid"
    borderColor="default1"
    borderRadius={3}
    __width="160px"
  >
    <Box display="flex" alignItems="center" justifyContent="center" __width="32px" __height="32px">
      {render()}
    </Box>
    <Text size={1} color="default2" textAlign="center" wordBreak="break-all">
      {name}
    </Text>
  </Box>
);

const Showcase = () => (
  <Box display="flex" flexDirection="column" gap={6} padding={6}>
    {groupOrder.map(group => {
      const items = icons.filter(icon => icon.group === group);

      if (items.length === 0) {
        return null;
      }

      return (
        <Box key={group} display="flex" flexDirection="column" gap={3}>
          <Text fontWeight="medium" size={4}>
            {groupLabels[group]}
          </Text>
          <Box display="flex" flexWrap="wrap" gap={3}>
            {items.map(icon => (
              <IconCell key={icon.name} {...icon} />
            ))}
          </Box>
        </Box>
      );
    })}
  </Box>
);

const meta: Meta<typeof Showcase> = {
  title: "Icons/Legacy Icon Showcase",
  component: Showcase,
};

export default meta;
type Story = StoryObj<typeof Showcase>;

export const All: Story = {};
