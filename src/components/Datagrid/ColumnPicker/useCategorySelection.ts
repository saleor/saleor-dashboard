import React from "react";

import { ColumnCategory } from "./useColumns";

export const useCategorySelection = (columnCategories: ColumnCategory[]) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const currentCategory = React.useMemo(
    () => columnCategories.find(category => category.name === selectedCategory),
    [columnCategories, selectedCategory],
  );

  React.useEffect(() => {
    // Preselect category when there is only one
    if (columnCategories.length === 1) {
      setSelectedCategory(columnCategories[0].name);
    }
  }, [columnCategories]);

  return { currentCategory, setCurrentCategory: setSelectedCategory };
};
