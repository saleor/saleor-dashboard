import { ExtensionItem } from "@dashboard/extensions/components/ExtenionItem/ExtenionItem";
import { ExtensionsGroup } from "@dashboard/extensions/components/ExtensionsGroup/ExtensionsGroup";
import { Box } from "@saleor/macaw-ui-next";
import React from "react";

import { ExtensionData, ExtensionGroup } from "../../types";
import { NoExtensions } from "./NoExtenstions";

export interface ExtensionsListProps {
  extensions: Record<ExtensionGroup, ExtensionData[]>;
}

export const ExtensionsList = ({ extensions }: ExtensionsListProps) => {
  return (
    <Box>
      {Object.entries(extensions).map(([group, groupExtensions]) => (
        <ExtensionsGroup title={group} key={group}>
          {groupExtensions.length > 0 ? (
            groupExtensions.map(extension => (
              <ExtensionItem key={extension.id} extension={extension} />
            ))
          ) : (
            <NoExtensions />
          )}
        </ExtensionsGroup>
      ))}
    </Box>
  );
};
