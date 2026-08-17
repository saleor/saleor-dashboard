import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { Savebar } from "@dashboard/components/Savebar";
import { SavebarCompositionHint } from "@dashboard/components/Savebar/SavebarCompositionHint";
import { useIntl } from "react-intl";

import {
  EMPTY_PROMOTION_SAVE_COMPOSITION,
  hasPromotionSaveComposition,
  type PromotionSaveComposition,
} from "../DiscountDetailsForm/promotionSaveComposition";
import { discountSavebarMessages as messages } from "./messages";

interface DiscountSavebarProps {
  disabled: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  onDelete: () => void;
  submitButtonState: ConfirmButtonTransitionState;
  composition?: PromotionSaveComposition;
}

export const DiscountSavebar = ({
  disabled,
  onSubmit,
  onDelete,
  onCancel,
  submitButtonState,
  composition = EMPTY_PROMOTION_SAVE_COMPOSITION,
}: DiscountSavebarProps): JSX.Element => {
  const intl = useIntl();
  const hasUnsavedChanges = hasPromotionSaveComposition(composition);
  const isSaveDisabled = disabled || !hasUnsavedChanges;

  const segments: string[] = [];

  if (composition.hasGeneral) {
    segments.push(intl.formatMessage(messages.saveCompositionGeneral));
  }

  if (composition.hasSchedule) {
    segments.push(intl.formatMessage(messages.saveCompositionSchedule));
  }

  return (
    <Savebar>
      <Savebar.DeleteButton onClick={onDelete} />
      <Savebar.Spacer />
      <SavebarCompositionHint segments={segments} data-test-id="discount-save-composition" />
      <Savebar.CancelButton onClick={onCancel} />
      <Savebar.ConfirmButton
        transitionState={submitButtonState}
        onClick={onSubmit}
        disabled={isSaveDisabled}
      />
    </Savebar>
  );
};
