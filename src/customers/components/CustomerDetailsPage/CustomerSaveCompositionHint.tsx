import { SavebarCompositionHint } from "@dashboard/components/Savebar/SavebarCompositionHint";
import { useIntl } from "react-intl";

import { messages } from "./messages";
import {
  type CustomerSaveComposition,
  EMPTY_CUSTOMER_SAVE_COMPOSITION,
  hasCustomerSaveComposition,
} from "./saveComposition";

interface CustomerSaveCompositionHintProps {
  composition?: CustomerSaveComposition | null;
}

export const CustomerSaveCompositionHint = ({
  composition = EMPTY_CUSTOMER_SAVE_COMPOSITION,
}: CustomerSaveCompositionHintProps): JSX.Element | null => {
  const intl = useIntl();
  const resolved = composition ?? EMPTY_CUSTOMER_SAVE_COMPOSITION;

  if (!hasCustomerSaveComposition(resolved)) {
    return null;
  }

  const segments: string[] = [];

  if (resolved.hasGeneral) {
    segments.push(intl.formatMessage(messages.saveCompositionGeneral));
  }

  if (resolved.hasType) {
    segments.push(intl.formatMessage(messages.saveCompositionType));
  }

  if (resolved.hasAttributes) {
    segments.push(intl.formatMessage(messages.saveCompositionAttributes));
  }

  return <SavebarCompositionHint segments={segments} data-test-id="customer-save-composition" />;
};
