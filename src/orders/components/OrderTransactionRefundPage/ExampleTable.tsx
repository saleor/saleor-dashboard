import { DashboardTable } from "@dashboard/components/Table";
import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface ExampleTableProps {
  order: OrderDetailsGrantRefundFragment | undefined;
}

/**
 * This is example usage of DashboardTable component.
 * TODO: Remove when implementing MERX-360.
 */
export const ExampleTable: React.FC<ExampleTableProps> = ({ order }) => {
  if (!order?.lines[0]) {
    return null;
  }

  const line = order.lines[0];

  return (
    <DashboardTable height="100%" paddingX={6} striped>
      <DashboardTable.Colgroup>
        <DashboardTable.Col __width="auto" />
        <DashboardTable.Col __width="15%" />
        <DashboardTable.Col __width="15%" />
        <DashboardTable.Col __width="15%" />
        <DashboardTable.Col __width="10%" />
      </DashboardTable.Colgroup>
      <DashboardTable.Header>
        <DashboardTable.HeaderCell>Products</DashboardTable.HeaderCell>
        <DashboardTable.HeaderCell>Unit price</DashboardTable.HeaderCell>
        <DashboardTable.HeaderCell>Qty. ordered</DashboardTable.HeaderCell>
        <DashboardTable.HeaderCell>Qty. to refund</DashboardTable.HeaderCell>
        <DashboardTable.HeaderCell>Reason</DashboardTable.HeaderCell>
      </DashboardTable.Header>
      <DashboardTable.Body>
        {Array(5)
          .fill(null)
          .map((_, ix) => (
            <DashboardTable.Row key={line.id + "row"}>
              <DashboardTable.Cell>
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
              </DashboardTable.Cell>
              <DashboardTable.Cell>{line.unitPrice.gross.amount}</DashboardTable.Cell>
              <DashboardTable.Cell>{line.quantity}</DashboardTable.Cell>
              <DashboardTable.Cell>
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
              </DashboardTable.Cell>
              <DashboardTable.Cell>
                <Button variant="secondary" whiteSpace="nowrap">
                  {ix % 2 === 0 ? "Add reason" : "Edit reason"}
                </Button>
              </DashboardTable.Cell>
            </DashboardTable.Row>
          ))}
      </DashboardTable.Body>
    </DashboardTable>
  );
};
