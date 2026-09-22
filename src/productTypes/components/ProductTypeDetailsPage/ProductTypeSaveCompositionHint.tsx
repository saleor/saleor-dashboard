import { SavebarCompositionHint } from "@dashboard/components/Savebar/SavebarCompositionHint";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import {
  EMPTY_PRODUCT_TYPE_SAVE_COMPOSITION,
  hasProductTypeSaveComposition,
  type ProductTypeSaveComposition,
} from "./saveComposition";

interface ProductTypeSaveCompositionHintProps {
  composition?: ProductTypeSaveComposition | null;
}

export const ProductTypeSaveCompositionHint = ({
  composition = EMPTY_PRODUCT_TYPE_SAVE_COMPOSITION,
}: ProductTypeSaveCompositionHintProps): JSX.Element | null => {
  const intl = useIntl();
  const resolved = composition ?? EMPTY_PRODUCT_TYPE_SAVE_COMPOSITION;

  if (!hasProductTypeSaveComposition(resolved)) {
    return null;
  }

  const segments: string[] = [];

  if (resolved.hasGeneral) {
    segments.push(intl.formatMessage(messages.saveCompositionGeneral));
  }

  if (resolved.hasShipping) {
    segments.push(intl.formatMessage(messages.saveCompositionShipping));
  }

  if (resolved.hasTaxes) {
    segments.push(intl.formatMessage(messages.saveCompositionTaxes));
  }

  if (resolved.hasVariantSelection) {
    segments.push(intl.formatMessage(messages.saveCompositionVariantSelection));
  }

  return (
    <SavebarCompositionHint segments={segments} data-test-id="product-type-save-composition" />
  );
};
