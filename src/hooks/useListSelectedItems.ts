import { useState } from "react";

export const useListSelectedItems = <T>(initialSelectedItems?: T[]) => {
  const [selectedItems, setSelectedItems] = useState<T[]>(initialSelectedItems ?? []);

  const toggleSelectItem = (selectedItem: T) => {
    setSelectedItems(selectedItems => {
      if (selectedItems.includes(selectedItem)) {
        return selectedItems.filter(item => item !== selectedItem);
      }

      return [...selectedItems, selectedItem];
    });
  };

  const handleSetSelectedItems = (items: T[]) => {
    setSelectedItems(items);
  };

  const clearSelectedItems = () => {
    setSelectedItems([]);
  };

  return {
    selectedItems,
    setSelectedItems: handleSetSelectedItems,
    toggleSelectItem,
    clearSelectedItems,
  };
};
