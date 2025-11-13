import { GridTable } from "@dashboard/components/GridTable";
import Link from "@dashboard/components/Link";
import { EmptyListState } from "@dashboard/extensions/components/EmptyListState/EmptyListState";
import { ExtensionAvatar } from "@dashboard/extensions/components/ExtensionAvatar";
import { messages } from "@dashboard/extensions/messages";
import { InstalledExtension } from "@dashboard/extensions/types";
import { LoadingSkeleton } from "@dashboard/extensions/views/InstalledExtensions/components/LoadinSkeleton";
import { Box, sprinkles, Text } from "@saleor/macaw-ui-next";
import * as React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface InstalledExtensionsListProps {
  installedExtensions: InstalledExtension[];
  loading: boolean;
  clearSearch: () => void;
  searchQuery?: string;
}

const ExtensionLink = ({
  href,
  name,
  children,
}: {
  href?: string;
  name: string;
  children: React.ReactNode;
}) => {
  if (!href) {
    return (
      <Box display="flex" alignItems="center" __padding="5px 20px">
        {children}
      </Box>
    );
  }

  const formattedName = name?.toLowerCase().replace(" ", "") ?? "";

  return (
    <Link
      href={href}
      data-test-id={`${formattedName}-view-details`}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "5px 20px",
        textDecoration: "none",
        color: "inherit",
      }}
      className={sprinkles({
        backgroundColor: {
          default: "default1",
          hover: "default2",
        },
      })}
    >
      {children}
    </Link>
  );
};

export const InstalledExtensionsList = ({
  installedExtensions,
  loading,
  clearSearch,
  searchQuery,
}: InstalledExtensionsListProps) => {
  const intl = useIntl();

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (installedExtensions.length === 0) {
    return (
      <EmptyListState
        title={intl.formatMessage(messages.noExtensionsFound)}
        subtitle={searchQuery && intl.formatMessage(messages.clearSearch)}
        onSubtitleClick={searchQuery ? clearSearch : undefined}
      />
    );
  }

  return (
    <Box
      data-test-id="extensions-installed"
      __marginLeft="-24px"
      __marginRight="-24px"
      paddingBottom={10}
    >
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
          {installedExtensions.map(extension => (
            <GridTable.Row key={extension.id} data-test-id="installed-extension-row">
              <GridTable.Cell padding={0}>
                <ExtensionLink href={extension.href} name={extension.name}>
                  <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                    <ExtensionAvatar>{extension.logo}</ExtensionAvatar>
                    <Text
                      size={4}
                      fontWeight="bold"
                      __maxWidth="400px"
                      overflow="hidden"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                    >
                      {extension.name}
                    </Text>
                  </Box>
                  <Box marginLeft="auto" marginRight={4} display="flex" alignItems="center" gap={4}>
                    {extension.info}
                    {/* Actions are here only for failed installation case,
                        type InstalledExtension should be refactored. More info in its definition */}
                    {extension.actions}
                  </Box>
                </ExtensionLink>
              </GridTable.Cell>
            </GridTable.Row>
          ))}
        </GridTable.Body>
      </GridTable>
    </Box>
  );
};
