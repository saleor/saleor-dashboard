import ActionDialog from "@dashboard/components/ActionDialog";
import { Combobox } from "@dashboard/components/Combobox";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import useChoiceSearch from "@dashboard/hooks/useChoiceSearch";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { Option } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

interface ChannelPickerDialogProps {
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
  const [choice, setChoice] = useState("");
  const { result, search } = useChoiceSearch(channelsChoices);

  useModalDialogOpen(open, {
    onClose: () => {
      search("");
      setChoice(defaultChoice);
    },
  });

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={() => onConfirm(choice)}
      title={intl.formatMessage(messages.selectChannel)}
      size="xs"
    >
      <Combobox
        data-test-id="channel-autocomplete"
        label={intl.formatMessage(messages.channelName)}
        options={result}
        fetchOptions={search}
        name="channel-autocomplete"
        value={{
          value: choice,
          label: result.find(res => res.value === choice)?.label ?? choice,
        }}
        onChange={e => setChoice(e.target.value)}
      />
    </ActionDialog>
  );
};

ChannelPickerDialog.displayName = "ChannelPickerDialog";
export default ChannelPickerDialog;
