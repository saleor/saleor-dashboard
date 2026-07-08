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

  const openEditValueDialog = useCallback(
    (id: string) => {
      setValueErrors([]);
      setEditingValueIndex(parseInt(id, 10) + pageInfo.startCursor);
      setValueDialog("edit-value");
    },
    [pageInfo.startCursor],
  );

  const openRemoveValueDialog = useCallback(
    (id: string) => {
      setEditingValueIndex(parseInt(id, 10) + pageInfo.startCursor);
      setValueDialog("remove-value");
    },
    [pageInfo.startCursor],
  );

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

  const handleValueCreate = useCallback(
    (input: AttributeValueEditDialogFormData) => {
      if (isSelected(input, values, areValuesEqual)) {
        setValueErrors([attributeValueAlreadyExistsError]);

        return false;
      }

      const newValues = add(input, values);

      setValues(newValues);
      setValueErrors([]);

      const addedToNotVisibleLastPage =
        newValues.length - pageInfo.startCursor > settings.rowNumber;

      if (addedToNotVisibleLastPage) {
        loadPage(getMaxPage(newValues.length, settings.rowNumber));
      }

      if (valueDialog) {
        closeValueDialog();
      }

      return true;
    },
    [closeValueDialog, loadPage, pageInfo.startCursor, settings.rowNumber, valueDialog, values],
  );

  const deleteValueById = useCallback(
    (id: string) => {
      const index = parseInt(id, 10) + pageInfo.startCursor;

      setValues(remove(values[index], values, areValuesEqual));
    },
    [pageInfo.startCursor, values],
  );

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
    editingValueIndex,
    handleValueCreate,
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
