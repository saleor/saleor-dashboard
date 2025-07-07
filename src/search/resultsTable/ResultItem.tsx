import { categoryUrl } from "@dashboard/categories/urls";
import { collectionUrl } from "@dashboard/collections/urls";
import { EmptyImage } from "@dashboard/components/EmptyImage";
import { GridTable } from "@dashboard/components/GridTable";
import Link from "@dashboard/components/Link";
import { pageUrl } from "@dashboard/modeling/urls";
import { pageTypeUrl } from "@dashboard/modelTypes/urls";
import { orderUrl } from "@dashboard/orders/urls";
import { productUrl, productVariantEditPath } from "@dashboard/products/urls";
import { Box, Skeleton, Text, useTheme } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";

import { getCategoryHierarchyLabel, getPaymentLabel } from "./labels";
import { ItemData } from "./prepareResults";

const Row = ({ children }: { children: React.ReactNode }) => {
  return (
    <GridTable.Row
      __height="50px"
      backgroundColor={{
        hover: "default1Hovered",
        default: "default1",
      }}
    >
      {children}
    </GridTable.Row>
  );
};

const Thumbnail = ({ url, name }: { url: string; name: string }) => {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Box display="flex" alignItems="center" gap={2} height="100%">
      <Box borderColor="default1" borderWidth={1} borderRadius={2} borderStyle="solid">
        {!imageError ? (
          <>
            <Box
              as="img"
              src={url}
              alt={name}
              __width="31px"
              __height="31px"
              display={imageLoaded ? "block" : "none"}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
            {!imageLoaded && <Skeleton __width="31px" __height="31px" borderRadius={2} />}
          </>
        ) : (
          <EmptyImage />
        )}
      </Box>
    </Box>
  );
};

const DisplayDate = ({ date }: { date: string }) => {
  return (
    <Text size={2} fontWeight="medium" color="default2" paddingRight={6}>
      <FormattedDate value={date} year="numeric" month="long" day="2-digit" />
    </Text>
  );
};

const LinkCell = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link href={href} style={{ display: "flex", alignItems: "center", height: "100%" }}>
      {children}
    </Link>
  );
};

const TypeCell = ({ children, href }: { children: React.ReactNode; href: string }) => {
  return (
    <GridTable.Cell __height="inherit" padding={0}>
      <LinkCell href={href}>
        <Text paddingLeft={6} paddingRight={3} size={2} fontWeight="medium" color="default2">
          {children}
        </Text>
      </LinkCell>
    </GridTable.Cell>
  );
};

