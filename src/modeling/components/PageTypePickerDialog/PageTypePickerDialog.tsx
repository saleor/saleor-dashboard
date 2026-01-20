import { ConfirmButton, ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import useDebounce from "@dashboard/hooks/useDebounce";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { FetchMoreProps } from "@dashboard/types";
import { Button, DynamicCombobox, Option } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface PageTypePickerDialogProps {
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  pageTypes: Option[];
  fetchPageTypes: (data: string) => void;
  fetchMorePageTypes: FetchMoreProps;
  onClose: () => void;
  onConfirm: (choice: string) => void;
}

const PageTypePickerDialog = ({
  confirmButtonState,
  open,
  pageTypes,
  fetchPageTypes,
  fetchMorePageTypes,
  onClose,
  onConfirm,
}: PageTypePickerDialogProps) => {
  const intl = useIntl();
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const debouncedFetchPageTypes = useDebounce(fetchPageTypes, 500);

  useModalDialogOpen(open, {
    onClose: () => {
      setSelectedOption(null);
      fetchPageTypes("");
    },
  });

  const handleScrollEnd = () => {
    if (fetchMorePageTypes?.hasMore) {
      fetchMorePageTypes?.onFetchMore();
    }
  };

  return (
    <DashboardModal open={open} onChange={onClose}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header>
          <FormattedMessage {...messages.selectPageType} />
        </DashboardModal.Header>

        <DynamicCombobox
          name="pageType"
          label={intl.formatMessage(messages.pageType)}
          options={pageTypes}
          size="small"
          value={selectedOption}
          onChange={setSelectedOption}
          onInputValueChange={debouncedFetchPageTypes}
          onFocus={() => fetchPageTypes("")}
          data-test-id="dialog-page-type"
          onScrollEnd={handleScrollEnd}
          loading={fetchMorePageTypes?.loading}
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
