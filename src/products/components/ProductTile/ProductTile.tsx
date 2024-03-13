// @ts-strict-ignore
import { StatusDot } from "@dashboard/components/StatusDot/StatusDot";
import { ProductListQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import {
  Box,
  ProductsIcons,
  sprinkles,
  Text,
  vars,
} from "@saleor/macaw-ui-next";
import React from "react";

import { getTileStatus } from "./utils";

export interface ProductTileProps {
  product: RelayToFlat<ProductListQuery["products"]>[0];
  onClick: () => void;
}

const commonThumbnailProps = {
  marginBottom: 1.5,
  borderRadius: 3,
  aspectRatio: "1 / 1",
} as const;

export const ProductTile: React.FC<ProductTileProps> = ({
  product,
  onClick,
}) => (
  <Box
    display="flex"
    flexDirection="column"
    onClick={onClick}
    cursor="pointer"
    borderRadius={3}
    position="relative"
    data-test-id={`product-tile-${product.id}`}
  >
    {product.thumbnail ? (
      <Box
        {...commonThumbnailProps}
        as="img"
        alt={product.name}
        objectFit="cover"
        src={product.thumbnail.url}
      />
    ) : (
      <Box
        {...commonThumbnailProps}
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor="default2"
      >
        <Box __width="40%" __height="40%">
          <ProductsIcons
            size="fill"
            color="defaultDisabled"
            data-test-id={`placeholder-svg-${product.id}`}
          />
        </Box>
      </Box>
    )}
    <Box display="flex" alignItems="center">
      <Box paddingRight={1}>
        <StatusDot status={getTileStatus(product.channelListings)} />
      </Box>
      <Text
        ellipsis
        color="default2"
        variant="caption"
        size="small"
        alignItems="center"
        className={sprinkles({ paddingY: 0.5 })}
      >
        {product.productType.name}
      </Text>
    </Box>
    <Box display="flex" justifyContent="space-between" marginTop={0.5}>
      <Text ellipsis color="default1" typeSize={3} fontWeight="medium">
        {product.name}
      </Text>
    </Box>
    <Box
      position={"absolute"}
      margin="auto"
      __right={`calc(${vars.spacing[5]} / -2)`}
      __top={`calc(${vars.spacing[5]} / -2)`}
      __width={`calc(100% + ${vars.spacing[5]})`}
      __height={`calc(100% + ${vars.spacing[5]})`}
      __opacity={0.1}
      borderRadius={5}
      backgroundColor={{
        hover: "default1Hovered",
      }}
    ></Box>
  </Box>
);
