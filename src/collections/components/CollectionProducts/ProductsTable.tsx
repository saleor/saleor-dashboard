import { GridTable } from "@dashboard/components/GridTable";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Placeholder } from "@dashboard/components/Placeholder";
import { type PaginationState } from "@dashboard/hooks/useLocalPaginator";
import { renderCollection } from "@dashboard/misc";
import { type Node } from "@dashboard/types";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Box, Button, Checkbox, Text } from "@saleor/macaw-ui-next";
import { Tag } from "lucide-react";
import { type MouseEvent, type ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import styles from "./ProductsTable.module.css";
import { ProductTableItem } from "./ProductTableItem";
import {
  COLLECTION_PRODUCT_TABLE_ACTION_INSET,
  COLLECTION_PRODUCT_TABLE_ACTIONS_COLUMN_WIDTH,
  COLLECTION_PRODUCT_TABLE_AVAILABILITY_COLUMN_WIDTH,
  COLLECTION_PRODUCT_TABLE_CHECKBOX_COLUMN_WIDTH,
  COLLECTION_PRODUCT_TABLE_DRAG_COLUMN_WIDTH,
  COLLECTION_PRODUCT_TABLE_NAME_COLUMN_WIDTH,
  COLLECTION_PRODUCT_TABLE_TYPE_COLUMN_WIDTH,
} from "./productTableLayout";
import { type Product } from "./types";
import { useProductDrag } from "./useProductDrag";

interface ProductsTableProps {
  products: Product[];
  isChecked: (id: string) => boolean | undefined;
  toggle: (id: string) => void;
  toggleAll: (items: Node[], selected: number) => void;
  disabled: boolean;
  onProductUnassign: (id: string, event: MouseEvent<HTMLButtonElement>) => void;
  numberOfColumns: number;
  selected: number;
  onUnassignClick: () => void;
  paginationState: PaginationState;
  updateListSettings: (key: "rowNumber", value: number) => void;
  numberOfRows: number;
  /** Collection membership supports drag reorder; category membership keeps the column empty. */
  reorderable?: boolean;
}

interface ProductsTableBodyProps
  extends Omit<
    ProductsTableProps,
    "numberOfColumns" | "updateListSettings" | "numberOfRows" | "paginationState" | "reorderable"
  > {
  items: Product[];
  reorderable: boolean;
  draggable: boolean;
  wrapRows: (rows: ReactNode) => ReactNode;
}

const areAllChecked = (products: Product[], selected: number) => {
  if (products && products.length > selected && selected > 0) {
    return "indeterminate";
  }

  return selected !== 0;
};

const ProductsTableEmpty = (): JSX.Element => (
  <Box padding={4} data-test-id="products-empty-state">
    <Placeholder
      icon={
        <Box color="default2" display="flex" aria-hidden>
          <Tag size={iconSize.large} strokeWidth={iconStrokeWidthBySize.large} />
        </Box>
      }
    >
      <FormattedMessage id="Q1Uzbb" defaultMessage="No products found" />
    </Placeholder>
  </Box>
);

const ProductsTableBody = ({
  products,
  items,
  isChecked,
  toggle,
  toggleAll,
  disabled,
  onProductUnassign,
  selected,
  onUnassignClick,
  reorderable,
  draggable,
  wrapRows,
}: ProductsTableBodyProps): JSX.Element => {
  const allChecked = areAllChecked(products, selected);

  return (
    <Box overflowX="auto" width="100%">
      <GridTable borderWidth={0} className={styles.table}>
        <GridTable.Colgroup>
          <GridTable.Col __width={COLLECTION_PRODUCT_TABLE_DRAG_COLUMN_WIDTH} />
          <GridTable.Col __width={COLLECTION_PRODUCT_TABLE_CHECKBOX_COLUMN_WIDTH} />
          <GridTable.Col __width={COLLECTION_PRODUCT_TABLE_NAME_COLUMN_WIDTH} />
          <GridTable.Col __width={COLLECTION_PRODUCT_TABLE_TYPE_COLUMN_WIDTH} />
          <GridTable.Col __width={COLLECTION_PRODUCT_TABLE_AVAILABILITY_COLUMN_WIDTH} />
          <GridTable.Col __width={COLLECTION_PRODUCT_TABLE_ACTIONS_COLUMN_WIDTH} />
        </GridTable.Colgroup>
        <GridTable.Body>
          <GridTable.Row className={styles.headerRow}>
            <GridTable.Cell padding={0} borderWidth={0} />
            <GridTable.Cell padding={0} borderWidth={0}>
              <Box display="flex" alignItems="center" height="100%">
                <Checkbox
                  data-test-id="select-all-checkbox"
                  checked={allChecked}
                  disabled={disabled}
                  onCheckedChange={() => toggleAll(products, selected)}
                />
              </Box>
            </GridTable.Cell>
            <GridTable.Cell borderWidth={0} padding={0}>
              {selected ? (
                <Text data-test-id="SelectedText" size={2} lineHeight={2}>
                  <FormattedMessage
                    id="qu/hXD"
                    defaultMessage="Selected {number} items"
                    values={{
                      number: selected,
                    }}
                  />
                </Text>
              ) : (
                <Text size={2} lineHeight={2} color="default2">
                  <FormattedMessage id="6AMFki" defaultMessage="Name" description="product name" />
                </Text>
              )}
            </GridTable.Cell>
            <GridTable.Cell borderWidth={0} padding={0}>
              {!selected && (
                <Text size={2} lineHeight={2} color="default2">
                  <FormattedMessage id="k+HcTv" defaultMessage="Type" description="product type" />
                </Text>
              )}
            </GridTable.Cell>
            <GridTable.Cell borderWidth={0} padding={0}>
              {!selected && (
                <Text size={2} lineHeight={2} color="default2">
                  <FormattedMessage
                    id="Oe62bR"
                    defaultMessage="Availability"
                    description="product availability"
                  />
                </Text>
              )}
            </GridTable.Cell>
            <GridTable.Cell borderWidth={0} padding={0}>
              <Box
                width="100%"
                paddingRight={COLLECTION_PRODUCT_TABLE_ACTION_INSET}
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
                gap={2}
                height="100%"
              >
                {!!selected && (
                  <Button variant="secondary" size="small" type="button" onClick={onUnassignClick}>
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
          {wrapRows(
            renderCollection(items, product => {
              if (!product) {
                return null;
              }

              const isSelected = isChecked(product.id);

              return (
                <ProductTableItem
                  key={product.id}
                  product={product}
                  isSelected={isSelected || false}
                  draggable={draggable}
                  reorderable={reorderable}
                  toggle={toggle}
                  onProductUnassign={onProductUnassign}
                />
              );
            }),
          )}
        </GridTable.Body>
      </GridTable>
    </Box>
  );
};

const ProductsTableStatic = (props: ProductsTableProps): JSX.Element => {
  const { products } = props;

  if (products.length === 0) {
    return <ProductsTableEmpty />;
  }

  return (
    <ProductsTableBody
      {...props}
      items={products}
      reorderable={false}
      draggable={false}
      wrapRows={rows => rows}
    />
  );
};

const ProductsTableReorderable = (props: ProductsTableProps): JSX.Element => {
  const { products, paginationState } = props;
  const { items, sensors, isSaving, handleDragEnd } = useProductDrag({
    products,
    paginationState,
  });

  if (items.length === 0) {
    return <ProductsTableEmpty />;
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <ProductsTableBody
        {...props}
        items={items}
        reorderable
        draggable={!isSaving}
        wrapRows={rows => (
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {rows}
          </SortableContext>
        )}
      />
    </DndContext>
  );
};

export const ProductsTable = ({
  reorderable = true,
  ...props
}: ProductsTableProps): JSX.Element => {
  if (!reorderable) {
    return <ProductsTableStatic {...props} reorderable={false} />;
  }

  return <ProductsTableReorderable {...props} reorderable />;
};
