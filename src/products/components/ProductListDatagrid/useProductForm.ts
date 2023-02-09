import {
  DatagridChangeOpts,
  useDatagridChangeState,
} from "@dashboard/components/Datagrid/useDatagridChange";
import { SubmitFn, useExitFormDialog } from "@dashboard/components/Form";
import { useEffect, useRef, useState } from "react";

export const PRODUCT_FORM_ID = Symbol();

export const useProductForm = () => {
  const [isDirty, setIsDirty] = useState(false);
  const datagrid = useDatagridChangeState();

  const {
    setIsDirty: setIsExitFormDirty,
    setEnableExitDialog,
    setExitDialogSubmitRef,
  } = useExitFormDialog({
    formId: PRODUCT_FORM_ID,
    isDisabled: false,
  });

  const products = useRef<DatagridChangeOpts>({
    added: [],
    removed: [],
    updates: [],
  });

  const setExitDialogData = () => {
    setEnableExitDialog(true);
    setExitDialogSubmitRef(handleSubmit);
  };

  useEffect(setExitDialogData, [setEnableExitDialog, setExitDialogSubmitRef]);

  const handleChange = (data: DatagridChangeOpts) => {
    products.current = data;
    setIsExitFormDirty(true);
    setIsDirty(true);
  };

  const handleSubmit: SubmitFn = async () => {
    // console.log("Handle submit");
  };

  const handleClear = () => {
    datagrid.clear();
    setIsDirty(false);
    setIsExitFormDirty(false);
  };

  return {
    datagrid,
    onChange: handleChange,
    onSubmit: handleSubmit,
    clear: handleClear,
    isDirty,
  };
};
