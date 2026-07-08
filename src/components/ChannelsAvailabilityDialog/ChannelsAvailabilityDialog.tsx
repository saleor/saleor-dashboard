import { type Channel } from "@dashboard/channels/utils";
import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import useModalDialogOpen from "@dashboard/hooks/useModalDialogOpen";
import { buttonMessages } from "@dashboard/intl";
import { Box, Text } from "@saleor/macaw-ui-next";
import type { ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import ChannelsAvailabilityDialogChannelsList from "../ChannelsAvailabilityDialogChannelsList";
import listStyles from "../ChannelsAvailabilityDialogChannelsList/ChannelsAvailabilityDialogChannelsList.module.css";
import { channelsAvailabilityDialogWrapperMessages } from "../ChannelsAvailabilityDialogWrapper/ChannelsAvailabilityDialogWrapper";
import { ChannelsAvailabilitySearchField } from "./ChannelsAvailabilitySearchField";
import { ChannelsAvailabilitySelectAll } from "./ChannelsAvailabilitySelectAll";
import { NoChannels } from "./NoChannels";
import { useChannelsSelectAll } from "./useChannelsSelectAll";
import { useChannelsSearch } from "./utils";

interface ChannelsAvailabilityDialogProps {
  isSelected: (option: Channel) => boolean;
  channels: Channel[];
  confirmButtonState: ConfirmButtonTransitionState;
  contentType?: string;
  description?: ReactNode;
  disabled?: boolean;
  open: boolean;
  onClose: () => void;
  onChange: (option: Channel) => void;
  onConfirm: () => void;
  selected?: number;
  hasSelectionChanged?: boolean;
  title: string;
  toggleAll?: (items: Channel[], selected: number) => void;
}

const ChannelsAvailabilityDialog = ({
  isSelected,
  channels,
  confirmButtonState,
  contentType,
  description,
  disabled,
  open,
  onClose,
  onChange,
  onConfirm,
  selected,
  hasSelectionChanged,
  title,
  toggleAll,
}: ChannelsAvailabilityDialogProps) => {
  const intl = useIntl();
  const { query, onQueryChange, resetQuery, filteredChannels } = useChannelsSearch(channels);
  const hasChannels = channels.length > 0;

  useModalDialogOpen(open, {
    onClose: resetQuery,
  });

  const showToggleAll = hasChannels && !!toggleAll;
  const { hasAllVisibleSelected, handleToggleAll, isSearchActive } = useChannelsSelectAll({
    channels,
    filteredChannels,
    query,
    isSelected,
    onChange,
    selected,
    toggleAll,
  });
  const confirmButtonLabel =
    typeof selected === "number"
      ? intl.formatMessage(channelsAvailabilityDialogWrapperMessages.confirmCountedButton, {
          count: selected,
        })
      : intl.formatMessage(buttonMessages.confirm);

  return (
    <DashboardModal onChange={onClose} open={open}>
      <DashboardModal.Content size="picker">
        <DashboardModal.PickerHeader
          description={description}
          toolbar={
            hasChannels ? (
              <Box display="flex" flexDirection="column" gap={2}>
                <ChannelsAvailabilitySearchField query={query} onQueryChange={onQueryChange} />
                {showToggleAll ? (
                  <ChannelsAvailabilitySelectAll
                    checked={hasAllVisibleSelected}
                    inPickerToolbar
                    isSearchActive={isSearchActive}
                    onToggle={handleToggleAll}
                  />
                ) : null}
              </Box>
            ) : undefined
          }
        >
          {title}
        </DashboardModal.PickerHeader>

        {hasChannels ? (
          <DashboardModal.Body
            fill
            data-test-id="manage-products-channels-availiability-list"
            __overflowX="hidden"
          >
            {contentType ? (
              <Text className={listStyles.contentType} size={2} fontWeight="light">
                <FormattedMessage
                  {...channelsAvailabilityDialogWrapperMessages.selectTitle}
                  values={{ contentType }}
                />
              </Text>
            ) : null}
            {filteredChannels.length ? (
              <ChannelsAvailabilityDialogChannelsList
                channels={filteredChannels}
                isChannelSelected={isSelected}
                onChange={onChange}
              />
            ) : (
              <div className={listStyles.empty}>
                <FormattedMessage {...channelsAvailabilityDialogWrapperMessages.notFoundTitle} />
              </div>
            )}
          </DashboardModal.Body>
        ) : (
          <DashboardModal.Body>
            <div className={listStyles.empty}>
              <NoChannels />
            </div>
          </DashboardModal.Body>
        )}

        <DashboardModal.Actions>
          <BackButton onClick={onClose} />
          <ConfirmButton
            transitionState={confirmButtonState}
            disabled={disabled || hasSelectionChanged === false}
            onClick={onConfirm}
            data-test-id="submit"
          >
            {confirmButtonLabel}
          </ConfirmButton>
        </DashboardModal.Actions>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

export default ChannelsAvailabilityDialog;
