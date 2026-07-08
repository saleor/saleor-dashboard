import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type Rule } from "@dashboard/discounts/models";
import { buttonMessages } from "@dashboard/intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactNode, useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { useDiscountRulesContext } from "../../context";
import { messages } from "../../messages";
import { getDefaultValue } from "./defaultFormValues";
import { getValidationSchema } from "./validationSchema";

interface RuleFormModalProps {
  children: ReactNode;
  confirmButtonState: ConfirmButtonTransitionState;
  initialFormValues?: Rule | null;
  onClose: () => void;
  onSubmit: (data: Rule) => void;
}

export const RuleFormModal = ({
  children,
  confirmButtonState,
  initialFormValues,
  onClose,
  onSubmit,
}: RuleFormModalProps): JSX.Element => {
  const intl = useIntl();
  const isSubmittingRef = useRef(false);
  const { discountType } = useDiscountRulesContext();
  const methods = useForm<Rule>({
    mode: "onBlur",
    resolver: zodResolver(getValidationSchema(intl)),
    values: initialFormValues || getDefaultValue(discountType),
  });
  const isSubmitting = confirmButtonState === "loading";

  isSubmittingRef.current = isSubmitting;

  const handleClose = (): void => {
    if (isSubmittingRef.current) {
      return;
    }

    onClose();
  };

  return (
    <DashboardModal onChange={handleClose} open={true}>
      <FormProvider {...methods}>
        <DashboardModal.Content data-test-id="add-rule-dialog" size="md">
          <DashboardModal.ContextHeader
            description={<FormattedMessage {...messages.ruleModalSubtitle} />}
          >
            <FormattedMessage {...(initialFormValues ? messages.editRule : messages.addRule)} />
          </DashboardModal.ContextHeader>

          <DashboardModal.Body fill>
            <DashboardModal.Inset>
              <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
            </DashboardModal.Inset>
          </DashboardModal.Body>

          <DashboardModal.Actions>
            <BackButton disabled={isSubmitting} onClick={handleClose} />
            <ConfirmButton
              data-test-id="saveRuleButton"
              disabled={isSubmitting}
              onClick={methods.handleSubmit(onSubmit)}
              transitionState={confirmButtonState}
            >
              <FormattedMessage {...buttonMessages.save} />
            </ConfirmButton>
          </DashboardModal.Actions>
        </DashboardModal.Content>
      </FormProvider>
    </DashboardModal>
  );
};

RuleFormModal.displayName = "RuleFormModal";
