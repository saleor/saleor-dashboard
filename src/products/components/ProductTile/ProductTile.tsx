import thumbnailPlaceholder from "@assets/images/placeholder255x255.png";
import { ProductListQuery } from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";

export interface ProductTileProps {
  product: RelayToFlat<ProductListQuery["products"]>[0];
  onClick: () => void;
}

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
  >
    <Box
      as="img"
      borderColor="neutralHighlight"
      borderStyle="solid"
      borderWidth={1}
      marginBottom={8}
      borderRadius={3}
      src={product.thumbnail ? product.thumbnail.url : thumbnailPlaceholder}
    />
    <Text color="textNeutralSubdued" variant="caption" size="small">
      {product.productType.name}
    </Text>
    <Box display="flex" justifyContent="space-between">
      <Text color="textNeutralDefault" variant="bodyEmp" size="small">
        {product.name}
      </Text>
    </Box>
  </Box>
);
