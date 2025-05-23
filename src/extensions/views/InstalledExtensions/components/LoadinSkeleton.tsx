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
          <GridTable.Col />
        </GridTable.Colgroup>
        <GridTable.Body>
          <GridTable.Row>
            <GridTable.Cell paddingY={4} paddingX={5}>
              <Text size={3}>
                <FormattedMessage {...messages.extensionName} />
              </Text>
            </GridTable.Cell>
          </GridTable.Row>
          {Array.from({ length: 10 }).map((_, i) => (
            <GridTable.Row key={i}>
              <GridTable.Cell padding={0}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  __padding="5px 20px"
                >
                  <Box display="flex" alignItems="center" gap={2}>
                    <ExtensionAvatar>
                      <GenericAppIcon size="medium" color="default2" />
                    </ExtensionAvatar>
                    <Skeleton
                      data-test-id="loading-skeleton"
                      __width={i % 2 === 0 ? "150px" : "200px"}
                    />
                  </Box>
                </Box>
              </GridTable.Cell>
            </GridTable.Row>
          ))}
        </GridTable.Body>
      </GridTable>
    </Box>
  );
};
