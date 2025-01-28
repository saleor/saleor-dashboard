import { GridTable } from "@dashboard/components/GridTable";
import { PaginationState } from "@dashboard/hooks/useLocalPaginator";
import { renderCollection } from "@dashboard/misc";
import { Node } from "@dashboard/types";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box, Button, Checkbox, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { Pagination } from "./Pagination";
import { ProductTableItem } from "./ProductTableItem";
import { Product } from "./types";
import { useProductDrag } from "./useProductDrag";

interface ProductsTableProps {
  products: Product[];
  isChecked: (id: string) => boolean | undefined;
  toggle: (id: string) => void;
  toggleAll: (items: Node[], selected: number) => void;
  disabled: boolean;
  onProductUnassign: (id: string, event: React.MouseEvent<HTMLButtonElement>) => void;
  numberOfColumns: number;
  selected: number;
  onUnassignClick: () => void;
  paginationState: PaginationState;
  updateListSettings: (key: "rowNumber", value: number) => void;
  numberOfRows: number;
}

const areAllChecked = (products: Product[], selected: number) => {
  if (products && products.length > selected && selected > 0) {
    return "indeterminate";
  }

  return selected !== 0;
};

export const ProductsTable = ({
  products,
  isChecked,
  toggle,
  toggleAll,
  disabled,
  onProductUnassign,
  selected,
  onUnassignClick,
  paginationState,
  updateListSettings,
  numberOfRows,
}: ProductsTableProps) => {
  const allChecked = areAllChecked(products, selected);
  const { items, sensors, isSaving, handleDragEnd } = useProductDrag({ products, paginationState });

  if (items.length === 0) {
    return (
      <Text
        textAlign="center"
        width="100%"
        display="block"
        paddingY={2}
        size={2}
        color="default2"
        marginBottom={4}
      >
        <FormattedMessage id="Q1Uzbb" defaultMessage="No products found" />
      </Text>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <GridTable borderWidth={0}>
        <GridTable.Colgroup>
          <GridTable.Col __width="40px" />
          <GridTable.Col __width="20px" />
          <GridTable.Col />
          <GridTable.Col />
          <GridTable.Col />
          <GridTable.Col __width="100px" />
        </GridTable.Colgroup>
        <GridTable.Body>
          <GridTable.Row>
            <GridTable.Cell padding={0} borderWidth={0}></GridTable.Cell>
            <GridTable.Cell padding={0} borderWidth={0}>
              <Box display="flex" alignItems="center">
                <Checkbox
                  data-test-id="select-all-checkbox"
                  checked={allChecked}
                  disabled={disabled}
                  onCheckedChange={() => toggleAll(products, selected)}
                />
              </Box>
            </GridTable.Cell>
            <GridTable.Cell borderWidth={0}>
              {selected ? (
                <Text data-test-id="SelectedText">
                  <FormattedMessage
                    id="qu/hXD"
                    defaultMessage="Selected {number} items"
                    values={{
                      number: selected,
                    }}
                  />
                </Text>
              ) : (
                <Text>
                  <FormattedMessage id="6AMFki" defaultMessage="Name" description="product name" />
                </Text>
              )}
            </GridTable.Cell>
            <GridTable.Cell borderWidth={0}>
              {!selected && (
                <Text>
                  <FormattedMessage id="k+HcTv" defaultMessage="Type" description="product type" />
                </Text>
              )}
            </GridTable.Cell>
            <GridTable.Cell borderWidth={0} colSpan={2} padding={0}>
              {!selected && (
                <Text>
                  <FormattedMessage
                    id="Oe62bR"
                    defaultMessage="Availability"
                    description="product availability"
                  />
                </Text>
              )}
              <Box
                paddingRight={6}
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                gap={2}
              >
                {!!selected && (
                  <Button variant="secondary" size="small" onClick={onUnassignClick}>
                    <FormattedMessage
                      id="67V0c0"
                      defaultMessage="Unassign"
                      description="unassign product from collection, button"
                    />
                  </Button>
                )}
              </Box>
            </GridTable.Cell>
          </GridTable.Row>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {renderCollection(items, product => {
              const isSelected = product ? isChecked(product.id) : false;

              if (!product) {
                return null;
              }

              return (
                <ProductTableItem
                  key={product.id}
                  product={product}
                  isSelected={isSelected || false}
                  draggable={!isSaving}
                  toggle={toggle}
                  onProductUnassign={onProductUnassign}
                />
              );
            })}
          </SortableContext>
        </GridTable.Body>
      </GridTable>
      <Pagination numberOfRows={numberOfRows} onUpdateListSettings={updateListSettings} />
    </DndContext>
  );
};
