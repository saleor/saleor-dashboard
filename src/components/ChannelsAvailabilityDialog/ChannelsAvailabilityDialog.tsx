import { ChannelData } from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import React from "react";

import { useStyles } from "./styles";

export interface ChannelsAvailabilityDialogProps {
  isSelected: (option: ChannelData) => boolean;
  channels: ChannelData[];
  confirmButtonState: ConfirmButtonTransitionState;
  open: boolean;
  onClose: () => void;
  onChange: (option: ChannelData) => void;
  onConfirm: () => void;
  title: string;
}

export const ChannelsAvailabilityDialog: React.FC<ChannelsAvailabilityDialogProps> = ({
  isSelected,
  channels,
  confirmButtonState,
  open,
  onClose,
  onChange,
  onConfirm,
  title
}) => {
  const classes = useStyles({});
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
          {channels.map(option => (
            <div key={option.id}>
              <ControlledCheckbox
                checked={isSelected(option)}
                name={option.name}
                label={option.name}
                onChange={() => onChange(option)}
              />
            </div>
          ))}
        </div>
      </div>
    </ActionDialog>
  );
};
ChannelsAvailabilityDialog.displayName = "ChannelsAvailabilityDialog";
export default ChannelsAvailabilityDialog;
