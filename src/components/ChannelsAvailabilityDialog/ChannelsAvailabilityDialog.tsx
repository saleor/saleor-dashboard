import { Channel } from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import { ChannelsAvailabilityContent } from "@saleor/components/ChannelsAvailabilityContent";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import React from "react";

export interface ChannelsAvailabilityDialogProps {
  isSelected: (option: Channel) => boolean;
  channels: Channel[];
  confirmButtonState: ConfirmButtonTransitionState;
  contentType?: string;
  disabled: boolean;
  open: boolean;
  onClose: () => void;
  onChange: (option: Channel) => void;
  onConfirm: () => void;
  selected?: number;
  title: string;
  toggleAll?: (items: Channel[], selected: number) => void;
}

export const ChannelsAvailabilityDialog: React.FC<ChannelsAvailabilityDialogProps> = ({
  isSelected,
  channels,
  confirmButtonState,
  contentType = "",
  disabled,
  open,
  onClose,
  onChange,
  onConfirm,
  selected = 0,
  title,
  toggleAll
}) => (
  <ActionDialog
    confirmButtonState={confirmButtonState}
    open={open}
    onClose={onClose}
    onConfirm={onConfirm}
    title={title}
    disabled={disabled}
  >
    <ChannelsAvailabilityContent
      channels={channels}
      disabled={disabled}
      contentType={contentType}
      isSelected={isSelected}
      selected={selected}
      toggleAll={toggleAll}
      onChange={onChange}
    />
  </ActionDialog>
);
ChannelsAvailabilityDialog.displayName = "ChannelsAvailabilityDialog";
export default ChannelsAvailabilityDialog;
