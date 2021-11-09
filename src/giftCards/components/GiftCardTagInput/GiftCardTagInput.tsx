import SingleAutocompleteSelectField, {
  SingleAutocompleteSelectFieldProps
} from "@saleor/components/SingleAutocompleteSelectField";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { GiftCardError } from "@saleor/fragments/types/GiftCardError";
import { getGiftCardErrorMessage } from "@saleor/giftCards/GiftCardUpdate/messages";
import { FormChange } from "@saleor/hooks/useForm";
import { commonMessages } from "@saleor/intl";
import {
  mapEdgesToItems,
  mapSingleValueNodeToChoice
} from "@saleor/utils/maps";
import compact from "lodash/compact";
import uniq from "lodash/uniq";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardTagInputMessages as messages } from "./messages";
import useGiftCardTagsSearch from "./useGiftCardTagsSearch";

interface GiftCardTagInputProps
  extends Pick<SingleAutocompleteSelectFieldProps, "name"> {
  change: FormChange;
  value: string;
  error: GiftCardError;
}

const GiftCardTagInput: React.FC<GiftCardTagInputProps> = ({
  change,
  name,
  value,
  error
}) => {
  const intl = useIntl();

  const { loadMore, search, result } = useGiftCardTagsSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const choices = mapSingleValueNodeToChoice(
    uniq(compact(mapEdgesToItems(result?.data?.search)?.map(({ tag }) => tag))),
    "tag"
  );

  return (
    <SingleAutocompleteSelectField
      error={!!error}
      helperText={getGiftCardErrorMessage(error, intl)}
      allowCustomValues
      name={name || "giftCardTag"}
      label={`${intl.formatMessage(messages.placeholder)} *${intl.formatMessage(
        commonMessages.optionalField
      )}`}
      data-test-id="gift-card-tag-select-field"
      value={value}
      displayValue={value}
      choices={choices}
      fetchChoices={search}
      onChange={change}
      onFetchMore={loadMore}
    />
  );
};

export default GiftCardTagInput;
