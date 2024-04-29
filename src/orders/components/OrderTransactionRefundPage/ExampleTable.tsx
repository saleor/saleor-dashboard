import { GridTable } from "@dashboard/components/GridTable";
import { formatMoney } from "@dashboard/components/Money";
import { OrderDetailsGrantRefundFragment } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
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
  const locale = useLocale();

  if (!order?.lines[0]) {
    return null;
  }

  const line = order.lines[0];

  return (
    <GridTable height="100%" paddingX={6} striped={false}>
      <GridTable.Colgroup>
        <GridTable.Col __width="45%" />
        <GridTable.Col __width="20%" />
        <GridTable.Col __width="25%" />
        <GridTable.Col __width="10%" />
      </GridTable.Colgroup>
      <GridTable.Body>
        {Array(5)
          .fill(null)
          .map((_, ix) => (
            <GridTable.Row key={line.id + "row"}>
              <GridTable.Cell>
                <Box
                  display="grid"
                  __gridTemplateColumns="minmax(0, 1fr) auto"
                  gap={10}
                  alignItems="center"
                >
                  <Box minWidth={8}>
                    <img src={line.thumbnail?.url} />
                  </Box>
                  <Box overflow="hidden" minWidth={0}>
                    <Text size={2}>{line.productName}</Text>
                    <Box overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                      <Text size={2} color="default2" textOverflow="ellipsis" overflow="hidden">
                        {"500 ml / With Aloe Vera / White packaging / Mango - Passion fruit"}
                      </Text>
                    </Box>
                  </Box>
                </Box>
              </GridTable.Cell>
              <GridTable.Cell>
                <Box
                  display="flex"
                  flexDirection="column"
                  overflow="hidden"
                  flexShrink="1"
                  __minWidth="0px"
                >
                  {`${ix === 3 ? 5 : 999} ⨉ `}
                  {formatMoney(line.unitPrice.gross, locale.locale)}
                  {ix === 3 && (
                    <Text size={2} whiteSpace="nowrap" color="default2">
                      2 already refunded
                    </Text>
                  )}
                </Box>
              </GridTable.Cell>
              <GridTable.Cell>
                <Box backgroundColor="default1" display="flex" gap={2}>
                  <Input
                    __minWidth="40px"
                    placeholder="0"
                    endAdornment={<Box whiteSpace="nowrap">of {ix === 3 ? 3 : 999}</Box>}
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
