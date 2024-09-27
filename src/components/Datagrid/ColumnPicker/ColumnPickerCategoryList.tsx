import { List, Text } from "@saleor/macaw-ui-next";
import React from "react";

import { ColumnCategory } from "./useColumns";

interface ColumnPickerCategoryListProps {
  columnCategories: ColumnCategory[];
  setCurrentCategory: React.Dispatch<React.SetStateAction<string | null>>;
}
export const ColumnPickerCategoryList = ({
  columnCategories,
  setCurrentCategory,
}: ColumnPickerCategoryListProps) => (
  <List padding={4} data-test-id="dynamic-category-container">
    {columnCategories
      .filter(category => !category.hidden)
      .map(category => (
        <List.Item
          key={category.prefix}
          padding={1.5}
          borderRadius={3}
          onClick={() => setCurrentCategory(category.name)}
          data-test-id={`dynamic-category-${category.prefix}`}
        >
          <Text size={3}>{category.name}</Text>
        </List.Item>
      ))}
  </List>
);
