import { attributeAddUrl, attributeListUrl } from "@dashboard/attributes/urls";
import { categoryAddUrl, categoryListUrl } from "@dashboard/categories/urls";
import { channelAddUrl, channelsListUrl } from "@dashboard/channels/urls";
import { collectionAddUrl, collectionListUrl } from "@dashboard/collections/urls";
import Link from "@dashboard/components/Link";
import { customerAddPath, customerListUrl } from "@dashboard/customers/urls";
import { saleAddUrl, saleListUrl, voucherAddUrl, voucherListUrl } from "@dashboard/discounts/urls";
import { ExtensionsUrls } from "@dashboard/extensions/urls";
import { pageCreateUrl, pageListUrl } from "@dashboard/modeling/urls";
import { pageTypeAddPath, pageTypeListUrl } from "@dashboard/modelTypes/urls";
import { orderListUrl } from "@dashboard/orders/urls";
import { productListUrl } from "@dashboard/products/urls";
import { productTypeAddUrl, productTypeListUrl } from "@dashboard/productTypes/urls";
import { shippingZoneAddUrl, shippingZonesListUrl } from "@dashboard/shipping/urls";
import { staffListUrl } from "@dashboard/staff/urls";
import { warehouseAddUrl, warehouseListUrl } from "@dashboard/warehouses/urls";
import { Box, Text } from "@saleor/macaw-ui-next";
import * as React from "react";
import { defineMessages, FormattedMessage, MessageDescriptor, useIntl } from "react-intl";

const ActionLinkItem = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link href={href} data-href={href} id={href} className="command-menu-item" data-focus={false}>
      <Box
        display="flex"
        alignItems="center"
        color="default1"
        gap={2}
        paddingY={1.5}
        backgroundColor={{
          hover: "default1Hovered",
        }}
        paddingX={6}
        role="option"
        tabIndex={-1}
      >
        <Text size={2} fontWeight="medium" color="default1">
          {children}
        </Text>
      </Box>
    </Link>
  );
};

interface TriggerDescriptor {
  section: MessageDescriptor;
  name: MessageDescriptor;
  Component: React.ComponentType<{
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  }>;
}

const allMessages = defineMessages({
  inviteUser: {
    defaultMessage: "Invite user/staff member",
    id: "tZ/9Sl",
  },
  gotoUsers: {
    defaultMessage: "Go to users/staff members",
    id: "3xv4ez",
  },
  createCustomer: {
    defaultMessage: "Create customer",
    id: "ninItd",
  },
  gotoCustomers: {
    defaultMessage: "Go to customers",
    id: "o7ePJQ",
  },
  discountsSection: {
    defaultMessage: "Discounts",
    id: "n+Gwbu",
  },
  createPromotion: {
    defaultMessage: "Create promotion",
    id: "jNoqH0",
  },
  gotoPromotions: {
    defaultMessage: "Go to promotions",
    id: "Dd0Dwl",
  },
  createVoucher: {
    defaultMessage: "Create voucher",
    id: "YIT1XP",
  },
  gotoVouchers: {
    defaultMessage: "Go to vouchers",
    id: "nQQVdc",
  },
  extensionsSection: {
    defaultMessage: "Extensions",
    id: "nb2FlN",
  },
  gotoInstalledExtensions: {
    defaultMessage: "Go to installed extensions",
    id: "ivTlck",
  },
  gotoExploreExtensions: {
    defaultMessage: "Go to explore extensions",
    id: "h84DkG",
  },
  createWebhook: {
    defaultMessage: "Create webhook/extension manually",
    id: "NGWTE4",
  },
  installExtensionFromManifest: {
    defaultMessage: "Install extension from manifest",
    id: "mvVmbJ",
  },
  gotoProductTypes: {
    defaultMessage: "Go to product types",
    id: "zoUlyR",
  },
  createProductType: {
    defaultMessage: "Create a product type",
    id: "OAuXGE",
  },
});

