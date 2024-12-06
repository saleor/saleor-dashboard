import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { Savebar } from "@dashboard/components/Savebar";
import useNotifier from "@dashboard/hooks/useNotifier";
import { commonMessages } from "@dashboard/intl";
import { useFormContext } from "react-hook-form";
import { useIntl } from "react-intl";

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
  const intl = useIntl();
  const notify = useNotifier();
  const { isDirty } = formState;
  const handleSubmit = () => {
    if (isDirty) {
      onSubmit();

      return;
    }

    // In case form has not been modified, on submit we redirect to discount list with success banner
    notify({
      status: "success",
      text: intl.formatMessage(commonMessages.savedChanges),
    });
  };

  return (
    <Savebar>
      <Savebar.DeleteButton onClick={onDelete} />
      <Savebar.Spacer />
      <Savebar.CancelButton onClick={onCancel} />
      <Savebar.ConfirmButton
        transitionState={submitButtonState}
        onClick={handleSubmit}
        disabled={disabled}
      />
    </Savebar>
  );
};
