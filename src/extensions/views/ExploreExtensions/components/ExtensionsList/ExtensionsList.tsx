import { EmptySearchList } from "@dashboard/extensions/components/EmptyListState/EmptySearchList";
import { ExtensionsGroups } from "@dashboard/extensions/types";
import { Box } from "@saleor/macaw-ui-next";

import { ExtensionItem } from "../ExtenionItem/ExtenionItem";
import { ExtensionsGroup } from "../ExtensionsGroup";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface ExtensionsListProps {
  extensions: ExtensionsGroups;
  loading?: boolean;
  clearSearch: () => void;
}

export const ExtensionsList = ({ extensions, loading, clearSearch }: ExtensionsListProps) => {
  const extensionsEntries = Object.entries(extensions);

  const isAllExtensionsEmpty = extensionsEntries.every(
    ([_, groupExtensions]) => groupExtensions.items.length === 0,
  );

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (isAllExtensionsEmpty) {
    return <EmptySearchList onSubtitleClick={clearSearch} />;
  }

  return (
    <Box data-test-id="extensions-list">
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
