import makeStyles from "@material-ui/core/styles/makeStyles";
import { ChannelData, ChannelShippingData } from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { ControlledCheckbox } from "@saleor/components/ControlledCheckbox";
import React from "react";

const useStyles = makeStyles(
  theme => ({
    dialog: {
      marginBottom: theme.spacing(2),
      marginTop: theme.spacing(2)
    }
  }),
  { name: "ChannelsAvailabilityDialog" }
);

type ChannelOption = ChannelData | ChannelShippingData;

export interface ChannelsAvailabilityDialogProps {
  isSelected: (option: ChannelOption) => boolean;
  channels: ChannelOption[];
  confirmButtonState: ConfirmButtonTransitionState;
  disabled: boolean;
  open: boolean;
  onClose: () => void;
  onChange: (option: ChannelOption) => void;
  onConfirm: () => void;
  title: string;
}

export const ChannelsAvailabilityDialog: React.FC<ChannelsAvailabilityDialogProps> = ({
  isSelected,
  channels,
  confirmButtonState,
  disabled,
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
      disabled={disabled}
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
