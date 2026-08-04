import { SavebarCompositionHint } from "@dashboard/components/Savebar/SavebarCompositionHint";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import {
  type CategorySaveComposition,
  EMPTY_CATEGORY_SAVE_COMPOSITION,
  hasCategorySaveComposition,
} from "./saveComposition";

interface CategorySaveCompositionHintProps {
  composition?: CategorySaveComposition | null;
}

export const CategorySaveCompositionHint = ({
  composition = EMPTY_CATEGORY_SAVE_COMPOSITION,
}: CategorySaveCompositionHintProps) => {
  const intl = useIntl();
  const resolved = composition ?? EMPTY_CATEGORY_SAVE_COMPOSITION;

  if (!hasCategorySaveComposition(resolved)) {
    return null;
  }

  const segments: string[] = [];

  if (resolved.hasGeneral) {
    segments.push(intl.formatMessage(messages.saveCompositionGeneral));
  }

  return <SavebarCompositionHint segments={segments} data-test-id="category-save-composition" />;
};
