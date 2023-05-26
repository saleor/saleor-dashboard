import { CircularProgress } from "@material-ui/core";
import { Box, Button, Checkbox, List, Text } from "@saleor/macaw-ui/next";
import React, { useMemo, useState } from "react";
import { FormattedMessage } from "react-intl";

import messages from "./messages";
import { NewColumnPickerPagination } from "./NewColumnPickerPagination";
import { NewColumnPickerSearch } from "./NewColumnPickerSearch";
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
  const [query, setQuery] = useState<string>("");

  const currentCategory = useMemo(
    () => columnCategories.find(category => category.name === selectedCategory),
    [columnCategories, selectedCategory],
  );

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
          <>
            <Box
              display="flex"
              paddingX={7}
              style={{ boxSizing: "border-box" }}
            >
              <NewColumnPickerSearch
                currentCategory={currentCategory}
                query={query}
                setQuery={setQuery}
              />
            </Box>
            <Box paddingX={8} paddingY={4} flexGrow="1">
              {!currentCategory.availableNodes.length ? (
                <Box
                  width="100%"
                  height="100%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <CircularProgress />
                </Box>
              ) : (
                currentCategory.availableNodes.map(node => (
                  <Box
                    display="flex"
                    alignItems="center"
                    padding={5}
                    gap={6}
                    key={node.id}
                  >
                    <Checkbox
                      onCheckedChange={() => changeHandler(node.id)}
                      checked={columnPickerSettings.includes(node.id)}
                    >
                      <Text size="small" color="textNeutralSubdued">
                        {node.title}
                      </Text>
                    </Checkbox>
                  </Box>
                ))
              )}
            </Box>
          </>
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
