import { AttributeErrorCode, type AttributeErrorFragment } from "@dashboard/graphql";
import useListSettings from "@dashboard/hooks/useListSettings";
import useLocalPageInfo, { getMaxPage } from "@dashboard/hooks/useLocalPageInfo";
import { ListViews, type ReorderEvent } from "@dashboard/types";
import { add, isSelected, move, remove, updateAtIndex } from "@dashboard/utils/lists";
import { useCallback, useState } from "react";

import { type AttributeValueEditDialogFormData } from "../../utils/data";

const attributeValueAlreadyExistsError: AttributeErrorFragment = {
  __typename: "AttributeError",
  code: AttributeErrorCode.ALREADY_EXISTS,
  field: "name",
  message: "",
};

function areValuesEqual(a: AttributeValueEditDialogFormData, b: AttributeValueEditDialogFormData) {
  return a.name === b.name;
}

export type AttributeCreateValueDialog = "add-value" | "edit-value" | "remove-value" | null;

interface UseAttributeCreateValuesOptions {
  onDialogClose?: () => void;
}

export const useAttributeCreateValues = ({
  onDialogClose,
}: UseAttributeCreateValuesOptions = {}) => {
  const [values, setValues] = useState<AttributeValueEditDialogFormData[]>([]);
  const [valueErrors, setValueErrors] = useState<AttributeErrorFragment[]>([]);
  const [valueDialog, setValueDialog] = useState<AttributeCreateValueDialog>(null);
  const [editingValueIndex, setEditingValueIndex] = useState<number | undefined>(undefined);
  const { updateListSettings, settings } = useListSettings(ListViews.ATTRIBUTE_VALUE_LIST);
  const { pageInfo, pageValues, loadNextPage, loadPreviousPage, loadPage } = useLocalPageInfo(
    values,
    settings?.rowNumber,
  );

  const resetValues = useCallback(() => {
    setValues([]);
    setValueErrors([]);
    setValueDialog(null);
    setEditingValueIndex(undefined);
  }, []);

  const openAddValueDialog = useCallback(() => {
    setValueErrors([]);
    setEditingValueIndex(undefined);
    setValueDialog("add-value");
  }, []);

  const openEditValueDialog = useCallback((id: string) => {
    setValueErrors([]);
    setEditingValueIndex(parseInt(id, 10));
    setValueDialog("edit-value");
  }, []);

  const openRemoveValueDialog = useCallback((id: string) => {
    setEditingValueIndex(parseInt(id, 10));
    setValueDialog("remove-value");
  }, []);

  const closeValueDialog = useCallback(() => {
    setValueDialog(null);
    onDialogClose?.();
  }, [onDialogClose]);

  const handleValueDelete = useCallback(() => {
    if (editingValueIndex !== undefined) {
      setValues(remove(values[editingValueIndex], values, areValuesEqual));
    }

    closeValueDialog();
  }, [closeValueDialog, editingValueIndex, values]);

  const handleValueUpdate = useCallback(
    (input: AttributeValueEditDialogFormData) => {
      if (isSelected(input, values, areValuesEqual)) {
        setValueErrors([attributeValueAlreadyExistsError]);
      } else if (editingValueIndex !== undefined) {
        setValues(updateAtIndex(input, values, editingValueIndex));
        closeValueDialog();
      }
    },
    [closeValueDialog, editingValueIndex, values],
  );

  const appendCreatedValues = useCallback(
    (inputs: AttributeValueEditDialogFormData[]): boolean => {
      let next = values;
      let addedCount = 0;
      let hadDuplicate = false;

      inputs.forEach(input => {
        const name = input.name.trim();

        if (!name) {
          return;
        }

        const item: AttributeValueEditDialogFormData = { ...input, name };

        if (isSelected(item, next, areValuesEqual)) {
          hadDuplicate = true;

          return;
        }

        next = add(item, next);
        addedCount += 1;
      });

      if (addedCount === 0) {
        if (hadDuplicate) {
          setValueErrors([attributeValueAlreadyExistsError]);
        }

        return false;
      }

      setValues(next);
      setValueErrors([]);

      const addedToNotVisibleLastPage = next.length - pageInfo.startCursor > settings.rowNumber;

      if (addedToNotVisibleLastPage) {
        loadPage(getMaxPage(next.length, settings.rowNumber));
      }

      if (valueDialog) {
        closeValueDialog();
      }

      return true;
    },
    [closeValueDialog, loadPage, pageInfo.startCursor, settings.rowNumber, valueDialog, values],
  );

  const handleValueCreate = useCallback(
    (input: AttributeValueEditDialogFormData) => appendCreatedValues([input]),
    [appendCreatedValues],
  );

  const handleValueCreateMany = useCallback(
    (inputs: AttributeValueEditDialogFormData[]) => appendCreatedValues(inputs),
    [appendCreatedValues],
  );

  const deleteValueById = useCallback((id: string) => {
    const index = parseInt(id, 10);

    setValues(current => remove(current[index], current, areValuesEqual));
  }, []);

  const deleteValuesByIds = useCallback((ids: string[]) => {
    const indexes = new Set(ids.map(valueId => parseInt(valueId, 10)));

    setValues(current => current.filter((_, index) => !indexes.has(index)));
  }, []);

  const handleValueReorder = useCallback(
    ({ newIndex, oldIndex }: ReorderEvent) =>
      setValues(
        move(
          values[pageInfo.startCursor + oldIndex],
          values,
          areValuesEqual,
          pageInfo.startCursor + newIndex,
        ),
      ),
    [pageInfo.startCursor, values],
  );

  return {
    closeValueDialog,
    deleteValueById,
    deleteValuesByIds,
    editingValueIndex,
    handleValueCreate,
    handleValueCreateMany,
    handleValueDelete,
    handleValueReorder,
    handleValueUpdate,
    openAddValueDialog,
    openEditValueDialog,
    openRemoveValueDialog,
    pageInfo,
    pageValues,
    loadNextPage,
    loadPreviousPage,
    resetValues,
    settings,
    updateListSettings,
    valueDialog,
    valueErrors,
    values,
  };
};
