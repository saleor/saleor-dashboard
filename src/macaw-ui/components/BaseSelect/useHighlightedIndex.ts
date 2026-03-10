import { UseComboboxStateChange, UseSelectStateChange } from "downshift";
import { useEffect, useState } from "react";

import { Option } from "~/components/BaseSelect";

export function useHighlightedIndex<T extends Option>(
  items: T[],
  selectedItem: T | null | undefined
): {
  highlightedIndex: number | undefined;
  onHighlightedIndexChange: (
    change: UseComboboxStateChange<T> | UseSelectStateChange<T>
  ) => void;
} {
  // Initially we don't show any item as highlighted
  const [highlightedIndex, setHighlightedIndex] = useState<number | undefined>(
    -1
  );

  // When data from API comes we can calculate initially highlighted index
  // Or when we change the selected item
  useEffect(() => {
    // If we don't have selected item leave highlighted index as -1
    if (!selectedItem || highlightedIndex !== -1) {
      return;
    }

    // Find highlighted index in items to select base on selected item value
    // If there is no match, leave highlighted index as -1
    setHighlightedIndex(getIndexToHighlight(items, selectedItem));
  }, [highlightedIndex, items, selectedItem]);

  const handleHighlightedIndexChange = ({
    highlightedIndex,
  }: UseComboboxStateChange<T> | UseSelectStateChange<T>) => {
    if (selectedItem && highlightedIndex === -1) {
      setHighlightedIndex(getIndexToHighlight(items, selectedItem));
    } else {
      setHighlightedIndex(highlightedIndex);
    }
  };

  return {
    highlightedIndex,
    onHighlightedIndexChange: handleHighlightedIndexChange,
  };
}

function getIndexToHighlight<T extends Option>(
  items: T[],
  selectedItem: T
): number {
  if (typeof selectedItem === "string") {
    return items.findIndex((item) => item.value === selectedItem);
  }

  return items.findIndex((item) => item.value === selectedItem?.value);
}
