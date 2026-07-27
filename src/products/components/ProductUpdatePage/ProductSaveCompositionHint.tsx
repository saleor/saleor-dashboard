import { Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import {
  buildProductSaveComposition,
  hasProductSaveComposition,
  type ProductSaveComposition,
} from "./saveComposition";

interface ProductSaveCompositionHintProps {
  composition?: ProductSaveComposition | null;
}

const EMPTY_COMPOSITION = buildProductSaveComposition({
  changedFieldNames: [],
  descriptionDirty: false,
  attributesDirty: false,
  dirtyChannelCount: 0,
  variantEditCount: 0,
  variantCreateCount: 0,
  variantDeleteCount: 0,
});

export const ProductSaveCompositionHint = ({
  composition = EMPTY_COMPOSITION,
}: ProductSaveCompositionHintProps) => {
  const intl = useIntl();
  const resolved = composition ?? EMPTY_COMPOSITION;

  if (!hasProductSaveComposition(resolved)) {
    return null;
  }

  const segments: string[] = [];

  if (resolved.hasDetails) {
    segments.push(intl.formatMessage(messages.saveCompositionDetails));
  }

  if (resolved.dirtyChannelCount > 0) {
    segments.push(
      intl.formatMessage(messages.saveCompositionChannels, {
        count: resolved.dirtyChannelCount,
      }),
    );
  }

  if (resolved.variantEditCount > 0) {
    segments.push(
      intl.formatMessage(messages.saveCompositionVariantEdits, {
        count: resolved.variantEditCount,
      }),
    );
  }

  if (resolved.variantCreateCount > 0) {
    segments.push(
      intl.formatMessage(messages.saveCompositionVariantCreates, {
        count: resolved.variantCreateCount,
      }),
    );
  }

  if (resolved.variantDeleteCount > 0) {
    segments.push(
      intl.formatMessage(messages.saveCompositionVariantDeletes, {
        count: resolved.variantDeleteCount,
      }),
    );
  }

  return (
    <Text size={2} color="default2" data-test-id="product-save-composition">
      {intl.formatMessage(messages.saveCompositionIncludes, {
        segments: segments.join(", "),
      })}
    </Text>
  );
};
