import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import { ExtensionsGroups } from "../../types";
import { ExtensionItem } from "../ExtenionItem";
import { ExtensionsGroup } from "../ExtensionsGroup";
import { LoadingSkeleton } from "./LoadingSkeleton";
import { NoExtensions } from "./NoExtenstions";

export interface ExtensionsListProps {
  extensions: ExtensionsGroups;
  loading?: boolean;
}

export const ExtensionsList = ({ extensions, loading }: ExtensionsListProps) => {
  const extensionsEntries = Object.entries(extensions);

  const isAllExtensionsEmpty = extensionsEntries.every(
    ([_, groupExtensions]) => groupExtensions.items.length === 0,
  );

  if (loading) {
    return <LoadingSkeleton />;
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
