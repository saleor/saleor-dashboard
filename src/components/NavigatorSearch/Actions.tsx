import { fuzzySearch } from "@dashboard/misc";
import { ArrowRightIcon, Box, PlusIcon, Text } from "@saleor/macaw-ui-next";
import React from "react";
import Link from "@dashboard/components/Link";
import { FormattedMessage } from "react-intl";

const ActionLinkItem = ({ href, icon, children }: { href: string, icon: React.ReactNode, children: React.ReactNode }) => {
  return (
    <Link href={href}>
      <Box
        display="flex"
        alignItems="center"
        color="default1"
        gap={2}
        paddingY={2}
        backgroundColor={{
          default: "default1",
          hover: "default1Hovered",
        }}
        paddingX={4}
      >
        <Box
          __width="16px"
          __height="16px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="default1"
        >
          {icon}
        </Box>
        <Text size={3} fontWeight="regular">{children}</Text>
      </Box>
    </Link>
  );
};

const orderActions = [
  {
    name: "Create new order",
    component: <Box>
      <ActionLinkItem href="/" icon={<PlusIcon />}>
        <FormattedMessage id="Create new order" defaultMessage="Create new order" />
      </ActionLinkItem>
    </Box>
  },
  {
    name: "Go to orders",
    component: <Box>
      <ActionLinkItem href="/" icon={<ArrowRightIcon />}>
        <FormattedMessage id="Go to orders" defaultMessage="Go to orders" />
      </ActionLinkItem>
    </Box>
  },
]

const productActions = [
  {
    name: "Create new product",
    component: <Box>
      <ActionLinkItem href="/" icon={<PlusIcon />}>
        <FormattedMessage id="Create new product" defaultMessage="Create new product" />
      </ActionLinkItem>
    </Box>
  },
  {
    name: "Go to products",
    component: <Box>
      <ActionLinkItem href="/" icon={<ArrowRightIcon />}>
        <FormattedMessage id="Go to products" defaultMessage="Go to products" />
      </ActionLinkItem>
    </Box>
  },
]

const categoryActions = [
  {
    name: "Create new category",
    component: <Box>
      <ActionLinkItem href="/" icon={<PlusIcon />}>
        <FormattedMessage id="Create new category" defaultMessage="Create new category" />
      </ActionLinkItem>
    </Box>
  },
  {
    name: "Go to categories",
    component: <Box>
      <ActionLinkItem href="/" icon={<ArrowRightIcon />}>
        <FormattedMessage id="Go to categories" defaultMessage="Go to categories" />
      </ActionLinkItem>
    </Box>
  },
]

const collectionActions = [
  {
    name: "Create new collection",
    component: <Box>
      <ActionLinkItem href="/" icon={<PlusIcon />}>
        <FormattedMessage id="Create new collection" defaultMessage="Create new collection" />
      </ActionLinkItem>
    </Box>
  },
  {
    name: "Go to collections",
    component: <Box>
      <ActionLinkItem href="/" icon={<ArrowRightIcon />}>
        <FormattedMessage id="Go to collections" defaultMessage="Go to collections" />
      </ActionLinkItem>
    </Box>
  },
]

const modelActions = [
  {
    name: "Create new model",
    component: <Box>
      <ActionLinkItem href="/" icon={<PlusIcon />}>
        <FormattedMessage id="Create new model" defaultMessage="Create new model" />
      </ActionLinkItem>
    </Box>
  },
  {
    name: "Go to models",
    component: <Box>
      <ActionLinkItem href="/" icon={<ArrowRightIcon />}>
        <FormattedMessage id="Go to models" defaultMessage="Go to models" />
      </ActionLinkItem>
    </Box>
  },
]

const modelTypeActions = [
  {
    name: "Create new model type",
    component: <Box>
      <ActionLinkItem href="/" icon={<PlusIcon />}>
        <FormattedMessage id="Create new model type" defaultMessage="Create new model type" />
      </ActionLinkItem>
    </Box>
  },
  {
    name: "Go to model types",
    component: <Box>
      <ActionLinkItem href="/" icon={<ArrowRightIcon />}>
        <FormattedMessage id="Go to model types" defaultMessage="Go to model types" />
      </ActionLinkItem>
    </Box>
  },
]

const allActions = [
  {
    section: "Orders",
    actions: orderActions
  },
  {
    section: "Products",
    actions: productActions
  },
  {
    section: "Categories",
    actions: categoryActions
  },
  {
    section: "Collections",
    actions: collectionActions
  },
  {
    section: "Models",
    actions: modelActions
  },
  {
    section: "Model types",
    actions: modelTypeActions
  },
]

interface ActionsProps {
  query: string;
}

export const Actions = ({ query }: ActionsProps) => {
  const searchResults = fuzzySearch(allActions, query, ["section", "actions.name"]);

  console.log(searchResults);

  return (
    <Box>
      {searchResults.map((result) => (
        <Box key={result.section} paddingY={1.5}>
          <Text
            fontWeight="medium"
            size={2}
            color="default2"
            paddingX={4}
          >
            {result.section}
          </Text>
          {result.actions.map((action) => action.component)}
        </Box>
      ))}
    </Box>
  );
};