export const ResultItem = ({ result }: { result: ItemData }) => {
  const intl = useIntl();
  const { theme } = useTheme();
  const { node } = result;

  if (node.__typename === "Order") {
    const { color, localized } = getPaymentLabel(
      intl,
      theme,
      node.chargeStatus,
      node.paymentStatus,
    );

    return (
      <Row>
        <TypeCell href={orderUrl(node.id)}>
          <FormattedMessage id="XPruqs" defaultMessage="Order" />
        </TypeCell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href={orderUrl(node.id)}>
            <Box display="flex" alignItems="center" justifyContent="center" gap={5}>
              <Box>
                <Box
                  __backgroundColor={color.base}
                  __color={color.text}
                  __borderColor={color.border}
                  paddingX={1.5}
                  paddingY={0.5}
                  borderRadius={3}
                  fontSize={1}
                  display="inline-block"
                >
                  {localized}
                </Box>
              </Box>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Text fontSize={2} fontWeight="medium" color="default2">
                  #
                </Text>
                <Text size={2} fontWeight="medium" color="default1">
                  {node?.number}
                </Text>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <Text size={2} fontWeight="medium" color="default2">
                  {node?.total?.gross?.currency}
                </Text>
                <Text size={2} fontWeight="medium">
                  {node?.total?.gross?.amount}
                </Text>
              </Box>
            </Box>
          </LinkCell>
        </GridTable.Cell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href={orderUrl(node.id)}>
            <DisplayDate date={node?.updatedAt} />
          </LinkCell>
        </GridTable.Cell>
      </Row>
    );
  }

  if (node.__typename === "Category") {
    const ancestorsLabel = getCategoryHierarchyLabel(node);

    return (
      <Row>
        <TypeCell href={categoryUrl(node.id)}>
          <FormattedMessage id="ccXLVi" defaultMessage="Category" />
        </TypeCell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href={categoryUrl(node.id)}>
            <Box display="flex" alignItems="center" gap={5}>
              <Thumbnail url={node?.backgroundImage?.url} name={node?.name} />
              <Text size={2} fontWeight="medium">
                {node?.name}
              </Text>
              <Text size={2} fontWeight="medium" color="default2">
                {ancestorsLabel}
              </Text>
            </Box>
          </LinkCell>
        </GridTable.Cell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href={categoryUrl(node.id)}>
            <DisplayDate date={node?.updatedAt} />
          </LinkCell>
        </GridTable.Cell>
      </Row>
    );
  }

  if (node.__typename === "Collection") {
    return (
      <Row>
        <TypeCell href={collectionUrl(node.id)}>
          <FormattedMessage id="phAZoj" defaultMessage="Collection" />
        </TypeCell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href={collectionUrl(node.id)}>
            <Box display="flex" alignItems="center" gap={5}>
              <Thumbnail url={node?.backgroundImage?.url} name={node?.name} />
              <Box
                display="flex"
                alignItems="start"
                justifyContent="center"
                flexDirection="column"
                gap={1}
              >
                <Text size={2} fontWeight="medium">
                  {node?.name}
                </Text>
              </Box>
            </Box>
          </LinkCell>
        </GridTable.Cell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href={collectionUrl(node.id)}>-</LinkCell>
        </GridTable.Cell>
      </Row>
    );
  }

  if (node.__typename === "Product") {
    return (
      <Row>
        <TypeCell href={productUrl(node.id)}>
          <FormattedMessage id="x/ZVlU" defaultMessage="Product" />
        </TypeCell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href={productUrl(node.id)}>
            <Box display="flex" alignItems="center" gap={5}>
              <Thumbnail url={node?.thumbnail?.url} name={node?.name} />
              <Text size={2} fontWeight="medium">
                {node?.name}
              </Text>
              <Text size={2} fontWeight="medium" color="default2">
                {node?.category?.name}
              </Text>
            </Box>
          </LinkCell>
        </GridTable.Cell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href={productUrl(node.id)}>
            <DisplayDate date={node?.updatedAt} />
          </LinkCell>
        </GridTable.Cell>
      </Row>
    );
  }

  if (node.__typename === "ProductVariant") {
    return (
      <Row>
        <TypeCell href={productVariantEditPath(node.product.id, node.id)}>
          <FormattedMessage id="OK5+Fh" defaultMessage="Variant" />
        </TypeCell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href={productVariantEditPath(node.product.id, node.id)}>
            <Box display="flex" alignItems="center" gap={5} width="100%">
              <Thumbnail url={node?.media?.[0]?.url} name={node?.name} />
              <Text size={2} fontWeight="medium">
                {node?.product?.name} • {node?.name}
              </Text>
              <Text size={2} fontWeight="medium" color="default2">
                {node?.product?.category?.name}
              </Text>
            </Box>
          </LinkCell>
        </GridTable.Cell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href={productVariantEditPath(node.product.id, node.id)}>
            <DisplayDate date={node?.updatedAt} />
          </LinkCell>
        </GridTable.Cell>
      </Row>
    );
  }

  if (node.__typename === "Page") {
    return (
      <Row>
        <TypeCell href={pageUrl(node.id)}>
          <FormattedMessage id="rhSI1/" defaultMessage="Model" />
        </TypeCell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href={pageUrl(node.id)}>
            <Box display="flex" alignItems="center" gap={5} width="100%">
              <Text size={2} fontWeight="medium">
                {node?.title}
              </Text>
              <Text size={2} fontWeight="medium" color="default2">
                {node?.pageType?.name}
              </Text>
            </Box>
          </LinkCell>
        </GridTable.Cell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href={pageUrl(node.id)}>
            <DisplayDate date={node?.publishedAt} />
          </LinkCell>
        </GridTable.Cell>
      </Row>
    );
  }

  if (node.__typename === "PageType") {
    return (
      <Row>
        <TypeCell href={pageTypeUrl(node.id)}>
          <FormattedMessage id="9FCrIN" defaultMessage="Model type" />
        </TypeCell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href={pageTypeUrl(node.id)}>
            <Box display="flex" alignItems="center" gap={2} width="100%">
              <Box
                display="flex"
                alignItems="start"
                justifyContent="center"
                flexDirection="column"
                gap={1}
              >
                <Text size={2} fontWeight="medium">
                  {node?.name}
                </Text>
              </Box>
            </Box>
          </LinkCell>
        </GridTable.Cell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href={pageTypeUrl(node.id)}>-</LinkCell>
        </GridTable.Cell>
      </Row>
    );
  }

  return null;
};
