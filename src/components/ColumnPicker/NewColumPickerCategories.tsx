import { CircularProgress } from "@material-ui/core";
import {
  ArrowLeftIcon,
  Box,
  Button,
  Checkbox,
  CloseIcon,
  List,
  SearchInput,
  Text,
} from "@saleor/macaw-ui/next";
import React from "react";

import { ColumnCategory, isColumnValueChecked } from "./utils";

export interface NewColumnPickerCategoriesProps {
  columnCategories: ColumnCategory[];
  customColumnSettings: string[];
  onClose: () => void;
  onCustomColumnSelect: (columns: string[]) => void;
}

export const NewColumnPickerCategories: React.FC<
  NewColumnPickerCategoriesProps
> = ({
  columnCategories,
  onClose,
  onCustomColumnSelect,
  customColumnSettings,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>();

  const currentCategory = React.useMemo(
    () => columnCategories.find(category => category.name === selectedCategory),
    [columnCategories, selectedCategory],
  );

  const changeHandler = (column: string) => {
    if (customColumnSettings.includes(column)) {
      onCustomColumnSelect(
        customColumnSettings.filter(currentCol => currentCol !== column),
      );
    } else {
      onCustomColumnSelect([...customColumnSettings, column]);
    }
  };

  return (
    <Box backgroundColor="subdued">
      <Box display="flex" paddingX={7} paddingY={5} gap={5} alignItems="center">
        <Button
          variant="tertiary"
          size="small"
          icon={selectedCategory ? <ArrowLeftIcon /> : <CloseIcon />}
          onClick={
            selectedCategory ? () => setSelectedCategory(undefined) : onClose
          }
        />
        <Text size="small">Categories</Text>
      </Box>
      {selectedCategory ? (
        <>
          <Box paddingX={7}>
            <SearchInput
              size="small"
              placeholder="Search for columns"
              onChange={e => currentCategory.onSearch(e.target.value ?? "")}
            />
          </Box>
          <Box padding={8}>
            {currentCategory.availableNodes === undefined ? (
              <CircularProgress />
            ) : (
              <>
                {currentCategory.availableNodes.map(node => (
                  <Box
                    display="flex"
                    alignItems="center"
                    padding={5}
                    gap={6}
                    key={node.id}
                  >
                    <Checkbox
                      onCheckedChange={() =>
                        changeHandler(`${currentCategory.prefix}:${node.id}`)
                      }
                      checked={isColumnValueChecked({
                        customColumnSettings,
                        prefix: currentCategory.prefix,
                        nodeId: node.id,
                      })}
                    >
                      <Text size="small" color="textNeutralSubdued">
                        {node.title}
                      </Text>
                    </Checkbox>
                  </Box>
                ))}
                {/* TODO: Pagination */}
              </>
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
  );
};
