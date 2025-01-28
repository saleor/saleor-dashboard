import { ChannelsAvailabilityDropdown } from "@dashboard/components/ChannelsAvailabilityDropdown";
import { GridTable } from "@dashboard/components/GridTable";
import Drag from "@dashboard/icons/Drag";
import { productUrl } from "@dashboard/products/urls";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Button, Checkbox, Skeleton, Text, TrashBinIcon } from "@saleor/macaw-ui-next";
import React from "react";

import { Product } from "./types";

interface ItemProps {
  product: Product;
  isSelected: boolean;
  draggable: boolean;
  toggle: (id: string) => void;
  onProductUnassign: (id: string, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ProductTableItem = ({
  product,
  isSelected,
  draggable,
  toggle,
  onProductUnassign,
}: ItemProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isSorting } = useSortable({
    id: product.id,
    disabled: !draggable,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const href = product ? productUrl(product.id) : "";
  const isSaving = product.id.includes("moved_");

  return (
    <GridTable.Row
      __height="1px"
      data-test-id="assign-product-table-row"
      backgroundColor={{
        hover: "default1Hovered",
        default: "default1",
      }}
      __opacity={isSaving ? 0.5 : 1}
      key={product.id}
      selected={isSelected}
      ref={setNodeRef}
      style={style}
    >
      <GridTable.Cell __height="inherit" padding={0}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          color="default2"
          __cursor={isSorting ? "grabbing" : "grab"}
          {...attributes}
          {...listeners}
        >
          <Drag />
        </Box>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0}>
        <Box display="flex" alignItems="center" height="100%">
          <Checkbox checked={isSelected} onCheckedChange={() => product && toggle(product.id)} />
        </Box>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0}>
        <Box
          as="a"
          href={href}
          padding={2}
          display="flex"
          alignItems="center"
          gap={2}
          height="100%"
        >
          <Box borderColor="default1" borderWidth={1} borderStyle="solid">
            <Box
              as="img"
              src={product?.thumbnail?.url}
              alt={product?.name}
              __width="31px"
              __height="31px"
            />
          </Box>
          <Text>{product?.name}</Text>
        </Box>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0}>
        <Box as="a" href={href} padding={2} display="flex" alignItems="center" height="100%">
          <Text>{product?.productType.name || <Skeleton />}</Text>
        </Box>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0}>
        <Box as="a" display="block" height="100%" padding={2}>
          {product && !product?.channelListings?.length ? (
            "-"
          ) : product?.channelListings !== undefined ? (
            <ChannelsAvailabilityDropdown channels={product?.channelListings} />
          ) : (
            <Skeleton />
          )}
        </Box>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          paddingRight={6}
          height="100%"
        >
          <Button
            data-test-id="delete-icon"
            variant="secondary"
            onClick={event => product && onProductUnassign(product.id, event)}
            icon={<TrashBinIcon />}
          />
        </Box>
      </GridTable.Cell>
    </GridTable.Row>
  );
};
