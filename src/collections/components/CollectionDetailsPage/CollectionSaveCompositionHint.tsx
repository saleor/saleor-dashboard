import { SavebarCompositionHint } from "@dashboard/components/Savebar/SavebarCompositionHint";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import {
  type CollectionSaveComposition,
  EMPTY_COLLECTION_SAVE_COMPOSITION,
  hasCollectionSaveComposition,
} from "./saveComposition";

interface CollectionSaveCompositionHintProps {
  composition?: CollectionSaveComposition | null;
}

export const CollectionSaveCompositionHint = ({
  composition = EMPTY_COLLECTION_SAVE_COMPOSITION,
}: CollectionSaveCompositionHintProps) => {
  const intl = useIntl();
  const resolved = composition ?? EMPTY_COLLECTION_SAVE_COMPOSITION;

  if (!hasCollectionSaveComposition(resolved)) {
    return null;
  }

  const segments: string[] = [];

  if (resolved.hasGeneral) {
    segments.push(intl.formatMessage(messages.saveCompositionGeneral));
  }

  if (resolved.hasChannels) {
    segments.push(intl.formatMessage(messages.saveCompositionChannels));
  }

  return <SavebarCompositionHint segments={segments} data-test-id="collection-save-composition" />;
};
