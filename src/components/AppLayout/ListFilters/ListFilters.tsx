import { type SearchPageProps } from "@dashboard/types";
import { Box } from "@saleor/macaw-ui-next";
import { type ReactNode } from "react";

import { ExpressionFilterPanel, ExpressionFilters } from "./components/ExpressionFilters";
import { LegacyFiltersPresetsAlert } from "./components/LegacyFiltersPresetsAlert";
import SearchInput from "./components/SearchInput";

interface ListFiltersProps extends SearchPageProps {
  searchPlaceholder: string;
  actions?: ReactNode;
  showSearchTooltip?: boolean;
}

export const ListFilters = ({
  initialSearch,
  searchPlaceholder,
  onSearchChange,
  actions,
  showSearchTooltip,
}: ListFiltersProps) => (
  <>
    <LegacyFiltersPresetsAlert />
    <Box display="flex" flexDirection="column" gap={3} paddingBottom={2} paddingX={6}>
      <Box display="flex" alignItems="center" flexWrap="wrap" gap={4}>
        <Box flexShrink="0">
          <ExpressionFilters />
        </Box>
        <Box flexGrow="1">
          <SearchInput
            initialSearch={initialSearch}
            placeholder={searchPlaceholder}
            onSearchChange={onSearchChange}
            showSearchTooltip={showSearchTooltip}
          />
        </Box>
        {actions ? (
          <Box display="flex" justifyContent="flex-end" alignItems="center" flexShrink="0">
            {actions}
          </Box>
        ) : null}
      </Box>
      <ExpressionFilterPanel />
    </Box>
  </>
);

ListFilters.displayName = "FilterBar";
