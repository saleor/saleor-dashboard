import { SavebarCompositionHint } from "@dashboard/components/Savebar/SavebarCompositionHint";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import {
  type ChannelSaveComposition,
  EMPTY_CHANNEL_SAVE_COMPOSITION,
  hasChannelSaveComposition,
} from "./saveComposition";

interface ChannelSaveCompositionHintProps {
  composition?: ChannelSaveComposition | null;
}

export const ChannelSaveCompositionHint = ({
  composition = EMPTY_CHANNEL_SAVE_COMPOSITION,
}: ChannelSaveCompositionHintProps) => {
  const intl = useIntl();
  const resolved = composition ?? EMPTY_CHANNEL_SAVE_COMPOSITION;

  if (!hasChannelSaveComposition(resolved)) {
    return null;
  }

  const segments: string[] = [];

  if (resolved.hasGeneral) {
    segments.push(intl.formatMessage(messages.saveCompositionGeneral));
  }

  if (resolved.hasOrders) {
    segments.push(intl.formatMessage(messages.saveCompositionOrders));
  }

  if (resolved.hasPayments) {
    segments.push(intl.formatMessage(messages.saveCompositionPayments));
  }

  if (resolved.hasInventory) {
    segments.push(intl.formatMessage(messages.saveCompositionInventory));
  }

  if (resolved.hasDelivery) {
    segments.push(intl.formatMessage(messages.saveCompositionDelivery));
  }

  return <SavebarCompositionHint segments={segments} data-test-id="channel-save-composition" />;
};
