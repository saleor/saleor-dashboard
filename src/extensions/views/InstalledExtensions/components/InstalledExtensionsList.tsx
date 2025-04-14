import { GridTable } from "@dashboard/components/GridTable";
import { EmptyListState } from "@dashboard/extensions/components/EmptyListState/EmptyListState";
import { ExtensionAvatar } from "@dashboard/extensions/components/ExtensionAvatar";
import { messages } from "@dashboard/extensions/messages";
import { InstalledExtension } from "@dashboard/extensions/types";
import { Box, GenericAppIcon, Skeleton, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface InstalledExtensionsListProps {
  installedExtensions: InstalledExtension[];
  loading: boolean;
  clearSearch: () => void;
}

export const InstalledExtensionsList = ({
  installedExtensions,
  loading,
  clearSearch,
}: InstalledExtensionsListProps) => {
  const intl = useIntl();

  if (loading) {
    return (
      <GridTable>
        <GridTable.Body>
          <GridTable.Row>
            <GridTable.Cell paddingY={4}>
              <Text size={3}>
                <FormattedMessage {...messages.extensionName} />
              </Text>
            </GridTable.Cell>
          </GridTable.Row>
          {Array.from({ length: 5 }).map((_, i) => (
            <GridTable.Row key={i}>
              <GridTable.Cell paddingY={4}>
                <Skeleton __width={i % 2 === 0 ? "150px" : "200px"} />
              </GridTable.Cell>
            </GridTable.Row>
          ))}
        </GridTable.Body>
      </GridTable>
    );
  }

  if (installedExtensions.length === 0) {
    return (
      <EmptyListState
        title={intl.formatMessage(messages.noExtensionsFound)}
        subtitle={intl.formatMessage(messages.clearSearch)}
        onSubtitleClick={clearSearch}
      />
    );
  }

  return (
    <Box __marginLeft="-24px" __marginRight="-24px" paddingBottom={10}>
      <GridTable>
        <GridTable.Colgroup>
          <GridTable.Col __width="16px" />
          <GridTable.Col __width="calc(100% - 250px)" />
          <GridTable.Col __width="250px" />
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
                <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                  <ExtensionAvatar>
                    {extension.logo ? (
                      <Box
                        as="img"
                        src={extension.logo}
                        alt={extension.name}
                        display="block"
                        maxWidth="100%"
                      />
                    ) : (
                      <GenericAppIcon size="medium" color="default2" />
                    )}
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
                  <Box
                    marginLeft={{
                      tablet: 6,
                    }}
                  >
                    {extension.info}
                  </Box>
                </Box>
              </GridTable.Cell>
              <GridTable.Cell>
                <Box display="flex" alignItems="center" justifyContent="space-between">
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
