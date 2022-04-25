import { MenuItem } from "@material-ui/core";
import ActionDialog from "@saleor/components/ActionDialog";
import { Choice } from "@saleor/components/SingleSelectField";
import useChoiceSearch from "@saleor/hooks/useChoiceSearch";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { Autocomplete, ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

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
  onConfirm
}) => {
  const intl = useIntl();
  const [choice, setChoice] = useStateFromProps(
    defaultChoice || (!!channelsChoices.length ? channelsChoices[0].value : "")
  );
  const { result, search } = useChoiceSearch(channelsChoices);

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={() => onConfirm(choice)}
      title={intl.formatMessage({
        defaultMessage: "Select a channel",
        description: "dialog header"
      })}
    >
      <Autocomplete
        choices={result}
        fullWidth
        label={intl.formatMessage({
          defaultMessage: "Channel name",
          description: "select label"
        })}
        value={choice}
        onChange={e => setChoice(e.target.value)}
        onInputChange={search}
      >
        {({ getItemProps, highlightedIndex }) =>
          result.map((choice, choiceIndex) => (
            <MenuItem
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
