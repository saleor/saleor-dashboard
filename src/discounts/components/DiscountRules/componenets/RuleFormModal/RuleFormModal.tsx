import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type Rule } from "@dashboard/discounts/models";
import { buttonMessages } from "@dashboard/intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useIntl } from "react-intl";

import { useDiscountRulesContext } from "../../context";
import { messages } from "../../messages";
import { getDefaultValue } from "./defaultFormValues";
import { getValidationSchema } from "./validationSchema";

interface RuleFormModalProps {
  children: ReactNode;
  onClose: () => void;
  onSubmit: (data: Rule) => void;
  confimButtonState: ConfirmButtonTransitionState;
  initialFormValues?: Rule | null;
}

export const RuleFormModal = ({
  onClose,
  initialFormValues,
  confimButtonState,
  children,
  onSubmit,
}: RuleFormModalProps): JSX.Element => {
  const intl = useIntl();
  const { discountType } = useDiscountRulesContext();
  const methods = useForm<Rule>({
    mode: "onBlur",
    values: initialFormValues || getDefaultValue(discountType),
    resolver: zodResolver(getValidationSchema(intl)),
  });

  return (
    <DashboardModal open={true} onChange={onClose}>
      <FormProvider {...methods}>
        <DashboardModal.Content size="md" data-test-id="add-rule-dialog">
          <DashboardModal.Header subtitle={intl.formatMessage(messages.ruleModalSubtitle)}>
            {intl.formatMessage(initialFormValues ? messages.editRule : messages.addRule)}
          </DashboardModal.Header>

          <DashboardModal.Body>
            <DashboardModal.Inset>
              <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
            </DashboardModal.Inset>
          </DashboardModal.Body>

          <DashboardModal.Actions>
            <BackButton onClick={onClose} />
            <ConfirmButton
              data-test-id="saveRuleButton"
              transitionState={confimButtonState}
              onClick={methods.handleSubmit(onSubmit)}
            >
              {intl.formatMessage(buttonMessages.save)}
            </ConfirmButton>
          </DashboardModal.Actions>
        </DashboardModal.Content>
      </FormProvider>
    </DashboardModal>
  );
};
