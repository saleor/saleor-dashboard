import { GridTable } from "@dashboard/components/GridTable";
import Link from "@dashboard/components/Link";
import { EmptyListState } from "@dashboard/extensions/components/EmptyListState/EmptyListState";
import { ExtensionAvatar } from "@dashboard/extensions/components/ExtensionAvatar";
import { messages, problemMessages } from "@dashboard/extensions/messages";
import {
  InstalledExtension,
  isProblemCritical,
  isProblemDismissed,
} from "@dashboard/extensions/types";
import { LoadingSkeleton } from "@dashboard/extensions/views/InstalledExtensions/components/LoadinSkeleton";
import { Box, Button, sprinkles, Text } from "@saleor/macaw-ui-next";
import { CircleAlert } from "lucide-react";
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

const ExtensionName = ({
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
      <Box display="flex" alignItems="center" gap={2}>
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
        gap: "8px",
        textDecoration: "none",
        color: "inherit",
      }}
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
  const activeProblems = problems.filter(p => !isProblemDismissed(p));
  const totalCount = activeProblems.length;
  const criticalCount = activeProblems.filter(p => isProblemCritical(p)).length;

  const hasActiveProblems = totalCount > 0;
  const hasAnyProblems = problems.length > 0;

  const [problemsVisible, setProblemsVisible] = useState(hasActiveProblems);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <GridTable.Row data-test-id="installed-extension-row">
        <GridTable.Cell padding={0}>
          <Box
            display="flex"
            alignItems="center"
            __padding="5px 20px"
            className={
              extension.href
                ? sprinkles({
                    backgroundColor: {
                      default: "default1",
                      hover: "default2",
                    },
                  })
                : undefined
            }
          >
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <ExtensionName href={extension.href} name={extension.name}>
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
              </ExtensionName>
              {hasActiveProblems && (
                <ProblemsBadge
                  totalCount={totalCount}
                  criticalCount={criticalCount}
                  expanded={problemsVisible}
                  onToggle={() => setProblemsVisible(prev => !prev)}
                />
              )}
            </Box>
            <Box marginLeft="auto" marginRight={4} display="flex" alignItems="center" gap={4}>
              {extension.info}
              {hasAnyProblems && (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setModalOpen(true)}
                  data-test-id="open-app-problems"
                >
                  <CircleAlert size={14} />
                  {intl.formatMessage(problemMessages.openAppProblems)}
                </Button>
              )}
              {extension.actions}
            </Box>
          </Box>
        </GridTable.Cell>
      </GridTable.Row>
      {hasActiveProblems && problemsVisible ? (
        <GridTable.Row data-test-id="installed-extension-problems-row">
          <GridTable.Cell padding={0}>
            <ProblemsList
              problems={problems}
              appId={extension.id}
              onClearProblem={onClearProblem}
              hasManagedAppsPermission={hasManagedAppsPermission}
              modalOpen={modalOpen}
              onModalOpenChange={setModalOpen}
            />
          </GridTable.Cell>
        </GridTable.Row>
      ) : (
        hasAnyProblems && (
          <ProblemsList
            problems={problems}
            appId={extension.id}
            onClearProblem={onClearProblem}
            hasManagedAppsPermission={hasManagedAppsPermission}
            showInline={false}
            modalOpen={modalOpen}
            onModalOpenChange={setModalOpen}
          />
        )
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
