import { List, Text } from "@saleor/macaw-ui/next";
import React from "react";

import { ColumnCategory } from "./useColumns";

export interface ColumnPickerCategoryListProps {
  columnCategories: ColumnCategory[];
  setCurrentCategory: React.Dispatch<React.SetStateAction<string>>;
}
export const ColumnPickerCategoryList = ({
  columnCategories,
  setCurrentCategory,
}: ColumnPickerCategoryListProps) => (
  <List padding={8}>
    {columnCategories.map(category => (
      <List.Item
        key={category.prefix}
        padding={1.5}
        borderRadius={3}
        onClick={() => setCurrentCategory(category.name)}
      >
        <Text size="small">{category.name}</Text>
      </List.Item>
    ))}
  </List>
);
