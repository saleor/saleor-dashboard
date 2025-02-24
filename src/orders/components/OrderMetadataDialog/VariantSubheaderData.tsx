import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

const ListValue = ({ children, last }: { children: React.ReactNode; last?: boolean }) => {
  return (
    <>
      <span
        style={{
          userSelect: "all",
        }}
      >
        {children}
      </span>
      {!last && <span aria-hidden="true">,</span>}
    </>
  );
};

const ListItem = ({
  name,
  value,
  last,
}: {
  name: string;
  value: string | number;
  last?: boolean;
}) => {
  return (
    <Box as="dl" marginY={0} display="flex">
      <Box as="dt">
        {name}
        <span aria-hidden="true">:</span>
      </Box>
      <Box as="dd" marginLeft={1}>
        <ListValue last={last}>{value}</ListValue>
      </Box>
    </Box>
  );
};

export const VariantSubheaderData = ({
  productSku,
  quantity,
  variantName,
}: {
  productSku: string;
  quantity: number;
  variantName: string;
}) => {
  return (
    <Text as="span" display="flex" gap={1}>
      <ListItem name="SKU" value={productSku} />
      <ListItem name="Variant" value={variantName} />
      <ListItem name="Qty" value={quantity} last />
    </Text>
  );
};
