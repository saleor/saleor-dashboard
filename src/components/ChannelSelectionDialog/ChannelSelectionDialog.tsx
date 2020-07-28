import { ChannelData } from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import React from "react";

import RadioGroupField, { RadioGroupFieldChoice } from "../RadioGroupField";
import { useStyles } from "./styles";

export interface ChannelSelectionDialogProps {
  isSelected: (option: ChannelData) => boolean;
  channels: ChannelData[];
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose: () => void;
  onChange: (option: ChannelData) => void;
  onConfirm: () => void;
  title: string;
}

export const ChannelSelectionDialog: React.FC<ChannelSelectionDialogProps> = ({
  channels,
  confirmButtonState,
  open,
  onClose,
  onChange,
  onConfirm,
  title
}) => {
  const classes = useStyles({});

  const choices: RadioGroupFieldChoice[] = channels.map(channel => ({
    label: channel.name,
    value: channel.id
  }));

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
    >
      <div>
        <div className={classes.dialog}>
          <RadioGroupField
            choices={choices}
            disabled={false}
            error={false}
            name={"channel"}
            value={undefined}
            onChange={(event: React.ChangeEvent<any>) =>
              onChange(event.target.value)
            }
          />
        </div>
      </div>
    </ActionDialog>
  );
};
ChannelSelectionDialog.displayName = "ChannelSelectionDialog";
export default ChannelSelectionDialog;
