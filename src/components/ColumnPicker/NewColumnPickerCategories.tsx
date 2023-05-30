import { Box, Button, List, Text } from "@saleor/macaw-ui/next";
import React, { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import messages from "./messages";
import { NewColumnPickerAvailableNodes } from "./NewColumnPickerAvailableNodes";
import { NewColumnPickerPagination } from "./NewColumnPickerPagination";
import { ColumnCategory } from "./useColumns";
import { getExitIcon, getExitOnClick } from "./utils";

export interface NewColumnPickerCategoriesProps {
  columnCategories: ColumnCategory[];
  columnPickerSettings: string[];
  onClose: () => void;
  onDynamicColumnSelect: (columns: string[]) => void;
}

export const NewColumnPickerCategories: React.FC<
  NewColumnPickerCategoriesProps
> = ({
  columnCategories,
  onClose,
  onDynamicColumnSelect,
  columnPickerSettings,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const currentCategory = useMemo(
    () => columnCategories.find(category => category.name === selectedCategory),
    [columnCategories, selectedCategory],
  );

  const [query, setQuery] = useState<string>("");

  const changeHandler = (column: string) =>
    columnPickerSettings.includes(column)
      ? onDynamicColumnSelect(
          columnPickerSettings.filter(currentCol => currentCol !== column),
        )
      : onDynamicColumnSelect([...columnPickerSettings, column]);

  React.useEffect(() => {
    // Preselect category when there is only one
    if (columnCategories.length === 1) {
      setSelectedCategory(columnCategories[0].name);
    }
  }, [columnCategories]);

  React.useEffect(() => {
    if (currentCategory) {
      setQuery(currentCategory.initialSearch ?? "");
    }
  }, [currentCategory]);

  return (
    <Box
      backgroundColor="subdued"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      __minHeight="502px"
    >
      <Box display="flex" flexDirection="column" height="100%">
        <Box
          display="flex"
          paddingX={7}
          paddingY={5}
          gap={5}
          alignItems="center"
        >
          <Button
            variant="tertiary"
            size="small"
            icon={getExitIcon(columnCategories, selectedCategory)}
            onClick={getExitOnClick({
              columnCategories,
              selectedCategory,
              setSelectedCategory,
              onClose,
            })}
          />
          <Text size="small">
            {selectedCategory ?? <FormattedMessage {...messages.categories} />}
          </Text>
        </Box>
        {selectedCategory ? (
          <NewColumnPickerAvailableNodes
            currentCategory={currentCategory}
            columnPickerSettings={columnPickerSettings}
            query={query}
            setQuery={setQuery}
            changeHandler={changeHandler}
          />
        ) : (
          <List padding={8}>
            {columnCategories.map(category => (
              <List.Item
                key={category.prefix}
                padding={4}
                borderRadius={3}
                onClick={() => setSelectedCategory(category.name)}
              >
                <Text size="small">{category.name}</Text>
              </List.Item>
            ))}
          </List>
        )}
      </Box>
      {selectedCategory && (
        <NewColumnPickerPagination
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
