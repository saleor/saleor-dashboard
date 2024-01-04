import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import Savebar from "@dashboard/components/Savebar";
import React from "react";
import { useFormContext } from "react-hook-form";

interface DiscountSavebarProps {
  disabled: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  onDelete: () => void;
  submitButtonState: ConfirmButtonTransitionState;
}

export const DiscountSavebar = ({
  disabled,
  onSubmit,
  onDelete,
  onCancel,
  submitButtonState,
}: DiscountSavebarProps) => {
  const { formState } = useFormContext();
  const { isDirty } = formState;

  return (
    <Savebar
      disabled={disabled}
      onCancel={onCancel}
      onSubmit={isDirty ? onSubmit : () => {}}
      onDelete={onDelete}
      state={submitButtonState}
    />
  );
};