const allActions: TriggerDescriptor[] = [
  {
    section: {
      id: "X7jl6w",
      defaultMessage: "Orders",
    },
    name: {
      id: "QOm7+P",
      defaultMessage: "Create new order",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={orderListUrl({ action: "create-order" })}>
          <FormattedMessage id="QOm7+P" defaultMessage="Create new order" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "X7jl6w",
      defaultMessage: "Orders",
    },
    name: {
      id: "ofewGR",
      defaultMessage: "Go to orders",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={orderListUrl()}>
          <FormattedMessage id="ofewGR" defaultMessage="Go to orders" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "X7jl6w",
      defaultMessage: "Orders",
    },
    name: allMessages.createCustomer,
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={customerAddPath}>
          <FormattedMessage {...allMessages.createCustomer} />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "X7jl6w",
      defaultMessage: "Orders",
    },
    name: allMessages.gotoCustomers,
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={customerListUrl()}>
          <FormattedMessage {...allMessages.gotoCustomers} />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "7NFfmz",
      defaultMessage: "Products",
    },
    name: {
      id: "Sz6CRr",
      defaultMessage: "Create new product",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={productListUrl({ action: "create-product" })}>
          <FormattedMessage id="Sz6CRr" defaultMessage="Create new product" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "7NFfmz",
      defaultMessage: "Products",
    },
    name: {
      id: "lTrKHs",
      defaultMessage: "Go to products",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={productListUrl()}>
          <FormattedMessage id="lTrKHs" defaultMessage="Go to products" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "7NFfmz",
      defaultMessage: "Products",
    },
    name: {
      id: "Uqf8Ny",
      defaultMessage: "Create new category",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={categoryAddUrl()}>
          <FormattedMessage id="Uqf8Ny" defaultMessage="Create new category" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "7NFfmz",
      defaultMessage: "Products",
    },
    name: allMessages.gotoProductTypes,
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={productTypeListUrl()}>
          <FormattedMessage {...allMessages.gotoProductTypes} />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "7NFfmz",
      defaultMessage: "Products",
    },
    name: allMessages.createProductType,
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={productTypeAddUrl()}>
          <FormattedMessage {...allMessages.createProductType} />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "7NFfmz",
      defaultMessage: "Products",
    },
    name: {
      id: "QjwEr6",
      defaultMessage: "Go to categories",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={categoryListUrl()}>
          <FormattedMessage id="QjwEr6" defaultMessage="Go to categories" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "7NFfmz",
      defaultMessage: "Products",
    },
    name: {
      id: "O+3CZK",
      defaultMessage: "Create new collection",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={collectionAddUrl()}>
          <FormattedMessage id="O+3CZK" defaultMessage="Create new collection" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "7NFfmz",
      defaultMessage: "Products",
    },
    name: {
      id: "ITYiRy",
      defaultMessage: "Go to collections",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={collectionListUrl()}>
          <FormattedMessage id="ITYiRy" defaultMessage="Go to collections" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "blWvag",
      defaultMessage: "Models",
    },
    name: {
      id: "vbop3G",
      defaultMessage: "Create new model",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={pageCreateUrl()}>
          <FormattedMessage id="vbop3G" defaultMessage="Create new model" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "blWvag",
      defaultMessage: "Models",
    },
    name: {
      id: "dQn96a",
      defaultMessage: "Go to models",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={pageListUrl()}>
          <FormattedMessage id="dQn96a" defaultMessage="Go to models" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "blWvag",
      defaultMessage: "Models",
    },
    name: {
      id: "Ed2705",
      defaultMessage: "Create new model type",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={pageTypeAddPath}>
          <FormattedMessage id="Ed2705" defaultMessage="Create new model type" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "blWvag",
      defaultMessage: "Models",
    },
    name: {
      id: "5nrCxC",
      defaultMessage: "Go to model types",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={pageTypeListUrl()}>
          <FormattedMessage id="5nrCxC" defaultMessage="Go to model types" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "7OW8BT",
      defaultMessage: "Configuration",
    },
    name: {
      id: "LLS4re",
      defaultMessage: "Go to model attributes",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={attributeListUrl()}>
          <FormattedMessage id="LLS4re" defaultMessage="Go to attributes" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "7OW8BT",
      defaultMessage: "Configuration",
    },
    name: {
      id: "5FSIZp",
      defaultMessage: "Create new attribute",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={attributeAddUrl()}>
          <FormattedMessage id="5FSIZp" defaultMessage="Create new attribute" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "7OW8BT",
      defaultMessage: "Configuration",
    },
    name: {
      id: "HwTMFL",
      defaultMessage: "Go to channels",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={channelsListUrl()}>
          <FormattedMessage id="HwTMFL" defaultMessage="Go to channels" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "7OW8BT",
      defaultMessage: "Configuration",
    },
    name: {
      id: "Nuq83+",
      defaultMessage: "Go to channels",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={channelAddUrl}>
          <FormattedMessage id="Nuq83+" defaultMessage="Create new channel" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "7OW8BT",
      defaultMessage: "Configuration",
    },
    name: {
      id: "wFVOKJ",
      defaultMessage: "Go to warehouses",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={warehouseListUrl()}>
          <FormattedMessage id="wFVOKJ" defaultMessage="Go to warehouses" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "7OW8BT",
      defaultMessage: "Configuration",
    },
    name: {
      id: "LVtwcF",
      defaultMessage: "Create new warehouse",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={warehouseAddUrl}>
          <FormattedMessage id="LVtwcF" defaultMessage="Create new warehouse" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "7OW8BT",
      defaultMessage: "Configuration",
    },
    name: {
      id: "tIc6ZH",
      defaultMessage: "Go to shipping zones",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={shippingZonesListUrl()}>
          <FormattedMessage id="tIc6ZH" defaultMessage="Go to shipping methods" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "7OW8BT",
      defaultMessage: "Configuration",
    },
    name: {
      id: "P4Hja1",
      defaultMessage: "Create new shipping zone",
    },
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={shippingZoneAddUrl}>
          <FormattedMessage id="P4Hja1" defaultMessage="Create new shipping zone" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "7OW8BT",
      defaultMessage: "Configuration",
    },
    name: allMessages.gotoUsers,
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={staffListUrl()}>
          <FormattedMessage {...allMessages.gotoUsers} />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: {
      id: "7OW8BT",
      defaultMessage: "Configuration",
    },
    name: allMessages.inviteUser,
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={staffListUrl({ action: "add" })}>
          <FormattedMessage {...allMessages.inviteUser} />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: allMessages.discountsSection,
    name: allMessages.gotoPromotions,
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={saleListUrl()}>
          <FormattedMessage {...allMessages.gotoPromotions} />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: allMessages.discountsSection,
    name: allMessages.createPromotion,
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={saleAddUrl()}>
          <FormattedMessage {...allMessages.createPromotion} />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: allMessages.discountsSection,
    name: allMessages.gotoVouchers,
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={voucherListUrl()}>
          <FormattedMessage {...allMessages.gotoVouchers} />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: allMessages.discountsSection,
    name: allMessages.createVoucher,
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={voucherAddUrl()}>
          <FormattedMessage {...allMessages.createVoucher} />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: allMessages.extensionsSection,
    name: allMessages.gotoInstalledExtensions,
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={ExtensionsUrls.resolveInstalledExtensionsUrl()}>
          <FormattedMessage {...allMessages.gotoInstalledExtensions} />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: allMessages.extensionsSection,
    name: allMessages.gotoExploreExtensions,
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={ExtensionsUrls.resolveExploreExtensionsUrl()}>
          <FormattedMessage {...allMessages.gotoExploreExtensions} />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: allMessages.extensionsSection,
    name: allMessages.createWebhook,
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={ExtensionsUrls.addCustomExtensionUrl()}>
          <FormattedMessage {...allMessages.createWebhook} />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: allMessages.extensionsSection,
    name: allMessages.installExtensionFromManifest,
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={ExtensionsUrls.resolveInstallCustomExtensionUrl()}>
          <FormattedMessage {...allMessages.installExtensionFromManifest} />
        </ActionLinkItem>
      </Box>
    ),
  },
];

export const useActionTriggers = () => {
  const intl = useIntl();

  return allActions.map(action => ({
    ...action,
    section: intl.formatMessage(action.section),
    name: intl.formatMessage(action.name),
  }));
};
