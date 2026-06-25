import { type ChannelsAction } from "@dashboard/channels/urls";
import { type Channel, sortChannelShippingDataByName } from "@dashboard/channels/utils";
import { useExitFormDialog, type WithFormId } from "@dashboard/components/Form";
import useListActions from "@dashboard/hooks/useListActions";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import isEqual from "lodash/isEqual";

interface Modal {
  openModal: (action: ChannelsAction) => void;
  closeModal: () => void;
}

function useChannels<T extends Channel, A>(
  channels: T[],
  action: A | ChannelsAction,
  { closeModal, openModal }: Modal,
  opts: WithFormId,
) {
  const { formId } = opts;
  const { setIsDirty } = useExitFormDialog({
    formId,
  });
  const [currentChannels, setCurrentChannels] = useStateFromProps(channels);
  const {
    isSelected: isChannelSelected,
    listElements: channelListElements,
    set: setChannels,
    toggle: channelsToggle,
  } = useListActions<T>(currentChannels, (a, b) => a.id === b.id);
  const handleChannelsModalClose = () => {
    closeModal();
    setChannels(currentChannels);
  };
  const handleChannelsModalOpen = () => openModal("open-channels-picker");
  const handleChannelsConfirm = () => {
    const nextChannels = sortChannelShippingDataByName(channelListElements);

    if (!isEqual(currentChannels, nextChannels)) {
      setCurrentChannels(nextChannels);
      // hack so channels also update exit form dialog provider
      // despite not setting page's form data "changed" prop
      setIsDirty(true);
    }

    closeModal();
  };
  const toggleAllChannels = (items: T[], selected: number) => {
    if (selected !== items.length) {
      setChannels(items);
    } else {
      setChannels([]);
    }
  };

  return {
    channelListElements,
    channelsToggle,
    currentChannels,
    handleChannelsConfirm,
    handleChannelsModalClose,
    handleChannelsModalOpen,
    isChannelSelected,
    isChannelsModalOpen: action === "open-channels-picker",
    setCurrentChannels,
    toggleAllChannels,
  };
}

export default useChannels;
