import { categoryAddUrl, categoryListUrl } from "@dashboard/categories/urls";
import { collectionAddUrl, collectionListUrl } from "@dashboard/collections/urls";
import Link from "@dashboard/components/Link";
import { fuzzySearch } from "@dashboard/misc";
import { pageCreateUrl, pageListUrl } from "@dashboard/modeling/urls";
import { pageTypeAddPath, pageTypeListUrl } from "@dashboard/modelTypes/urls";
import { orderListUrl } from "@dashboard/orders/urls";
import { productListUrl } from "@dashboard/products/urls";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

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

const allActions = [
  {
    section: "Orders",
    name: "Create new order",
    component: (
      <Box>
        <ActionLinkItem href={orderListUrl({ action: "create-order" })}>
          <FormattedMessage id="QOm7+P" defaultMessage="Create new order" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: "Orders",
    name: "Go to orders",
    component: (
      <Box>
        <ActionLinkItem href={orderListUrl()}>
          <FormattedMessage id="ofewGR" defaultMessage="Go to orders" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: "Products",
    name: "Create new product",
    component: (
      <Box>
        <ActionLinkItem href={productListUrl({ action: "create-product" })}>
          <FormattedMessage id="Sz6CRr" defaultMessage="Create new product" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: "Products",
    name: "Go to products",
    component: (
      <Box>
        <ActionLinkItem href={productListUrl()}>
          <FormattedMessage id="lTrKHs" defaultMessage="Go to products" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: "Products",
    name: "Create new category",
    component: (
      <Box>
        <ActionLinkItem href={categoryAddUrl()}>
          <FormattedMessage id="Uqf8Ny" defaultMessage="Create new category" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: "Products",
    name: "Go to categories",
    component: (
      <Box>
        <ActionLinkItem href={categoryListUrl()}>
          <FormattedMessage id="QjwEr6" defaultMessage="Go to categories" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: "Products",
    name: "Create new collection",
    component: (
      <Box>
        <ActionLinkItem href={collectionAddUrl()}>
          <FormattedMessage id="O+3CZK" defaultMessage="Create new collection" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: "Products",
    name: "Go to collections",
    component: (
      <Box>
        <ActionLinkItem href={collectionListUrl()}>
          <FormattedMessage id="ITYiRy" defaultMessage="Go to collections" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: "Models",
    name: "Create new model",
    component: (
      <Box>
        <ActionLinkItem href={pageCreateUrl()}>
          <FormattedMessage id="vbop3G" defaultMessage="Create new model" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: "Models",
    name: "Go to models",
    component: (
      <Box>
        <ActionLinkItem href={pageListUrl()}>
          <FormattedMessage id="dQn96a" defaultMessage="Go to models" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: "Models",
    name: "Create new model type",
    component: (
      <Box>
        <ActionLinkItem href={pageTypeAddPath}>
          <FormattedMessage id="Ed2705" defaultMessage="Create new model type" />
        </ActionLinkItem>
      </Box>
    ),
  },
  {
    section: "Models",
    name: "Go to model types",
    component: (
      <Box>
        <ActionLinkItem href={pageTypeListUrl()}>
          <FormattedMessage id="5nrCxC" defaultMessage="Go to model types" />
        </ActionLinkItem>
      </Box>
    ),
  },
];

interface ActionsProps {
  query: string;
}

export const Actions = ({ query }: ActionsProps) => {
  const searchResults = fuzzySearch(allActions, query, ["name"]);
  const groupedBySection = Object.groupBy(searchResults, result => result.section);

  return (
    <Box>
      {Object.entries(groupedBySection).map(([section, actions]) => (
        <Box key={section} paddingY={1}>
          <Text fontWeight="medium" size={2} color="default2" paddingX={6}>
            {section}
          </Text>
          {actions.map(action => action.component)}
        </Box>
      ))}
    </Box>
  );
};
