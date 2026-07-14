import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import useChoiceSearch from "@dashboard/hooks/useChoiceSearch";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { DynamicCombobox, type Option } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";

interface ChannelPickerDialogProps {
  channelsChoices: Option[];
  confirmButtonState: ConfirmButtonTransitionState;
  defaultChoice: string;
  open: boolean;
  onClose: () => void;
  onConfirm: (choice: string) => void;
}

export const ChannelPickerDialog = ({
  channelsChoices = [],
  confirmButtonState,
  defaultChoice,
  open,
  onClose,
  onConfirm,
}: ChannelPickerDialogProps) => {
  const intl = useIntl();
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const { result, search } = useChoiceSearch(channelsChoices);
  const isSubmitting = confirmButtonState === "loading";

  useModalDialogOpen(open, {
    onClose: () => {
      search("");

      const defaultOption = channelsChoices.find(c => c.value === defaultChoice) ?? null;

      setSelectedOption(defaultOption);
    },
  });

  const handleClose = (): void => {
    if (isSubmitting) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={open}>
      <DashboardModal.Content size="picker">
        <DashboardModal.PickerHeader>
          <FormattedMessage {...messages.selectChannel} />
        </DashboardModal.PickerHeader>

        <DashboardModal.Body fill>
          <DashboardModal.Inset>
            <DynamicCombobox
              data-test-id="channel-autocomplete"
              disabled={isSubmitting}
              label={intl.formatMessage(messages.channelName)}
              options={result}
              onInputValueChange={search}
              name="channel-autocomplete"
              size="small"
              value={selectedOption}
              onChange={setSelectedOption}
            />
          </DashboardModal.Inset>
        </DashboardModal.Body>

        <DashboardModal.Actions>
          <BackButton disabled={isSubmitting} onClick={handleClose} />
          <ConfirmButton
            data-test-id="submit"
            disabled={isSubmitting || !selectedOption?.value}
            onClick={() => onConfirm(selectedOption?.value ?? "")}
            transitionState={confirmButtonState}
          >
            <FormattedMessage {...buttonMessages.confirm} />
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

ChannelPickerDialog.displayName = "ChannelPickerDialog";
