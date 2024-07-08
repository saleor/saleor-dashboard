import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import useChoiceSearch from "@dashboard/hooks/useChoiceSearch";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { MenuItem } from "@material-ui/core";
import { Autocomplete } from "@saleor/macaw-ui";
import { Option } from "@saleor/macaw-ui-next";
import React from "react";
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
      <Autocomplete
        choices={result}
        fullWidth
        label={intl.formatMessage(messages.channelName)}
        data-test-id="channel-autocomplete"
        value={choice}
        onChange={e => setChoice(e.target.value)}
        onInputChange={search}
      >
        {({ getItemProps, highlightedIndex }) =>
          result.map((choice, choiceIndex) => (
            <MenuItem
              data-test-id="select-field-option"
              selected={highlightedIndex === choiceIndex}
              key={choice.value}
              {...getItemProps({ item: choice, index: choiceIndex })}
            >
              {choice.label}
            </MenuItem>
          ))
        }
      </Autocomplete>
    </ActionDialog>
  );
};

ChannelPickerDialog.displayName = "ChannelPickerDialog";
export default ChannelPickerDialog;
