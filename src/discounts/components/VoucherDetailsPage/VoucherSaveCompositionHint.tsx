import { SavebarCompositionHint } from "@dashboard/components/Savebar/SavebarCompositionHint";
import { useIntl } from "react-intl";

import { voucherDetailsPageMessages as messages } from "./messages";
import {
  EMPTY_VOUCHER_SAVE_COMPOSITION,
  hasVoucherSaveComposition,
  type VoucherSaveComposition,
} from "./saveComposition";

interface VoucherSaveCompositionHintProps {
  composition?: VoucherSaveComposition | null;
}

export const VoucherSaveCompositionHint = ({
  composition = EMPTY_VOUCHER_SAVE_COMPOSITION,
}: VoucherSaveCompositionHintProps) => {
  const intl = useIntl();
  const resolved = composition ?? EMPTY_VOUCHER_SAVE_COMPOSITION;

  if (!hasVoucherSaveComposition(resolved)) {
    return null;
  }

  const segments: string[] = [];

  if (resolved.hasGeneral) {
    segments.push(intl.formatMessage(messages.saveCompositionGeneral));
  }

  if (resolved.hasSchedule) {
    segments.push(intl.formatMessage(messages.saveCompositionSchedule));
  }

  if (resolved.hasChannels) {
    segments.push(intl.formatMessage(messages.saveCompositionChannels));
  }

  if (resolved.hasCodes) {
    segments.push(intl.formatMessage(messages.saveCompositionCodes));
  }

  if (resolved.hasCatalogue) {
    segments.push(intl.formatMessage(messages.saveCompositionCatalogue));
  }

  if (resolved.hasCountries) {
    segments.push(intl.formatMessage(messages.saveCompositionCountries));
  }

  return <SavebarCompositionHint segments={segments} data-test-id="voucher-save-composition" />;
};
