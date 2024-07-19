import ActionDialog from "@dashboard/components/ActionDialog";
import { Combobox } from "@dashboard/components/Combobox";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { Choice } from "@dashboard/components/SingleSelectField";
import useChoiceSearch from "@dashboard/hooks/useChoiceSearch";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import React from "react";
import { useIntl } from "react-intl";

import { messages } from "./messages";

export interface ChannelPickerDialogProps {
  channelsChoices: Array<Choice<string, string>>;
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
  const [choice, setChoice] = useStateFromProps(
    defaultChoice || (channelsChoices.length ? channelsChoices[0].value : ""),
  );
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
