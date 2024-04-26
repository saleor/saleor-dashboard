import { DashboardTable } from "@dashboard/components/Table";
import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import { Box, Button, Input, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface ExampleTableProps {
  order: OrderDetailsGrantRefundFragment | undefined;
}

/**
 * This is example usage of DashboardTable component.
 * TODO: Remove before merging.
 */
export const ExampleTable: React.FC<ExampleTableProps> = ({ order }) => {
  if (!order?.lines[0]) {
    return null;
  }

  const line = order.lines[0];

  return (
    <DashboardTable height="100%">
      <colgroup>
        <Box as="col" __width="auto" />
        <Box as="col" __width="10%" />
        <Box as="col" __width="15%" />
        <Box as="col" __width="15%" />
        <Box as="col" __width="1%" />
      </colgroup>
      <DashboardTable.Header>
        <DashboardTable.HeaderCell paddingLeft={6}>Products</DashboardTable.HeaderCell>
        <DashboardTable.HeaderCell>Unit price</DashboardTable.HeaderCell>
        <DashboardTable.HeaderCell>Qty. ordered</DashboardTable.HeaderCell>
        <DashboardTable.HeaderCell>Qty. to refund</DashboardTable.HeaderCell>
        <DashboardTable.HeaderCell></DashboardTable.HeaderCell>
      </DashboardTable.Header>
      <DashboardTable.Body>
        {Array(5)
          .fill(null)
          .map(() => (
            <DashboardTable.Row key={line.id + "row"}>
              <DashboardTable.Cell paddingLeft={{ firstChild: 6, default: 2 }}>
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
              <DashboardTable.Cell __width="80px">
                <Input endAdornment={`/${line.quantity}`} backgroundColor="default1" />
              </DashboardTable.Cell>
              <DashboardTable.Cell>
                <Box display="flex" justifyContent="center">
                  <Button variant="secondary">All</Button>
                </Box>
              </DashboardTable.Cell>
            </DashboardTable.Row>
          ))}
      </DashboardTable.Body>
    </DashboardTable>
  );
};
