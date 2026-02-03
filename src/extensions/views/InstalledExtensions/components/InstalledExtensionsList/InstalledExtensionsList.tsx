import { GridTable } from "@dashboard/components/GridTable";
import Link from "@dashboard/components/Link";
import { EmptyListState } from "@dashboard/extensions/components/EmptyListState/EmptyListState";
import { ExtensionAvatar } from "@dashboard/extensions/components/ExtensionAvatar";
import { messages, problemMessages } from "@dashboard/extensions/messages";
import { getProblemSeverity, InstalledExtension } from "@dashboard/extensions/types";
import { LoadingSkeleton } from "@dashboard/extensions/views/InstalledExtensions/components/LoadinSkeleton";
import { Box, Button, sprinkles, Text } from "@saleor/macaw-ui-next";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProblemsBadge } from "../AppProblems/ProblemsBadge";
import { ProblemsList } from "../AppProblems/ProblemsList";

interface InstalledExtensionsListProps {
  installedExtensions: InstalledExtension[];
  loading: boolean;
  clearSearch: () => void;
  searchQuery?: string;
  hasManagedAppsPermission?: boolean;
  onClearProblem?: (appId: string, keys?: string[]) => void;
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

interface ExtensionRowProps {
  extension: InstalledExtension;
  hasManagedAppsPermission?: boolean;
  onClearProblem?: (appId: string, keys?: string[]) => void;
}

const ExtensionRow = ({
  extension,
  hasManagedAppsPermission,
  onClearProblem,
}: ExtensionRowProps) => {
  const intl = useIntl();
  const problems = extension.problems ?? [];
  const errorCount = problems.filter(p => getProblemSeverity(p) === "critical").length;
  const warningCount = problems.filter(p => getProblemSeverity(p) === "warning").length;
  const totalCount = errorCount + warningCount;
  const [problemsVisible, setProblemsVisible] = useState(totalCount > 0);
  const hasAppOwnedProblems = problems.some(p => p.__typename === "AppProblem");

  return (
    <>
      <GridTable.Row data-test-id="installed-extension-row">
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
              {totalCount > 0 && (
                <ProblemsBadge
                  errorCount={errorCount}
                  warningCount={warningCount}
                  expanded={problemsVisible}
                  onToggle={() => setProblemsVisible(prev => !prev)}
                />
              )}
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
      {problemsVisible && totalCount > 0 && (
        <GridTable.Row data-test-id="installed-extension-problems-row">
          <GridTable.Cell padding={0}>
            <Box display="flex" gap={4} alignItems="flex-start">
              <ProblemsList
                problems={extension.problems!}
                appId={extension.id}
                onClearProblem={onClearProblem}
                hasManagedAppsPermission={hasManagedAppsPermission}
              />
              {hasManagedAppsPermission && hasAppOwnedProblems && onClearProblem && (
                <Box __paddingTop="22px" flexShrink="0" marginLeft="auto" paddingRight={5}>
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() =>
                      onClearProblem(
                        extension.id,
                        problems.filter(p => p.__typename === "AppProblem").map(p => p.key),
                      )
                    }
                  >
                    {intl.formatMessage(problemMessages.clearAllAppProblems)}
                  </Button>
                </Box>
              )}
            </Box>
          </GridTable.Cell>
        </GridTable.Row>
      )}
    </>
  );
};

export const InstalledExtensionsList = ({
  installedExtensions,
  loading,
  clearSearch,
  searchQuery,
  hasManagedAppsPermission,
  onClearProblem,
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
            <ExtensionRow
              key={extension.id}
              extension={extension}
              hasManagedAppsPermission={hasManagedAppsPermission}
              onClearProblem={onClearProblem}
            />
          ))}
        </GridTable.Body>
      </GridTable>
    </Box>
  );
};
