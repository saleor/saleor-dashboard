import {
  TopNav,
  TopNavDestinationIcon,
  topNavDestinationMessages,
} from "@dashboard/components/AppLayout";
import { type ConfirmButtonTransitionState } from "@dashboard/components/ConfirmButton";
import { DetailPageContent } from "@dashboard/components/DetailPageContent/DetailPageContent";
import { useDevModeContext } from "@dashboard/components/DevModePanel/hooks";
import { DetailPageLayout } from "@dashboard/components/Layouts";
import { type Rule } from "@dashboard/discounts/models";
import { promotionGraphiQLQuery } from "@dashboard/discounts/queries";
import { type DiscoutFormData } from "@dashboard/discounts/types";
import { extensionMountPoints } from "@dashboard/extensions/extensionMountPoints";
import { getExtensionsItemsForDiscountDetails } from "@dashboard/extensions/getExtensionsItems";
import { useExtensions } from "@dashboard/extensions/hooks/useExtensions";
import {
  type ChannelFragment,
  type PromotionDetailsFragment,
  type PromotionRuleCreateErrorFragment,
  type PromotionRuleUpdateErrorFragment,
  type PromotionUpdateErrorFragment,
} from "@dashboard/graphql";
import { getFormErrors } from "@dashboard/utils/errors";
import { type CommonError, getCommonFormFieldErrorMessage } from "@dashboard/utils/errors/common";
import { Box } from "@saleor/macaw-ui-next";
import { defineMessages, useIntl } from "react-intl";

import { DiscountDatesWithController } from "../DiscountDates";
import { DiscountDetailsForm } from "../DiscountDetailsForm";
import { DiscountGeneralInfo } from "../DiscountGeneralInfo";
import { DiscountRules } from "../DiscountRules";
import { DiscountSavebar } from "../DiscountSavebar";
import { DiscountDetailsTitle } from "./Title";

const messages = defineMessages({
  openGraphiQL: {
    id: "xfvvg2",
    defaultMessage: "Open this promotion in GraphiQL",
  },
});

interface DiscountDetailsPageProps {
  channels: ChannelFragment[];
  data: PromotionDetailsFragment | undefined | null;
  disabled: boolean;
  errors: PromotionUpdateErrorFragment[];
  submitButtonState: ConfirmButtonTransitionState;
  onSubmit: (data: DiscoutFormData) => void;
  onDelete: () => void;
  onRuleUpdateSubmit: (data: Rule) => Promise<Array<CommonError<PromotionRuleUpdateErrorFragment>>>;
  ruleUpdateButtonState: ConfirmButtonTransitionState;
  onRuleCreateSubmit: (data: Rule) => Promise<Array<CommonError<PromotionRuleCreateErrorFragment>>>;
  ruleCreateButtonState: ConfirmButtonTransitionState;
  onRuleDeleteSubmit: (id: string) => Promise<boolean>;
  ruleDeleteButtonState: ConfirmButtonTransitionState;
  onBack: () => void;
  backLinkHref: string;
}

export const DiscountDetailsPage = ({
  channels,
  disabled,
  data,
  errors,
  submitButtonState,
  onBack,
  onSubmit,
  onDelete,
  onRuleCreateSubmit,
  onRuleUpdateSubmit,
  onRuleDeleteSubmit,
  ruleCreateButtonState,
  ruleUpdateButtonState,
  ruleDeleteButtonState,
  backLinkHref,
}: DiscountDetailsPageProps) => {
  const intl = useIntl();
  const formErrors = getFormErrors(["name"], errors);

  const context = useDevModeContext();
  const openPlaygroundURL = () => {
    context.setDevModeContent(promotionGraphiQLQuery);
    context.setVariables(`{ "id": "${data?.id}" }`);
    context.setDevModeVisibility(true);
  };

  const { DISCOUNT_DETAILS_MORE_ACTIONS } = useExtensions(extensionMountPoints.DISCOUNT_DETAILS);
  const extensionMenuItems = getExtensionsItemsForDiscountDetails(
    DISCOUNT_DETAILS_MORE_ACTIONS,
    data?.id,
  );

  return (
    <DiscountDetailsForm
      data={data}
      disabled={disabled}
      onSubmit={onSubmit}
      onRuleCreateSubmit={onRuleCreateSubmit}
      onRuleDeleteSubmit={onRuleDeleteSubmit}
      onRuleUpdateSubmit={onRuleUpdateSubmit}
    >
      {({
        rulesErrors,
        rules,
        discountType,
        onDeleteRule,
        onRuleSubmit,
        onSubmit,
        saveComposition,
      }) => (
        <DetailPageLayout testId="discount-form">
          <TopNav
            href={backLinkHref}
            hrefIcon={<TopNavDestinationIcon.discounts />}
            hrefTitle={intl.formatMessage(topNavDestinationMessages.allDiscounts)}
            title={<DiscountDetailsTitle data={data} />}
          >
            <TopNav.Menu
              items={[
                ...extensionMenuItems,
                {
                  label: intl.formatMessage(messages.openGraphiQL),
                  onSelect: openPlaygroundURL,
                  testId: "graphiql-redirect",
                },
              ]}
              dataTestId="menu"
            />
          </TopNav>

          <DetailPageLayout.Content>
            <DetailPageContent>
              <DiscountGeneralInfo
                error={getCommonFormFieldErrorMessage(formErrors.name, intl)}
                disabled={disabled}
                typeDisabled={true}
              />

              <DiscountRules
                promotionId={data?.id ?? null}
                discountType={discountType}
                errors={rulesErrors}
                rules={rules}
                getRuleConfirmButtonState={ruleEditIndex =>
                  ruleEditIndex !== null ? ruleUpdateButtonState : ruleCreateButtonState
                }
                deleteButtonState={ruleDeleteButtonState}
                onRuleDelete={onDeleteRule}
                onRuleSubmit={onRuleSubmit}
                channels={channels}
                disabled={disabled}
              />
            </DetailPageContent>
          </DetailPageLayout.Content>

          <DetailPageLayout.RightSidebar paddingTop={6}>
            <Box display="flex" flexDirection="column" gap={4}>
              <DiscountDatesWithController errors={errors} disabled={disabled} />
            </Box>
          </DetailPageLayout.RightSidebar>

          <DiscountSavebar
            disabled={disabled}
            onCancel={onBack}
            onSubmit={onSubmit}
            onDelete={onDelete}
            submitButtonState={submitButtonState}
            composition={saveComposition}
          />
        </DetailPageLayout>
      )}
    </DiscountDetailsForm>
  );
};
