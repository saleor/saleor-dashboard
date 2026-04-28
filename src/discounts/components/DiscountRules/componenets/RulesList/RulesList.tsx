import { formatMoney } from "@dashboard/components/Money";
import { formatPercantage } from "@dashboard/components/Percent/utils";
import { type Rule } from "@dashboard/discounts/models";
import { RewardTypeEnum, RewardValueTypeEnum } from "@dashboard/graphql";
import useLocale from "@dashboard/hooks/useLocale";
import { type CommonError } from "@dashboard/utils/errors/common";
import { Box, Text } from "@saleor/macaw-ui-next";
import { Radio } from "lucide-react";
import { useIntl } from "react-intl";

import { useDiscountRulesContext } from "../../context";
import { messages } from "../../messages";
import { getCurencySymbol } from "../../utils";
import { Placeholder } from "../Placeholder";
import { RuleActions } from "./components/RuleActions";
import { RuleLabel } from "./components/RuleLabel";
import { RuleListContainer } from "./components/RuleListContainer";
import { RuleListLoading } from "./components/RuleListLoading";
import { RuleSummary } from "./components/RuleSummary";
import { RuleWrapper } from "./components/RuleWrapper";

interface RulesListProps<ErrorCode> {
  rules: Rule[];
  disabled?: boolean;
  errors: Array<CommonError<ErrorCode> & { index?: number }>;
  loading?: boolean;
  onRuleDelete: (index: number) => void;
  onRuleEdit: (index: number) => void;
}

export const RulesList = <ErrorCode,>({
  rules,
  errors,
  onRuleEdit,
  onRuleDelete,
  loading,
}: RulesListProps<ErrorCode>) => {
  const intl = useIntl();
  const { channels } = useDiscountRulesContext();

  if (loading) {
    return <RuleListLoading />;
  }

  if (rules.length === 0) {
    return <Placeholder />;
  }

  return (
    <RuleListContainer>
      {rules.map((rule, index) => {
        const hasError = errors.some(error => error.index === index);
        const currencySymbol = getCurencySymbol(rule.channel, channels);
        const channelData = rule.channel ? channels.find(c => c.id === rule.channel?.value) : null;
        const isChannelInactive = channelData ? !channelData.isActive : false;

        return (
          <RuleWrapper key={rule.id || index} hasError={hasError}>
            <Box display="flex" flexDirection="column" gap={3}>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" gap={4}>
                <Box display="flex" flexDirection="column" gap={1}>
                  <RuleLabel ruleName={rule.name} />

                  {rule.channel && (
                    <Text
                      size={2}
                      color="default2"
                      fontWeight="medium"
                      display="flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Radio size={14} />
                      {rule.channel.label}
                      {isChannelInactive && (
                        <Text size={2} color="critical1">
                          ({intl.formatMessage(messages.channelInactive)})
                        </Text>
                      )}
                    </Text>
                  )}
                </Box>

                <Box display="flex" alignItems="center" gap={4} flexShrink="0">
                  <RewardDisplay rule={rule} currencySymbol={currencySymbol} />
                  <RuleActions
                    onDelete={() => onRuleDelete(index)}
                    onEdit={() => onRuleEdit(index)}
                  />
                </Box>
              </Box>

              <RuleSummary rule={rule} currencySymbol={currencySymbol} />

              {hasError && <Text color="critical1">{intl.formatMessage(messages.ruleError)}</Text>}
            </Box>
          </RuleWrapper>
        );
      })}
    </RuleListContainer>
  );
};

const RewardDisplay = ({ rule, currencySymbol }: { rule: Rule; currencySymbol: string }) => {
  const intl = useIntl();
  const { locale } = useLocale();
  const isGift = rule.rewardType === RewardTypeEnum.GIFT;
  const hasRewardValue = rule.rewardValue !== null && rule.rewardValue !== undefined;

  if (!hasRewardValue && !isGift) {
    return null;
  }

  if (isGift) {
    const giftCount = rule.rewardGifts?.length ?? 0;

    return (
      <Box
        display="flex"
        alignItems="center"
        flexWrap="nowrap"
        gap={1}
        flexShrink="0"
        style={{ whiteSpace: "nowrap" }}
      >
        <Text size={6} fontWeight="bold" whiteSpace="nowrap">
          {intl.formatMessage({ defaultMessage: "Gift", id: "ZBs2Pb" })}
        </Text>
        {giftCount > 0 && (
          <Text size={3} color="default2" whiteSpace="nowrap">
            {intl.formatMessage(messages.giftCount, { count: giftCount })}
          </Text>
        )}
      </Box>
    );
  }

  const value =
    rule.rewardValueType === RewardValueTypeEnum.FIXED
      ? formatMoney({ amount: rule.rewardValue ?? 0, currency: currencySymbol }, locale)
      : formatPercantage(rule.rewardValue ?? 0, locale);

  return (
    <Box
      display="flex"
      alignItems="baseline"
      gap={1}
      flexShrink="0"
      style={{ whiteSpace: "nowrap" }}
    >
      <Text size={6} fontWeight="bold" data-test-id="rule-value-chip">
        {value}
      </Text>
      <Text size={3} color="default2">
        {intl.formatMessage(messages.rewardOff)}
      </Text>
    </Box>
  );
};
