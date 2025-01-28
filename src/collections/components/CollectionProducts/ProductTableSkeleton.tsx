import { GridTable } from "@dashboard/components/GridTable";
import Drag from "@dashboard/icons/Drag";
import { Box, Skeleton } from "@saleor/macaw-ui-next";
import React from "react";

export const ProductTableItemSkeleton = () => (
  <GridTable.Row __height="50px" backgroundColor="default1">
    <GridTable.Cell>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100%"
        color="default2"
        disabled
      >
        <Drag />
      </Box>
    </GridTable.Cell>
    <GridTable.Cell padding={1}>
      <Box display="flex" alignItems="center" height="100%">
        <Skeleton />
      </Box>
    </GridTable.Cell>
    <GridTable.Cell>
      <Skeleton />
    </GridTable.Cell>
    <GridTable.Cell>
      <Skeleton />
    </GridTable.Cell>
    <GridTable.Cell>
      <Box as="a" display="block" height="100%">
        <Skeleton />
      </Box>
    </GridTable.Cell>
    <GridTable.Cell>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="flex-end"
        paddingRight={6}
        height="100%"
      >
        <Skeleton />
      </Box>
    </GridTable.Cell>
  </GridTable.Row>
);

export const ProductTableSkeleton = ({ numberOfRows }: { numberOfRows: number }) => (
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
      {Array.from({ length: numberOfRows }, (_, index) => (
        <ProductTableItemSkeleton key={index} />
      ))}
    </GridTable.Body>
  </GridTable>
);
