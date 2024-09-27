import { Box, Button, Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { ColumnPickerAvailableNodes } from "./ColumnPickerAvailableNodes";
import { ColumnPickerCategoryList } from "./ColumnPickerCategoryList";
import { ColumnPickerPagination } from "./ColumnPickerPagination";
import messages from "./messages";
import { useAvailableColumnsQuery } from "./useAvailableColumnsQuery";
import { useCategorySelection } from "./useCategorySelection";
import { ColumnCategory } from "./useColumns";
import { getExitIcon, getExitOnClick } from "./utils";

interface ColumnPickerCategoriesProps {
  columnCategories: ColumnCategory[];
  selectedColumns: string[];
  onClose: () => void;
  onToggle: (columnId: string) => void;
}

export const ColumnPickerCategories = ({
  columnCategories,
  onClose,
  onToggle,
  selectedColumns,
}: ColumnPickerCategoriesProps) => {
  const { currentCategory, setCurrentCategory } = useCategorySelection(columnCategories);
  const { query, setQuery } = useAvailableColumnsQuery(currentCategory);

  return (
    <Box
      backgroundColor="default2"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      __minHeight="502px"
      __width="320px"
    >
      <Box display="flex" flexDirection="column" height="100%">
        <Box display="flex" paddingX={4} paddingY={2} gap={2} alignItems="center">
          <Button
            variant="tertiary"
            size="small"
            icon={getExitIcon(columnCategories, currentCategory)}
            onClick={getExitOnClick({
              columnCategories,
              currentCategory,
              setCurrentCategory,
              onClose,
            })}
            data-test-id="close-search"
          />
          <Text size={3}>
            {currentCategory?.name ?? <FormattedMessage {...messages.categories} />}
          </Text>
        </Box>
        {currentCategory ? (
          <ColumnPickerAvailableNodes
            currentCategory={currentCategory}
            selectedColumns={selectedColumns}
            query={query}
            setQuery={setQuery}
            onToggle={onToggle}
          />
        ) : (
          <ColumnPickerCategoryList
            columnCategories={columnCategories}
            setCurrentCategory={setCurrentCategory}
          />
        )}
      </Box>
      {currentCategory && (
        <ColumnPickerPagination
          query={query}
          hasNextPage={currentCategory.hasNextPage}
          hasPreviousPage={currentCategory.hasPreviousPage}
          onNextPage={currentCategory.onNextPage}
          onPreviousPage={currentCategory.onPreviousPage}
        />
      )}
    </Box>
  );
};
