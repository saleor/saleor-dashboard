import { SavebarCompositionHint } from "@dashboard/components/Savebar/SavebarCompositionHint";
import { messages } from "@dashboard/warehouses/messages";
import { useIntl } from "react-intl";

import {
  EMPTY_WAREHOUSE_SAVE_COMPOSITION,
  hasWarehouseSaveComposition,
  type WarehouseSaveComposition,
} from "./saveComposition";

interface WarehouseSaveCompositionHintProps {
  composition?: WarehouseSaveComposition | null;
}

export const WarehouseSaveCompositionHint = ({
  composition = EMPTY_WAREHOUSE_SAVE_COMPOSITION,
}: WarehouseSaveCompositionHintProps): React.ReactNode => {
  const intl = useIntl();
  const resolved = composition ?? EMPTY_WAREHOUSE_SAVE_COMPOSITION;

  if (!hasWarehouseSaveComposition(resolved)) {
    return null;
  }

  const segments: string[] = [];

  if (resolved.hasGeneral) {
    segments.push(intl.formatMessage(messages.saveCompositionGeneral));
  }

  if (resolved.hasAddress) {
    segments.push(intl.formatMessage(messages.saveCompositionAddress));
  }

  if (resolved.hasPickup) {
    segments.push(intl.formatMessage(messages.saveCompositionPickup));
  }

  return <SavebarCompositionHint segments={segments} data-test-id="warehouse-save-composition" />;
};
