import { GridTable } from "@dashboard/components/GridTable";
import { ExtensionAvatar } from "@dashboard/extensions/components/ExtensionAvatar";
import { messages } from "@dashboard/extensions/messages";
import { Box, GenericAppIcon, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

export const LoadingSkeleton = () => {
  return (
    <Box __marginLeft="-24px" __marginRight="-24px">
      <GridTable>
        <GridTable.Colgroup>
          <GridTable.Col __width="16px" />
          <GridTable.Col __width="calc(100% - 250px)" />
          <GridTable.Col __width="250px" />
        </GridTable.Colgroup>
        <GridTable.Body>
          <GridTable.Row>
            <GridTable.Cell paddingY={4} />
            <GridTable.Cell paddingY={4}>
              <Text size={3}>
                <FormattedMessage {...messages.extensionName} />
              </Text>
            </GridTable.Cell>
            <GridTable.Cell paddingY={4} />
          </GridTable.Row>
          {Array.from({ length: 10 }).map((_, i) => (
            <GridTable.Row key={i}>
              <GridTable.Cell />
              <GridTable.Cell>
                <Box display="flex" alignItems="center" gap={2}>
                  <ExtensionAvatar>
                    <GenericAppIcon size="medium" color="default2" />
                  </ExtensionAvatar>
                  <Skeleton
                    data-test-id="loading-skeleton"
                    __width={i % 2 === 0 ? "150px" : "200px"}
                  />
                </Box>
              </GridTable.Cell>
              <GridTable.Cell />
            </GridTable.Row>
          ))}
        </GridTable.Body>
      </GridTable>
    </Box>
  );
};
