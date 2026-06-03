import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import useDebounce from "@dashboard/hooks/useDebounce";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages, commonMessages } from "@dashboard/intl";
import { FetchMoreProps } from "@dashboard/types";
import { Button, DynamicCombobox, Option } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
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
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const debouncedFetch = useDebounce(fetchPageTypes, 500);

  useModalDialogOpen(open, {
    onClose: () => {
      setSelectedOption(null);
      fetchPageTypes("");
    },
  });

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header>
          <FormattedMessage {...messages.selectPageType} />
        </DashboardModal.Header>

        <DynamicCombobox
          name="pageType"
          label={intl.formatMessage(messages.pageType)}
          options={pageTypes ?? []}
          value={selectedOption}
          onChange={setSelectedOption}
          onInputValueChange={debouncedFetch}
          onFocus={() => fetchPageTypes("")}
          onScrollEnd={() => {
            if (fetchMorePageTypes?.hasMore) {
              fetchMorePageTypes.onFetchMore();
            }
          }}
          loading={fetchMorePageTypes?.loading || fetchMorePageTypes?.hasMore}
          locale={{
            loadingText: intl.formatMessage(commonMessages.loading),
          }}
          data-test-id="dialog-page-type"
          size="small"
        />

        <DashboardModal.Actions>
          <Button onClick={onClose} variant="secondary">
            {intl.formatMessage(buttonMessages.back)}
          </Button>

          <ConfirmButton
            data-test-id="confirm-button"
            transitionState={confirmButtonState}
            onClick={() => (selectedOption ? onConfirm(selectedOption.value) : null)}
            disabled={!selectedOption}
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
