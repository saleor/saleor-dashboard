import MultiAutocompleteSelectField from "@saleor/components/MultiAutocompleteSelectField";
import { SingleAutocompleteSelectFieldProps } from "@saleor/components/SingleAutocompleteSelectField";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { GiftCardBulkCreateFormError } from "@saleor/giftCards/GiftCardBulkCreateDialog/types";
import { getGiftCardErrorMessage } from "@saleor/giftCards/GiftCardUpdate/messages";
import { FormChange } from "@saleor/hooks/useForm";
import { commonMessages } from "@saleor/intl";
import useGiftCardTagsSearch from "@saleor/searches/useGiftCardTagsSearch";
import { mapEdgesToItems, mapMultiValueNodeToChoice } from "@saleor/utils/maps";
import compact from "lodash/compact";
import uniq from "lodash/uniq";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardTagInputMessages as messages } from "./messages";
import { getMultiChoices } from "./utils";

interface GiftCardTagInputProps
  extends Pick<SingleAutocompleteSelectFieldProps, "name"> {
  toggleChange: FormChange;
  values: string[];
  error: GiftCardBulkCreateFormError;
  optional?: boolean;
  loading?: boolean;
}

const GiftCardTagInput: React.FC<GiftCardTagInputProps> = ({
  toggleChange,
  name,
  values,
  error,
  optional = true,
  loading,
}) => {
  const intl = useIntl();

  const { loadMore, search, result } = useGiftCardTagsSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA,
  });

  const choices = mapMultiValueNodeToChoice(
    uniq(
      compact(mapEdgesToItems(result?.data?.search)?.map(({ name }) => name)),
    ),
    "tags",
  );

  const label = optional
    ? `${intl.formatMessage(messages.placeholder)} *${intl.formatMessage(
        commonMessages.optionalField,
      )}`
    : intl.formatMessage(messages.placeholder);

  return (
    <MultiAutocompleteSelectField
      error={!!error}
      helperText={getGiftCardErrorMessage(error, intl)}
      name={name || "giftCardTag"}
      label={label}
      data-test-id="gift-card-tag-select-field"
      value={values}
      displayValues={getMultiChoices(values)}
      choices={choices}
      fetchChoices={search}
      onChange={toggleChange}
      onFetchMore={loadMore}
      loading={result?.loading || loading}
      allowCustomValues
    />
  );
};

export default GiftCardTagInput;
