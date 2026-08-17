import { ASSIGNABLE_LIST_TABLE_MEDIA_ROW_HEIGHT } from "@dashboard/components/AssignableListTable/assignableListTableLayout";
import { ProductChannelsAvailability } from "@dashboard/components/ChannelsAvailabilityDropdown";
import { DragHandle } from "@dashboard/components/DragHandle/DragHandle";
import { EmptyImage } from "@dashboard/components/EmptyImage";
import { GridTable } from "@dashboard/components/GridTable";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import Link from "@dashboard/components/Link";
import { Skeleton } from "@dashboard/components/Skeleton/Skeleton";
import { buttonMessages } from "@dashboard/intl";
import { productUrl } from "@dashboard/products/urls";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Button, Checkbox, Text } from "@saleor/macaw-ui-next";
import { Trash2 } from "lucide-react";
import type * as React from "react";
import { useIntl } from "react-intl";

import styles from "./ProductTableItem.module.css";
import { COLLECTION_PRODUCT_TABLE_ACTION_INSET } from "./productTableLayout";
import { type Product } from "./types";

interface ItemProps {
  product: Product;
  isSelected: boolean;
  draggable: boolean;
  reorderable?: boolean;
  toggle: (id: string) => void;
  onProductUnassign: (id: string, event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ProductTableItem = ({
  product,
  isSelected,
  draggable,
  reorderable = true,
  toggle,
  onProductUnassign,
}: ItemProps) => {
  const intl = useIntl();
  const { attributes, listeners, setNodeRef, transform, transition, isSorting } = useSortable({
    id: product.id,
    disabled: !reorderable || !draggable,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const href = product ? productUrl(product.id) : "";
  const isSaving = product.id.includes("moved_");

  return (
    <GridTable.Row
      className={styles.row}
      __height={ASSIGNABLE_LIST_TABLE_MEDIA_ROW_HEIGHT}
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
      {reorderable ? (
        <GridTable.Cell __height="inherit" padding={0}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            height="100%"
            __cursor={draggable ? (isSorting ? "grabbing" : "grab") : "not-allowed"}
            {...attributes}
            {...listeners}
          >
            <DragHandle
              cursor={draggable ? (isSorting ? "grabbing" : "grab") : "not-allowed"}
              data-test-id="button-drag-handle"
            />
          </Box>
        </GridTable.Cell>
      ) : (
        <GridTable.Cell __height="inherit" padding={0} />
      )}
      <GridTable.Cell __height="inherit" padding={0}>
        <Box display="flex" alignItems="center" height="100%">
          <Checkbox checked={isSelected} onCheckedChange={() => product && toggle(product.id)} />
        </Box>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0} className={styles.truncateCell}>
        <Link href={href} inline={false} className={styles.cellLink}>
          <Box className={styles.cellContent}>
            <Box flexShrink="0">
              {product?.thumbnail ? (
                <Box
                  borderColor="default1"
                  borderWidth={1}
                  borderRadius={3}
                  borderStyle="solid"
                  overflow="hidden"
                >
                  <Box
                    as="img"
                    src={product?.thumbnail?.url}
                    alt={product?.name}
                    __width="31px"
                    __height="31px"
                  />
                </Box>
              ) : (
                <EmptyImage />
              )}
            </Box>
            <Text ellipsis display="block" className={styles.truncatedText}>
              {product?.name}
            </Text>
          </Box>
        </Link>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0} className={styles.truncateCell}>
        <Box className={styles.typeCellContent}>
          <Text ellipsis display="block" size={2} color="default2">
            {product?.productType.name || <Skeleton __height="14px" __width="6rem" />}
          </Text>
        </Box>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0}>
        <Box display="flex" alignItems="center" height="100%" padding={2}>
          {product && !product?.channelListings?.length ? (
            "-"
          ) : product?.channelListings !== undefined ? (
            <ProductChannelsAvailability channels={product?.channelListings} />
          ) : (
            <Skeleton __height="14px" __width="8rem" />
          )}
        </Box>
      </GridTable.Cell>
      <GridTable.Cell __height="inherit" padding={0}>
        <Box
          className={styles.rowDelete}
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          paddingRight={COLLECTION_PRODUCT_TABLE_ACTION_INSET}
          width="100%"
          height="100%"
        >
          <Button
            data-test-id="delete-icon"
            variant="tertiary"
            type="button"
            onClick={event => product && onProductUnassign(product.id, event)}
            title={intl.formatMessage(buttonMessages.delete)}
            icon={<Trash2 size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
          />
        </Box>
      </GridTable.Cell>
    </GridTable.Row>
  );
};
