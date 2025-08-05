import { attributeAddUrl, attributeListUrl } from "@dashboard/attributes/urls";
import { categoryAddUrl, categoryListUrl } from "@dashboard/categories/urls";
import { channelAddUrl, channelsListUrl } from "@dashboard/channels/urls";
import { collectionAddUrl, collectionListUrl } from "@dashboard/collections/urls";
import Link from "@dashboard/components/Link";
import { extractIdFromUrlContext } from "@dashboard/components/NavigatorSearch/extract-id-from-url-context";
import { pageCreateUrl, pageListUrl } from "@dashboard/modeling/urls";
import { pageTypeAddPath, pageTypeListUrl } from "@dashboard/modelTypes/urls";
import { orderListUrl } from "@dashboard/orders/urls";
import { productListUrl } from "@dashboard/products/urls";
import { shippingZoneAddUrl, shippingZonesListUrl } from "@dashboard/shipping/urls";
import { warehouseAddUrl, warehouseListUrl } from "@dashboard/warehouses/urls";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { defineMessage, FormattedMessage, MessageDescriptor, useIntl } from "react-intl";

const ActionLinkItem = ({ href, children }: { href?: string; children: React.ReactNode }) => {
  if (href) {
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
  } else {
    return (
      <Box
        cursor="pointer"
        data-focus={false}
        className="command-menu-item"
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
    );
  }
};

interface TriggerDescriptor {
  section: MessageDescriptor;
  name: MessageDescriptor;
  Component: React.ComponentType<{
    onClick?: (event: React.MouseEvent<HTMLAnchorElement | HTMLDivElement>) => void;
  }>;
  id?: string;
}

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
    section: defineMessage({
      id: "7OW8BT",
      defaultMessage: "Configuration",
    }),
    name: defineMessage({
      id: "LVtwcF",
      defaultMessage: "Create new warehouse",
    }),
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={warehouseAddUrl}>
          <FormattedMessage id="LVtwcF" defaultMessage="Create new warehouse" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: defineMessage({
      id: "7OW8BT",
      defaultMessage: "Configuration",
    }),
    name: defineMessage({
      id: "Pl/ilB",
      defaultMessage: "Go to shipping zones",
    }),
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={shippingZonesListUrl()}>
          <FormattedMessage id="tIc6ZH" defaultMessage="Go to shipping methods" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: defineMessage({
      id: "7OW8BT",
      defaultMessage: "Configuration",
    }),
    name: defineMessage({
      id: "P4Hja1",
      defaultMessage: "Create new shipping zone",
    }),
    Component: ({ onClick }) => (
      <Box onClick={onClick}>
        <ActionLinkItem href={shippingZoneAddUrl}>
          <FormattedMessage id="P4Hja1" defaultMessage="Create new shipping zone" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    id: "copy-id",
    name: defineMessage({
      defaultMessage: "Copy ID",
      id: "wtLjP6",
    }),
    section: defineMessage({
      defaultMessage: "Actions",
      id: "wL7VAE",
    }),
    Component: ({ onClick }) => {
      const idToCopy = extractIdFromUrlContext();

      const copy = () => {
        if (idToCopy && navigator.clipboard) {
          navigator.clipboard.writeText(idToCopy);
        }
      };

      useHotkeys(
        "enter",
        () => {
          console.log("y u no work? :(((");
          copy();
        },
        {
          preventDefault: true,
          eventListenerOptions: {
            capture: true,
          },
        },
        [idToCopy],
      );

      // It's a littly hacky but the design of this component doesn't allow to easily work with non-link components. Hence we need some extra lifting linline
      return (
        <Box
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            copy();
            onClick && onClick(e);
          }}
        >
          <ActionLinkItem href={"#"}>
            <FormattedMessage id="wtLjP6" defaultMessage="Copy ID" />
          </ActionLinkItem>
        </Box>
      );
    },
  },
];

export const useActionTriggers = () => {
  const intl = useIntl();
  const idInContext = extractIdFromUrlContext();

  // Hide copy ID action if page doesn't provide id in context, like list or homepage
  return allActions
    .filter(action => {
      if (action.id === "copy-id" && !idInContext) {
        return false;
      }

      return true;
    })
    .map(action => ({
      ...action,
      section: intl.formatMessage(action.section),
      name: intl.formatMessage(action.name),
    }));
};
