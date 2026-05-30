import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import useChoiceSearch from "@dashboard/hooks/useChoiceSearch";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { Button, DynamicCombobox, type Option } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

interface ChannelPickerDialogProps {
  channelsChoices: Option[];
  confirmButtonState: ConfirmButtonTransitionState;
  defaultChoice: string;
  open: boolean;
  onClose: () => void;
  onConfirm: (choice: string) => void;
  // Optional secondary action — renders a "Bulk order" button beside Confirm.
  // The currently-selected channel id is forwarded so the caller can open a
  // bulk import dialog scoped to that channel.
  onBulkOrder?: (choice: string) => void;
}

const ChannelPickerDialog = ({
  channelsChoices = [],
  confirmButtonState,
  defaultChoice,
  open,
  onClose,
  onConfirm,
  onBulkOrder,
}: ChannelPickerDialogProps) => {
  const intl = useIntl();
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const { result, search } = useChoiceSearch(channelsChoices);

  useModalDialogOpen(open, {
    onClose: () => {
      search("");

      const defaultOption = channelsChoices.find(c => c.value === defaultChoice) ?? null;

      setSelectedOption(defaultOption);
    },
  });

  const selectedValue = selectedOption?.value ?? "";

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="xs">
        <DashboardModal.Header>{intl.formatMessage(messages.selectChannel)}</DashboardModal.Header>
        <DynamicCombobox
          data-test-id="channel-autocomplete"
          label={intl.formatMessage(messages.channelName)}
          options={result}
          onInputValueChange={search}
          name="channel-autocomplete"
          size="small"
          value={selectedOption}
          onChange={setSelectedOption}
        />
        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          {onBulkOrder && (
            <Button
              variant="secondary"
              disabled={!selectedValue}
              onClick={() => onBulkOrder(selectedValue)}
              data-test-id="bulk-order"
            >
              {intl.formatMessage(messages.bulkOrder)}
            </Button>
          )}
          <ConfirmButton
            transitionState={confirmButtonState}
            onClick={() => onConfirm(selectedValue)}
            variant="primary"
            data-test-id="submit"
          >
            {intl.formatMessage(buttonMessages.confirm)}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ChannelPickerDialog.displayName = "ChannelPickerDialog";
export default ChannelPickerDialog;
