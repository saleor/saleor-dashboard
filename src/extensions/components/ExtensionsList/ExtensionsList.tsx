import { ExtensionItem } from "@dashboard/extensions/components/ExtenionItem/ExtenionItem";
import { ExtensionsGroup } from "@dashboard/extensions/components/ExtensionsGroup/ExtensionsGroup";
import { NoExtensions } from "@dashboard/extensions/components/ExtensionsList/NoExtenstions";
import { Box, Skeleton } from "@saleor/macaw-ui-next";
import React from "react";

import { ExtensionData, ExtensionGroup } from "../../types";

export interface ExtensionsListProps {
  extensions: Record<ExtensionGroup, ExtensionData[]>;
  error?: string | null;
  loading?: boolean;
}

export const ExtensionsList = ({ extensions, error, loading }: ExtensionsListProps) => {
  const extensionsEntries = Object.entries(extensions);
  const isAllExtensionsEmpty = extensionsEntries.every(
    ([_, groupExtensions]) => groupExtensions.length === 0,
  );

  if (loading) {
    return (
      <Box>
        <Skeleton __width="200px" />
        <Skeleton __width="200px" />
        <Skeleton __width="200px" />
        <Skeleton __width="200px" />
        <Skeleton __width="200px" />
      </Box>
    );
  }

  if (error) {
    return <Box>Error</Box>;
  }

  if (isAllExtensionsEmpty) {
    return <NoExtensions />;
  }

  return (
    <Box>
      {extensionsEntries.map(([group, groupExtensions]) =>
        groupExtensions.length > 0 ? (
          <ExtensionsGroup title={group} key={group}>
            {groupExtensions.map(extension => (
              <ExtensionItem key={extension.id} extension={extension} />
            ))}
          </ExtensionsGroup>
        ) : null,
      )}
    </Box>
  );
};
