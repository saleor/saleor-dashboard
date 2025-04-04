import { GridTable } from "@dashboard/components/GridTable";
import { ExtensionAvatar } from "@dashboard/extensions/components/ExtensionAvatar";
import { messages } from "@dashboard/extensions/messages";
import { InstalledExtension } from "@dashboard/extensions/types";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

interface InstalledExtensionsListProps {
  installedExtensions: InstalledExtension[];
}

export const InstalledExtensionsList = ({ installedExtensions }: InstalledExtensionsListProps) => {
  return (
    <Box __marginLeft="-24px" __marginRight="-24px">
      <GridTable>
        <GridTable.Colgroup>
          <GridTable.Col __width="16px" />
          <GridTable.Col __width="250px" />
          <GridTable.Col __width="calc(100% - 250px)" />
        </GridTable.Colgroup>
        <GridTable.Body>
          <GridTable.Row>
            <GridTable.Cell />
            <GridTable.Cell paddingY={4}>
              <Text size={3}>
                <FormattedMessage {...messages.extensionName} />
              </Text>
            </GridTable.Cell>
            <GridTable.Cell paddingY={4} />
          </GridTable.Row>
          {installedExtensions.map(extension => (
            <GridTable.Row key={extension.id}>
              <GridTable.Cell />
              <GridTable.Cell>
                <Box display="flex" alignItems="center" gap={2}>
                  <ExtensionAvatar>
                    <Box
                      as="img"
                      src={extension.logo}
                      alt={extension.name}
                      display="block"
                      maxWidth="100%"
                    />
                  </ExtensionAvatar>
                  <Text
                    size={4}
                    fontWeight="bold"
                    __maxWidth="200px"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                  >
                    {extension.name}
                  </Text>
                </Box>
              </GridTable.Cell>
              <GridTable.Cell>
                <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
                  <Box>{extension.info}</Box>
                  <Box marginLeft="auto" marginRight={4}>
                    {extension.actions}
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
