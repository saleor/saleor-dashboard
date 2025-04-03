import { GridTable } from "@dashboard/components/GridTable";
import { ExtensionAvatar } from "@dashboard/extensions/components/ExtensionAvatar";
import { InstalledExtension } from "@dashboard/extensions/types";
import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

interface InstalledExtensionsListProps {
  installedExtensions: InstalledExtension[];
}

export const InstalledExtensionsList = ({ installedExtensions }: InstalledExtensionsListProps) => {
  return (
    <GridTable>
      <GridTable.Colgroup>
        <GridTable.Col __width="100%" />
      </GridTable.Colgroup>
      <GridTable.Body>
        <GridTable.Row>
          <GridTable.Cell paddingY={4}>
            <Text size={3}>Extension Name</Text>
          </GridTable.Cell>
        </GridTable.Row>
        {installedExtensions.map(extension => (
          <GridTable.Row key={extension.id}>
            <GridTable.Cell>
              <Box width="100%" display="flex" alignItems="center" gap={10}>
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
                  <Text size={4} fontWeight="bold">
                    {extension.name}
                  </Text>
                </Box>
                <Box>{extension.info}</Box>
                <Box marginLeft="auto">{extension.actions}</Box>
              </Box>
            </GridTable.Cell>
          </GridTable.Row>
        ))}
      </GridTable.Body>
    </GridTable>
  );
};
