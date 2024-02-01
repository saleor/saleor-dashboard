import { Multiselect } from "@dashboard/components/Combobox";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { useDiscountRulesContext } from "@dashboard/discounts/components/DiscountRules/context";
import { Rule } from "@dashboard/discounts/models";
import { CommonSearchOpts } from "@dashboard/hooks/makeTopLevelSearch/types";
import { getSearchFetchMoreProps } from "@dashboard/hooks/makeTopLevelSearch/utils";
import { userVariantWithProductDataSearch } from "@dashboard/searches/useVariantSearch";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

export const RuleRewardGifts = () => {
  const intl = useIntl();
  const { disabled, channels } = useDiscountRulesContext();
  const { watch, formState } = useFormContext<Rule>();

  const channel = watch("channel");
  const channelSlug =
    channels?.find(chan => chan.id === channel?.value)?.slug ?? "";

  const ruleRewardGiftsFieldName = `rewardGifts` as const;
  const { field: rewardGiftsField } = useController<
    Rule,
    typeof ruleRewardGiftsFieldName
  >({
    name: ruleRewardGiftsFieldName,
  });

  const {
    loadMore: loadMoreVariants,
    search: searchVariants,
    result: searchVariantsOpts,
  } = userVariantWithProductDataSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      channel: channelSlug,
    },
    skip: !channelSlug,
  });

  const fetchMoreVariants = getSearchFetchMoreProps(
    searchVariantsOpts as CommonSearchOpts,
    loadMoreVariants,
  );

  const options = (mapEdgesToItems(searchVariantsOpts?.data?.search) ?? []).map(
    ({ name, id, product }) => ({
      label: `${name} (${product?.name})`,
      value: id,
    }),
  );

  const getRewardGiftsHelperText = () => {
    if (formState.errors?.rewardGifts?.message && !channel) {
      return intl.formatMessage({
        defaultMessage:
          "You must select a channel first and select at least one gift",
        id: "vAxm7u",
      });
    }

    return formState.errors?.rewardGifts?.message;
  };

  return (
    <Multiselect
      error={!!formState.errors?.rewardGifts}
      helperText={getRewardGiftsHelperText()}
      label={intl.formatMessage({
        defaultMessage: "Select gifts",
        id: "oX2TAb",
      })}
      value={rewardGiftsField.value}
      onChange={rewardGiftsField.onChange}
      onBlur={rewardGiftsField.onBlur}
      size="medium"
      data-test-id="reward-gifts-select"
      fetchOptions={searchVariants}
      fetchMore={fetchMoreVariants}
      options={options ?? []}
      disabled={disabled}
    >
      <Multiselect.NoOptions size="small" padding={1}>
        <FormattedMessage defaultMessage="No options to select" id="xTyg+p" />
      </Multiselect.NoOptions>
    </Multiselect>
  );
};
