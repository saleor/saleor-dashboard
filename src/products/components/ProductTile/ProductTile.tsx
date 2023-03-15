import { StatusDot } from "@dashboard/components/StatusDot/StatusDot";
import { ProductListQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { Box, ProductsIcons, sprinkles, Text } from "@saleor/macaw-ui/next";
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
  marginBottom: 8,
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
    backgroundColor={{ hover: "interactiveNeutralHighlightHovering" }}
    borderRadius={4}
    padding={5}
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
    <Text
      ellipsis
      color="textNeutralSubdued"
      variant="caption"
      size="small"
      className={sprinkles({ paddingY: 2 })}
    >
      {product.productType.name}
    </Text>
    <Box display="flex" justifyContent="space-between" marginTop={2}>
      <Text ellipsis color="textNeutralDefault" variant="bodyEmp" size="small">
        {product.name}
      </Text>
      <Box padding={5}>
        <StatusDot status={getTileStatus(product.channelListings)} />
      </Box>
    </Box>
  </Box>
);
