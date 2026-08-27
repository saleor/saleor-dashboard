import {
  useCombobox,
  type UseComboboxReturnValue,
  type UseComboboxState,
  type UseComboboxStateChangeTypes,
} from "downshift";
import { type KeyboardEvent, useEffect } from "react";

import { type VariantReferenceFields } from "../API/variantReferenceOption";
import { type RightOperatorOption } from "./types";

export type VariantReferenceListItem = RightOperatorOption & VariantReferenceFields;

const LIST_NAV_KEYS = new Set(["ArrowDown", "ArrowUp", "Enter", "Home", "End"]);

export const getVariantReferenceOptionId = (controlId: string, optionValue: string): string =>
  `${controlId}-option-${optionValue}`;

export const isVariantReferenceMenuOpen = (event: KeyboardEvent): boolean => {
  const target = event.target;

  if (!(target instanceof Element)) {
    return false;
  }

  const combobox = target.closest("[role='combobox']");

  return combobox?.getAttribute("aria-expanded") === "true";
};

const keepMenuOpenOnToggle = <Item>(
  state: UseComboboxState<Item>,
  type: UseComboboxStateChangeTypes,
  changes: Partial<UseComboboxState<Item>>,
): Partial<UseComboboxState<Item>> => {
  if (
    type === useCombobox.stateChangeTypes.InputKeyDownEnter ||
    type === useCombobox.stateChangeTypes.ItemClick
  ) {
    return {
      ...changes,
      isOpen: true,
      highlightedIndex: state.highlightedIndex,
      inputValue: state.inputValue,
    };
  }

  if (
    type === useCombobox.stateChangeTypes.InputKeyDownEscape ||
    type === useCombobox.stateChangeTypes.InputBlur
  ) {
    return { ...state, isOpen: true };
  }

  return { ...changes, isOpen: true };
};

interface UseVariantReferenceComboboxProps {
  items: VariantReferenceListItem[];
  controlId: string;
  menuId: string;
  onToggle: (item: VariantReferenceListItem) => void;
}

type VariantReferenceCombobox = Pick<
  UseComboboxReturnValue<VariantReferenceListItem>,
  "highlightedIndex" | "getMenuProps" | "getItemProps"
> & {
  handleKeyDownCapture: (event: KeyboardEvent) => void;
};

export const useVariantReferenceCombobox = ({
  items,
  controlId,
  menuId,
  onToggle,
}: UseVariantReferenceComboboxProps): VariantReferenceCombobox => {
  const { highlightedIndex, getMenuProps, getItemProps, getInputProps, setHighlightedIndex } =
    useCombobox({
      items,
      isOpen: true,
      defaultHighlightedIndex: 0,
      selectedItem: null,
      itemToString: item => item?.variantName ?? "",
      menuId,
      inputId: controlId,
      getItemId: index =>
        getVariantReferenceOptionId(controlId, items[index]?.value ?? String(index)),
      getA11yStatusMessage: () => "",
      getA11ySelectionMessage: () => "",
      circularNavigation: true,
      stateReducer: (state, { type, changes }) => keepMenuOpenOnToggle(state, type, changes),
      onStateChange: ({ type, selectedItem }) => {
        if (
          selectedItem &&
          (type === useCombobox.stateChangeTypes.InputKeyDownEnter ||
            type === useCombobox.stateChangeTypes.ItemClick)
        ) {
          onToggle(selectedItem);
        }
      },
    });

  useEffect(
    function clampHighlightToVisibleItems() {
      if (items.length === 0) {
        if (highlightedIndex !== -1) {
          setHighlightedIndex(-1);
        }

        return;
      }

      if (highlightedIndex >= items.length) {
        setHighlightedIndex(0);
      }
    },
    [highlightedIndex, items.length, setHighlightedIndex],
  );

  const { onKeyDown: downshiftKeyDown } = getInputProps({}, { suppressRefError: true });
  const handleKeyDownCapture = (event: KeyboardEvent): void => {
    if (!LIST_NAV_KEYS.has(event.key) || !isVariantReferenceMenuOpen(event)) {
      return;
    }

    downshiftKeyDown?.(event);
  };

  return {
    highlightedIndex,
    getMenuProps,
    getItemProps,
    handleKeyDownCapture,
  };
};
