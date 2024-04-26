import { GridTable } from "@dashboard/components/GridTable";
import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface ExampleTableProps {
  order: OrderDetailsGrantRefundFragment | undefined;
}

/**
 * This is example usage of GridTable component.
 * TODO: Remove when implementing MERX-360.
 */
export const ExampleTable: React.FC<ExampleTableProps> = ({ order }) => {
  if (!order?.lines[0]) {
    return null;
  }

  const line = order.lines[0];

  return (
    <GridTable height="100%" paddingX={6} striped>
      <GridTable.Colgroup>
        <GridTable.Col __width="auto" />
        <GridTable.Col __width="15%" />
        <GridTable.Col __width="15%" />
        <GridTable.Col __width="15%" />
        <GridTable.Col __width="10%" />
      </GridTable.Colgroup>
      <GridTable.Header>
        <GridTable.HeaderCell>Products</GridTable.HeaderCell>
        <GridTable.HeaderCell>Unit price</GridTable.HeaderCell>
        <GridTable.HeaderCell>Qty. ordered</GridTable.HeaderCell>
        <GridTable.HeaderCell>Qty. to refund</GridTable.HeaderCell>
        <GridTable.HeaderCell>Reason</GridTable.HeaderCell>
      </GridTable.Header>
      <GridTable.Body>
        {Array(5)
          .fill(null)
          .map((_, ix) => (
            <GridTable.Row key={line.id + "row"}>
              <GridTable.Cell>
                <Box display="flex" flexWrap="nowrap" alignItems="center">
                  <Box marginRight={2} width={8}>
                    <img src={line.thumbnail?.url} />
                  </Box>
                  <Box display="flex" flexDirection="column">
                    <Text size={2}>{line.productName}</Text>
                    <Text size={2} color="default2">
                      {"XL"}
                    </Text>
                  </Box>
                </Box>
              </GridTable.Cell>
              <GridTable.Cell>{line.unitPrice.gross.amount}</GridTable.Cell>
              <GridTable.Cell>{line.quantity}</GridTable.Cell>
              <GridTable.Cell>
                <Box backgroundColor="default1" display="flex" gap={2}>
                  <Input
                    endAdornment={`/${line.quantity}`}
                    backgroundColor="default1"
                    size="small"
                  />
                  <Button variant="secondary" size="medium">
                    All
                  </Button>
                </Box>
              </GridTable.Cell>
              <GridTable.Cell>
                <Button variant="secondary" whiteSpace="nowrap">
                  {ix % 2 === 0 ? "Add reason" : "Edit reason"}
                </Button>
              </GridTable.Cell>
            </GridTable.Row>
          ))}
      </GridTable.Body>
    </GridTable>
  );
};
