import { ASSIGNABLE_LIST_TABLE_MEDIA_ROW_HEIGHT } from "@dashboard/components/AssignableListTable/assignableListTableLayout";
import { GridTable } from "@dashboard/components/GridTable";
import { Skeleton } from "@dashboard/components/Skeleton/Skeleton";
import { Box, Text } from "@saleor/macaw-ui-next";
import type { ReactNode } from "react";
import { FormattedMessage } from "react-intl";

import tableStyles from "./ProductsTable.module.css";
import styles from "./ProductTableItem.module.css";
import {
  COLLECTION_PRODUCT_TABLE_ACTION_INSET,
  COLLECTION_PRODUCT_TABLE_ACTIONS_COLUMN_WIDTH,
  COLLECTION_PRODUCT_TABLE_AVAILABILITY_COLUMN_WIDTH,
  COLLECTION_PRODUCT_TABLE_CHECKBOX_COLUMN_WIDTH,
  COLLECTION_PRODUCT_TABLE_DRAG_COLUMN_WIDTH,
  COLLECTION_PRODUCT_TABLE_NAME_COLUMN_WIDTH,
  COLLECTION_PRODUCT_TABLE_TYPE_COLUMN_WIDTH,
} from "./productTableLayout";

const DEFAULT_SKELETON_ROW_COUNT = 10;

interface ProductTableSkeletonProps {
  rowCount?: number;
  reorderable?: boolean;
}

const ProductTableItemSkeleton = ({ reorderable = true }: { reorderable?: boolean }): ReactNode => (
  <GridTable.Row __height={ASSIGNABLE_LIST_TABLE_MEDIA_ROW_HEIGHT} backgroundColor="default1">
    <GridTable.Cell __height="inherit" padding={0}>
      {reorderable ? (
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <Skeleton __width="16px" __height="16px" borderRadius={1} />
        </Box>
      ) : null}
    </GridTable.Cell>
    <GridTable.Cell __height="inherit" padding={0}>
      <Box display="flex" alignItems="center" height="100%">
        <Skeleton __width="16px" __height="16px" borderRadius={1} />
      </Box>
    </GridTable.Cell>
    <GridTable.Cell __height="inherit" padding={0} className={styles.truncateCell}>
      <Box className={styles.cellContent}>
        <Skeleton __width="31px" __height="31px" flexShrink="0" />
        <Skeleton __height="14px" __width="58%" __minWidth="96px" />
      </Box>
    </GridTable.Cell>
    <GridTable.Cell __height="inherit" padding={0} className={styles.truncateCell}>
      <Box className={styles.typeCellContent}>
        <Skeleton __height="14px" __width="42%" __minWidth="72px" />
      </Box>
    </GridTable.Cell>
    <GridTable.Cell __height="inherit" padding={0}>
      <Box display="flex" alignItems="center" height="100%" padding={2}>
        <Skeleton __height="14px" __width="72%" __minWidth="112px" />
      </Box>
    </GridTable.Cell>
    <GridTable.Cell __height="inherit" padding={0}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        paddingRight={COLLECTION_PRODUCT_TABLE_ACTION_INSET}
        height="100%"
      />
    </GridTable.Cell>
  </GridTable.Row>
);

export const ProductTableSkeleton = ({
  rowCount = DEFAULT_SKELETON_ROW_COUNT,
  reorderable = true,
}: ProductTableSkeletonProps): ReactNode => (
  <GridTable
    borderWidth={0}
    className={tableStyles.table}
    data-test-id="collection-products-table-skeleton"
  >
    <GridTable.Colgroup>
      <GridTable.Col __width={COLLECTION_PRODUCT_TABLE_DRAG_COLUMN_WIDTH} />
      <GridTable.Col __width={COLLECTION_PRODUCT_TABLE_CHECKBOX_COLUMN_WIDTH} />
      <GridTable.Col __width={COLLECTION_PRODUCT_TABLE_NAME_COLUMN_WIDTH} />
      <GridTable.Col __width={COLLECTION_PRODUCT_TABLE_TYPE_COLUMN_WIDTH} />
      <GridTable.Col __width={COLLECTION_PRODUCT_TABLE_AVAILABILITY_COLUMN_WIDTH} />
      <GridTable.Col __width={COLLECTION_PRODUCT_TABLE_ACTIONS_COLUMN_WIDTH} />
    </GridTable.Colgroup>
    <GridTable.Body>
      <GridTable.Row className={tableStyles.headerRow}>
        <GridTable.Cell padding={0} borderWidth={0} />
        <GridTable.Cell padding={0} borderWidth={0} />
        <GridTable.Cell borderWidth={0} padding={0}>
          <Text size={2} lineHeight={2} color="default2">
            <FormattedMessage id="6AMFki" defaultMessage="Name" description="product name" />
          </Text>
        </GridTable.Cell>
        <GridTable.Cell borderWidth={0} padding={0}>
          <Text size={2} lineHeight={2} color="default2">
            <FormattedMessage id="k+HcTv" defaultMessage="Type" description="product type" />
          </Text>
        </GridTable.Cell>
        <GridTable.Cell borderWidth={0} padding={0}>
          <Text size={2} lineHeight={2} color="default2">
            <FormattedMessage
              id="Oe62bR"
              defaultMessage="Availability"
              description="product availability"
            />
          </Text>
        </GridTable.Cell>
        <GridTable.Cell borderWidth={0} padding={0} />
      </GridTable.Row>
      {Array.from({ length: rowCount }, (_, index) => (
        <ProductTableItemSkeleton key={index} reorderable={reorderable} />
      ))}
    </GridTable.Body>
  </GridTable>
);
