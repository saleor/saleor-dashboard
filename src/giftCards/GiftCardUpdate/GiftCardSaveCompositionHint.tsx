import { SavebarCompositionHint } from "@dashboard/components/Savebar/SavebarCompositionHint";
import { defineMessages, useIntl } from "react-intl";

import {
  EMPTY_GIFT_CARD_SAVE_COMPOSITION,
  type GiftCardSaveComposition,
  hasGiftCardSaveComposition,
} from "./saveComposition";

const messages = defineMessages({
  tags: {
    id: "bl0j6v",
    defaultMessage: "tags",
    description: "Save composition segment for gift card tags",
  },
  expiry: {
    id: "i3U0hk",
    defaultMessage: "expiration",
    description: "Save composition segment for gift card expiry date",
  },
});

interface GiftCardSaveCompositionHintProps {
  composition?: GiftCardSaveComposition | null;
}

export const GiftCardSaveCompositionHint = ({
  composition = EMPTY_GIFT_CARD_SAVE_COMPOSITION,
}: GiftCardSaveCompositionHintProps) => {
  const intl = useIntl();
  const resolved = composition ?? EMPTY_GIFT_CARD_SAVE_COMPOSITION;

  if (!hasGiftCardSaveComposition(resolved)) {
    return null;
  }

  const segments: string[] = [];

  if (resolved.hasTags) {
    segments.push(intl.formatMessage(messages.tags));
  }

  if (resolved.hasExpiry) {
    segments.push(intl.formatMessage(messages.expiry));
  }

  return <SavebarCompositionHint segments={segments} data-test-id="gift-card-save-composition" />;
};
