import { Box, Text } from "@saleor/macaw-ui-next";
import React from "react";

import { ExtensionData, ExtensionGroup } from "../../types";

export interface ExtensionsListProps {
  extensions: Record<ExtensionGroup, ExtensionData[]>;
}

export const ExtensionsList = ({ extensions }: ExtensionsListProps) => {
  return (
    <Box>
      {Object.entries(extensions).map(([group, groupExtensions]) => (
        <Box key={group}>
          <Text as="h4">{group}</Text>
          <Box>
            {groupExtensions.map(extension => (
              <Box key={extension.id}>
                <Text>{extension.name}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
