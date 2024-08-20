import { Combobox } from "@dashboard/components/Combobox";
import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { buttonMessages } from "@dashboard/intl";
import { FetchMoreProps } from "@dashboard/types";
import { Button, Option } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

export interface PageTypePickerDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  pageTypes: Option[];
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
  const [choice, setChoice] = useStateFromProps(null);

  useModalDialogOpen(open, {
    onClose: () => {
      setChoice(null);
      fetchPageTypes("");
    },
  });

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Title>
          <FormattedMessage {...messages.selectPageType} />
        </DashboardModal.Title>

        <Combobox
          name="pageType"
          label={intl.formatMessage(messages.pageType)}
          options={pageTypes}
          value={choice}
          onChange={e => setChoice(e.target.value)}
          fetchOptions={fetchPageTypes}
          data-test-id="dialog-page-type"
          fetchMore={fetchMorePageTypes}
        />

        <DashboardModal.Actions>
          <Button onClick={onClose} variant="secondary">
            {intl.formatMessage(buttonMessages.back)}
          </Button>

          <ConfirmButton
            data-test-id="confirm-button"
            transitionState={confirmButtonState}
            onClick={() => (choice ? onConfirm(choice) : null)}
            disabled={!choice}
          >
            {intl.formatMessage(buttonMessages.confirm)}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

PageTypePickerDialog.displayName = "PageTypePickerDialog";
export default PageTypePickerDialog;
