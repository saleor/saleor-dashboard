import ActionDialog from "@dashboard/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import useChoiceSearch from "@dashboard/hooks/useChoiceSearch";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { DynamicCombobox, Option } from "@saleor/macaw-ui-next";
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
}

const ChannelPickerDialog = ({
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

  useModalDialogOpen(open, {
    onClose: () => {
      search("");

      const defaultOption = channelsChoices.find(c => c.value === defaultChoice) ?? null;

      setSelectedOption(defaultOption);
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
        onInputValueChange={search}
        name="channel-autocomplete"
        size="small"
        value={selectedOption}
        onChange={setSelectedOption}
      />
    </ActionDialog>
  );
};

ChannelPickerDialog.displayName = "ChannelPickerDialog";
export default ChannelPickerDialog;
