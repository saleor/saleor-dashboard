import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import useChoiceSearch from "@dashboard/hooks/useChoiceSearch";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { commonMessages } from "@dashboard/intl";
import { DynamicCombobox, Option } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

export interface ChannelPickerDialogProps {
  channelsChoices: Option[];
  confirmButtonState: ConfirmButtonTransitionState;
  defaultChoice: string;
  open: boolean;
  onClose: () => void;
  onConfirm: (choice: string) => void;
}

const ChannelPickerDialog: React.FC<ChannelPickerDialogProps> = ({
  channelsChoices = [],
  confirmButtonState,
  defaultChoice,
  open,
  onClose,
  onConfirm,
}) => {
  const intl = useIntl();
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const { result, search } = useChoiceSearch(channelsChoices);

  useModalDialogOpen(open, {
    onClose: () => {
      search("");

      const defaultOpt = channelsChoices.find(c => c.value === defaultChoice);

      setSelectedOption(defaultOpt ?? null);
    },
  });

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={() => onConfirm(selectedOption?.value ?? "")}
      title={intl.formatMessage(messages.selectChannel)}
      size="xs"
    >
      <DynamicCombobox
        data-test-id="channel-autocomplete"
        label={intl.formatMessage(messages.channelName)}
        options={result}
        name="channel-autocomplete"
        value={selectedOption}
        onChange={setSelectedOption}
        onInputValueChange={search}
        locale={{
          loadingText: intl.formatMessage(commonMessages.loading),
        }}
        size="small"
      />
    </ActionDialog>
  );
};

ChannelPickerDialog.displayName = "ChannelPickerDialog";
export default ChannelPickerDialog;
