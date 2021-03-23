import { Channel } from "@saleor/channels/utils";
import ActionDialog from "@saleor/components/ActionDialog";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import { filter } from "fuzzaldrin";
import React from "react";

import ChannelsAvailabilityContent from "../ChannelsAvailabilityContent";
import ChannelsAvailabilityContentWrapper from "../ChannelsAvailabilityContent/ChannelsAvailabilityContentWrapper";

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
  contentType,
  disabled,
  open,
  onClose,
  onChange,
  onConfirm,
  selected,
  title,
  toggleAll
}) => {
  const [query, onQueryChange] = React.useState("");
  const filteredChannels = filter(channels, query, { key: "name" });

  const handleToggleAll = () => toggleAll(channels, selected);

  const hasAllSelected = selected === channels.length;

  return (
    <ActionDialog
      confirmButtonState={confirmButtonState}
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title={title}
      disabled={disabled}
    >
      <ChannelsAvailabilityContentWrapper
        hasAnyChannelsToDisplay={!!filteredChannels.length}
        hasAllSelected={hasAllSelected}
        query={query}
        onQueryChange={onQueryChange}
        toggleAll={handleToggleAll}
        contentType={contentType}
        disabled={disabled}
      >
        <ChannelsAvailabilityContent
          filteredChannels={filteredChannels}
          isChannelSelected={isSelected}
          onChange={onChange}
        />
      </ChannelsAvailabilityContentWrapper>
    </ActionDialog>
  );
};

export default ChannelsAvailabilityDialog;
