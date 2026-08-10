import { SavebarCompositionHint } from "@dashboard/components/Savebar/SavebarCompositionHint";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import {
  EMPTY_SHIPPING_ZONE_SAVE_COMPOSITION,
  hasShippingZoneSaveComposition,
  type ShippingZoneSaveComposition,
} from "./saveComposition";

interface ShippingZoneSaveCompositionHintProps {
  composition?: ShippingZoneSaveComposition | null;
}

export const ShippingZoneSaveCompositionHint = ({
  composition = EMPTY_SHIPPING_ZONE_SAVE_COMPOSITION,
}: ShippingZoneSaveCompositionHintProps) => {
  const intl = useIntl();
  const resolved = composition ?? EMPTY_SHIPPING_ZONE_SAVE_COMPOSITION;

  if (!hasShippingZoneSaveComposition(resolved)) {
    return null;
  }

  const segments: string[] = [];

  if (resolved.hasGeneral) {
    segments.push(intl.formatMessage(messages.saveCompositionGeneral));
  }

  if (resolved.hasChannels) {
    segments.push(intl.formatMessage(messages.saveCompositionChannels));
  }

  if (resolved.hasWarehouses) {
    segments.push(intl.formatMessage(messages.saveCompositionWarehouses));
  }

  return (
    <SavebarCompositionHint segments={segments} data-test-id="shipping-zone-save-composition" />
  );
};
