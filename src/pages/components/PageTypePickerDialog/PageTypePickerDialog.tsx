import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType,
} from "@dashboard/components/SingleAutocompleteSelectField";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { FetchMoreProps } from "@dashboard/types";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

export interface PageTypePickerDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  pageTypes?: SingleAutocompleteChoiceType[];
  fetchPageTypes: (data: string) => void;
  fetchMorePageTypes: FetchMoreProps;
  onClose: () => void;
  onConfirm: (choice: string) => void;
}

const PageTypePickerDialog: React.FC<PageTypePickerDialogProps> = ({
  confirmButtonState,
  open,
  pageTypes,
  fetchPageTypes,
  fetchMorePageTypes,
  onClose,
  onConfirm,
}) => {
  const intl = useIntl();
  const [choice, setChoice] = useStateFromProps("");
  const pageTypeDisplayValue = pageTypes.find(
    pageType => pageType.value === choice,
  )?.label;

  useModalDialogOpen(open, {
    onClose: () => {
      setChoice("");
      fetchPageTypes("");
    },
  });

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={() => onConfirm(choice)}
      title={intl.formatMessage(messages.selectPageType)}
      disabled={!choice}
    >
      <SingleAutocompleteSelectField
        displayValue={pageTypeDisplayValue}
        name="pageType"
        label={intl.formatMessage(messages.pageType)}
        choices={pageTypes}
        value={choice}
        onChange={e => setChoice(e.target.value)}
        fetchChoices={fetchPageTypes}
        data-test-id="dialog-page-type"
        {...fetchMorePageTypes}
      />
    </ActionDialog>
  );
};
PageTypePickerDialog.displayName = "PageTypePickerDialog";
export default PageTypePickerDialog;
