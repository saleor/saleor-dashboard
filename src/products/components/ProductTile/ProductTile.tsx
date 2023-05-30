import { StatusDot } from "@dashboard/components/StatusDot/StatusDot";
import { ProductListQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import {
  Box,
  ProductsIcons,
  sprinkles,
  Text,
  vars,
} from "@saleor/macaw-ui/next";
import React from "react";

import { getTileStatus } from "./utils";

export interface ProductTileProps {
  product: RelayToFlat<ProductListQuery["products"]>[0];
  onClick: () => void;
}

const commonThumbnailProps = {
  borderColor: "neutralHighlight",
  borderStyle: "solid",
  borderWidth: 1,
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
        objectFit="scale-down"
        src={product.thumbnail.url}
      />
    ) : (
      <Box
        {...commonThumbnailProps}
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor="surfaceNeutralSubdued"
      >
        <Box __width="40%" __height="40%">
          <ProductsIcons
            size="fill"
            color="iconNeutralDisabled"
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
        color="textNeutralSubdued"
        variant="caption"
        size="small"
        alignItems="center"
        className={sprinkles({ paddingY: 0.5 })}
      >
        {product.productType.name}
      </Text>
    </Box>
    <Box display="flex" justifyContent="space-between" marginTop={0.5}>
      <Text ellipsis color="textNeutralDefault" variant="bodyEmp" size="small">
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
        hover: "highlightDim",
      }}
    ></Box>
  </Box>
);
