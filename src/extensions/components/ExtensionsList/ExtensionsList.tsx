import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "../../messages";
import { ExtensionsGroups } from "../../types";
import { ExtensionItem } from "../ExtenionItem";
import { ExtensionsGroup } from "../ExtensionsGroup";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { NoExtensions } from "./NoExtenstions";

export interface ExtensionsListProps {
  extensions: ExtensionsGroups;
  error?: string | null;
  loading?: boolean;
}

export const ExtensionsList = ({ extensions, error, loading }: ExtensionsListProps) => {
  const extensionsEntries = Object.entries(extensions);

  const isAllExtensionsEmpty = extensionsEntries.every(
    ([_, groupExtensions]) => groupExtensions.items.length === 0,
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
    return (
      <Text color="critical1">
        <FormattedMessage {...messages.errorLoadingExtensions} />
      </Text>
    );
  }

  if (isAllExtensionsEmpty) {
    return <NoExtensions />;
  }

  return (
    <Box>
      {extensionsEntries.map(([group, groupExtensions]) =>
        groupExtensions.items.length > 0 ? (
          <ExtensionsGroup title={groupExtensions.title} key={group}>
            {groupExtensions.items.map(extension => (
              // Key use combination of id and name because all cms extensions have the same id
              <ExtensionItem key={extension.id + extension.name.en} extension={extension} />
            ))}
          </ExtensionsGroup>
        ) : null,
      )}
    </Box>
  );
};
