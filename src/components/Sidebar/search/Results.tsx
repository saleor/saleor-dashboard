import { categoryUrl } from "@dashboard/categories/urls";
import { collectionUrl } from "@dashboard/collections/urls";
import Link from "@dashboard/components/Link";
import { orderUrl } from "@dashboard/orders/urls";
import { productUrl, productVariantEditUrl } from "@dashboard/products/urls";
import { Box, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

import { Thumbnail } from "./Thumbnail";
import { QuickSearchResult } from "./useQuickSearch";

interface ItemProps {
  href: string;
  children: React.ReactNode;
  thumb?: {
    url: string;
    alt: string;
  };
}

const Item = ({ href, thumb, children }: ItemProps) => {
  return (
    <Link href={href}>
      <Box
        backgroundColor={{
          hover: "accent1Hovered",
          active: "accent1Pressed",
        }}
        padding={1}
        borderRadius={3}
        display="flex"
        flexDirection="row"
      >
        {thumb && <Thumbnail src={thumb.url} alt={thumb.alt} />}
        <Box>{children}</Box>
      </Box>
    </Link>
  );
};

export const OrderItem = ({ item }: { item: QuickSearchResult["orders"][number] }) => {
  const intl = useIntl();

  const statusText = intl.formatMessage(
    {
      id: "lnmsby",
      defaultMessage: "Order No. {number}",
    },
    {
      number: item.number,
    },
  );

  return (
    <Item href={orderUrl(item.id)}>
      <Text size={2} fontWeight="regular" display="block">
        {statusText}
      </Text>
      <Text size={1} color="default2">
        {item.status}
      </Text>
      <Text paddingX={1} color="default2">
        •
      </Text>
      <Text size={1} color="default2">
        {item.total.amount} {item.total.currency}
      </Text>
    </Item>
  );
};

export const CategoryItem = ({ item }: { item: QuickSearchResult["categories"][number] }) => {
  const intl = useIntl();

  const totalProductsText = intl.formatMessage(
    {
      id: "kiy0gr",
      defaultMessage: "{count} products",
    },
    {
      count: item.totalProducts,
    },
  );

  return (
    <Item href={categoryUrl(item.id)} thumb={item.thumbnail}>
      <Text size={2} fontWeight="regular" display="block">
        {item.name}
      </Text>
      <Text size={1} color="default2">
        {totalProductsText}
      </Text>
    </Item>
  );
};

export const CollectionItem = ({ item }: { item: QuickSearchResult["collections"][number] }) => {
  const intl = useIntl();

  const totalProductsText = intl.formatMessage(
    {
      id: "kiy0gr",
      defaultMessage: "{count} products",
    },
    {
      count: item.totalProducts,
    },
  );

  return (
    <Item href={collectionUrl(item.id)} thumb={item.thumbnail}>
      <Text size={2} fontWeight="regular" display="block">
        {item.name}
      </Text>
      <Text size={1} color="default2">
        {totalProductsText}
      </Text>
    </Item>
  );
};

export const ProductItem = ({ item }: { item: QuickSearchResult["products"][number] }) => {
  return (
    <Item href={productUrl(item.id)} thumb={item.thumbnail}>
      <Text size={2} fontWeight="regular" display="block">
        {item.name}
      </Text>
      <Text size={1} color="default2">
        {item.category.name}
      </Text>
    </Item>
  );
};

export const ProductVariantItem = ({
  item,
}: {
  item: QuickSearchResult["productVariants"][number];
}) => {
  return (
    <Item href={productVariantEditUrl(item.product.id, item.id)} thumb={item.thumbnail}>
      <Text size={2} fontWeight="regular" display="block">
        {item.sku} • {item.name}
      </Text>
      <Text size={1} color="default2">
        {item.product.category.name}
      </Text>
    </Item>
  );
};

export const NoResults = () => {
  const intl = useIntl();

  const noResultsText = intl.formatMessage({
    id: "V5JQj+",
    defaultMessage: "No results found.",
  });

  return (
    <Box height="100%" display="flex" alignItems="center" justifyContent="center">
      <Text size={3} fontWeight="medium" textAlign="center" color="default2" display="block">
        {noResultsText}
      </Text>
    </Box>
  );
};

export const Loading = () => (
  <Box>
    <Skeleton height={3} width={20} marginBottom={3} />
    <Skeleton height={10} marginBottom={2} />
    <Skeleton height={10} marginBottom={2} />
    <Skeleton height={3} width={20} marginBottom={3} />
    <Skeleton height={10} marginBottom={2} />
    <Skeleton height={10} marginBottom={2} />
    <Skeleton height={3} width={20} marginBottom={3} />
    <Skeleton height={10} marginBottom={2} />
    <Skeleton height={10} marginBottom={2} />
  </Box>
);
