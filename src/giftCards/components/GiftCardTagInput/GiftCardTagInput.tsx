import { Multiselect } from "@dashboard/components/Combobox";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { GiftCardBulkCreateFormError } from "@dashboard/giftCards/GiftCardBulkCreateDialog/types";
import { getGiftCardErrorMessage } from "@dashboard/giftCards/GiftCardUpdate/messages";
import { FormChange } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import useGiftCardTagsSearch from "@dashboard/searches/useGiftCardTagsSearch";
import { mapEdgesToItems, mapMultiValueNodeToChoice } from "@dashboard/utils/maps";
import { Box, Option } from "@saleor/macaw-ui-next";
import compact from "lodash/compact";
import uniq from "lodash/uniq";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardTagInputMessages as messages } from "./messages";

interface GiftCardTagInputProps {
  name: string;
  onChange: FormChange;
  values: Option[];
  error: GiftCardBulkCreateFormError;
  optional?: boolean;
  loading?: boolean;
}

const GiftCardTagInput = ({
  onChange,
  name,
  values,
  error,
  optional = true,
  loading,
}: GiftCardTagInputProps) => {
  const intl = useIntl();
  const { loadMore, search, result } = useGiftCardTagsSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });
  const choices = mapMultiValueNodeToChoice(
    uniq(compact(mapEdgesToItems(result?.data?.search)?.map(({ name }) => name))),
    "tags",
  );

  const label = optional
    ? `${intl.formatMessage(messages.placeholder)} *${intl.formatMessage(
        commonMessages.optionalField,
      )}`
    : intl.formatMessage(messages.placeholder);

  return (
    <Box>
      <Multiselect
        allowCustomValues
        loading={loading}
        error={!!error}
        helperText={getGiftCardErrorMessage(error, intl)}
        name={name || "giftCardTag"}
        label={label}
        data-test-id="gift-card-tag-select-field"
        fetchMore={{
          loading: result?.loading,
          onFetchMore: loadMore,
          hasMore: result?.data?.search?.pageInfo?.hasNextPage ?? false,
        }}
        value={values}
        options={choices}
        onChange={onChange}
        fetchOptions={search}
      />
    </Box>
  );
};

export default GiftCardTagInput;
