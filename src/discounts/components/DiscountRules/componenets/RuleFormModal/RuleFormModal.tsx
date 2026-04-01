import BackButton from "@dashboard/components/BackButton";
import {
  ConfirmButton,
  type ConfirmButtonTransitionState,
} from "@dashboard/components/ConfirmButton";
import { DashboardModal } from "@dashboard/components/Modal";
import { type Rule } from "@dashboard/discounts/models";
import { buttonMessages } from "@dashboard/intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Text } from "@saleor/macaw-ui-next";
import { type ReactNode, useCallback, useEffect, useRef, useState } from "react";
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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const methods = useForm<Rule>({
    mode: "onBlur",
    values: initialFormValues || getDefaultValue(discountType),
    resolver: zodResolver(getValidationSchema(intl)),
  });
  const updateOverflowState = useCallback((): void => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    setHasOverflow(scrollContainer.scrollHeight > scrollContainer.clientHeight + 1);
  }, []);

  useEffect(() => {
    updateOverflowState();

    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    window.addEventListener("resize", updateOverflowState);

    if (typeof ResizeObserver === "undefined") {
      return (): void => {
        window.removeEventListener("resize", updateOverflowState);
      };
    }

    const resizeObserver = new ResizeObserver((): void => {
      updateOverflowState();
    });

    resizeObserver.observe(scrollContainer);

    return (): void => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateOverflowState);
    };
  }, [updateOverflowState]);

  return (
    <DashboardModal open={true} onChange={onClose}>
      <DashboardModal.Content
        size="md"
        display="flex"
        flexDirection="column"
        overflowY="hidden"
        backgroundColor="default1"
        data-test-id="add-rule-dialog"
      >
        <Box display="flex" flexDirection="column" gap={2} flexShrink="0">
          <DashboardModal.Header>
            {intl.formatMessage(initialFormValues ? messages.editRule : messages.addRule)}
          </DashboardModal.Header>
          <Text size={2} color="default2">
            {intl.formatMessage(messages.ruleModalSubtitle)}
          </Text>
        </Box>
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "1 1 auto",
              minHeight: 0,
            }}
          >
            <Box
              ref={scrollContainerRef}
              display="flex"
              flexDirection="column"
              gap={5}
              overflowY="auto"
              __flex="1 1 auto"
              __minHeight="0"
              __paddingRight={hasOverflow ? "var(--mu-spacing-2)" : undefined}
              __marginRight={hasOverflow ? "calc(-1 * var(--mu-spacing-2))" : undefined}
              paddingBottom={1}
            >
              {children}
            </Box>
            <Box flexShrink="0" display="flex" flexDirection="column" gap={5} paddingTop={5}>
              <Box
                __height="1px"
                __backgroundColor="var(--mu-colors-border-default1)"
                __marginLeft="calc(-1 * var(--mu-spacing-6))"
                __marginRight="calc(-1 * var(--mu-spacing-6))"
              />
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
            </Box>
          </form>
        </FormProvider>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
