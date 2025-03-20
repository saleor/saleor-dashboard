import { LoadingSkeleton } from "@dashboard/extensions/components/ExtensionsList/LoadingSkeleton";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import { ExtensionsGroups } from "../../types";
import { ExtensionItem } from "../ExtenionItem";
import { ExtensionsGroup } from "../ExtensionsGroup";
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
    return <Box>Error</Box>;
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
              <ExtensionItem key={extension.id} extension={extension} />
            ))}
          </ExtensionsGroup>
        ) : null,
      )}
    </Box>
  );
};
