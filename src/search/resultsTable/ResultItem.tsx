import { EmptyImage } from "@dashboard/components/EmptyImage";
import { GridTable } from "@dashboard/components/GridTable";
import Link from "@dashboard/components/Link";
import { getStatusColor, PillStatusType, transformOrderStatus } from "@dashboard/misc";
import { Box, Text, useTheme } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedDate, FormattedMessage, useIntl } from "react-intl";

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
  return (
    <Box padding={2} display="flex" alignItems="center" gap={2} height="100%">
      {url ? (
        <Box borderColor="default1" borderWidth={1} borderRadius={2} borderStyle="solid">
          <Box as="img" src={url} alt={name} __width="31px" __height="31px" />
        </Box>
      ) : (
        <EmptyImage />
      )}
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

const TypeCell = ({ children }: { children: React.ReactNode }) => {
  return (
    <GridTable.Cell __height="inherit" padding={0}>
      <LinkCell href="/">
        <Text paddingLeft={6} size={2} fontWeight="medium" color="default2">
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
    const { localized, status } = transformOrderStatus(node.status, intl);
    const color = getStatusColor({
      status: status as unknown as PillStatusType,
      currentTheme: theme,
    });

    return (
      <Row>
        <TypeCell>
          <FormattedMessage id="XPruqs" defaultMessage="Order" />
        </TypeCell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href="/">
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                display="flex"
                alignItems="start"
                justifyContent="center"
                flexDirection="column"
                gap={1}
                __width="140px"
              >
                <Text size={1} fontWeight="medium">
                  No. {node?.number}
                </Text>
                <Box
                  __backgroundColor={color.base}
                  __color={color.text}
                  __borderColor={color.border}
                  paddingX={1.5}
                  paddingY={0.5}
                  borderRadius={3}
                  fontSize={1}
                >
                  {localized}
                </Box>
              </Box>
              <Text size={2} fontWeight="medium">
                {node?.total?.gross?.amount} {node?.total?.gross?.currency}
              </Text>
            </Box>
          </LinkCell>
        </GridTable.Cell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href="/">
            <DisplayDate date={node?.updatedAt} />
          </LinkCell>
        </GridTable.Cell>
      </Row>
    );
  }

  if (node.__typename === "Category") {
    return (
      <Row>
        <TypeCell>
          <FormattedMessage id="ccXLVi" defaultMessage="Category" />
        </TypeCell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href="/">
            <Box display="flex" alignItems="center" gap={1}>
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
                <Text size={2} fontWeight="medium" color="default2">
                  No. of products: {node?.products?.totalCount}
                </Text>
              </Box>
            </Box>
          </LinkCell>
        </GridTable.Cell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href="/">
            <DisplayDate date={node?.updatedAt} />
          </LinkCell>
        </GridTable.Cell>
      </Row>
    );
  }

  if (node.__typename === "Collection") {
    return (
      <Row>
        <TypeCell>
          <FormattedMessage id="phAZoj" defaultMessage="Collection" />
        </TypeCell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href="/">
            <Box display="flex" alignItems="center" gap={1}>
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
                <Text size={2} fontWeight="medium" color="default2">
                  No. of products: {node?.products?.totalCount}
                </Text>
              </Box>
            </Box>
          </LinkCell>
        </GridTable.Cell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href="/">-</LinkCell>
        </GridTable.Cell>
      </Row>
    );
  }

  if (node.__typename === "Product") {
    return (
      <Row>
        <TypeCell>
          <FormattedMessage id="x/ZVlU" defaultMessage="Product" />
        </TypeCell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href="/">
            <Box display="flex" alignItems="center" gap={1}>
              <Thumbnail url={node?.thumbnail?.url} name={node?.name} />
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
                <Text size={2} fontWeight="medium" color="default2">
                  {node?.category?.name}
                </Text>
              </Box>
            </Box>
          </LinkCell>
        </GridTable.Cell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href="/">
            <DisplayDate date={node?.updatedAt} />
          </LinkCell>
        </GridTable.Cell>
      </Row>
    );
  }

  if (node.__typename === "ProductVariant") {
    return (
      <Row>
        <TypeCell>
          <FormattedMessage id="OK5+Fh" defaultMessage="Variant" />
        </TypeCell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href="/">
            <Box display="flex" alignItems="center" gap={1} width="100%">
              <Thumbnail url={node?.media?.[0]?.url} name={node?.name} />
              <Box
                display="flex"
                alignItems="start"
                justifyContent="center"
                flexDirection="column"
                gap={1}
              >
                <Text size={2} fontWeight="medium">
                  {node?.product?.name} • {node?.name}
                </Text>
                <Text size={2} fontWeight="medium" color="default2">
                  {node?.product?.category?.name}
                </Text>
              </Box>
            </Box>
          </LinkCell>
        </GridTable.Cell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href="/">
            <DisplayDate date={node?.updatedAt} />
          </LinkCell>
        </GridTable.Cell>
      </Row>
    );
  }

  if (node.__typename === "Page") {
    return (
      <Row>
        <TypeCell>
          <FormattedMessage id="rhSI1/" defaultMessage="Model" />
        </TypeCell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href="/">
            <Box display="flex" alignItems="center" gap={1} width="100%">
              <Box
                display="flex"
                alignItems="start"
                justifyContent="center"
                flexDirection="column"
                gap={1}
              >
                <Text size={2} fontWeight="medium">
                  {node?.title}
                </Text>
                <Text size={2} fontWeight="medium" color="default2">
                  {node?.pageType?.name}
                </Text>
              </Box>
            </Box>
          </LinkCell>
        </GridTable.Cell>
        <GridTable.Cell __height="inherit" padding={0}>
          <LinkCell href="/">
            <DisplayDate date={node?.publishedAt} />
          </LinkCell>
        </GridTable.Cell>
      </Row>
    );
  }

  if (node.__typename === "PageType") {
    return (
      <Row>
        <TypeCell>
          <FormattedMessage id="OpYmID" defaultMessage="Model Type" />
        </TypeCell>
        <GridTable.Cell padding={0}>
          <LinkCell href="/">
            <Box display="flex" alignItems="center" gap={1} width="100%">
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
          <LinkCell href="/">-</LinkCell>
        </GridTable.Cell>
      </Row>
    );
  }

  return null;
};
