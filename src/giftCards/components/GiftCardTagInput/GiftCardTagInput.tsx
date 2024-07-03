import MultiAutocompleteSelectField from "@dashboard/components/MultiAutocompleteSelectField";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@dashboard/config";
import { GiftCardBulkCreateFormError } from "@dashboard/giftCards/GiftCardBulkCreateDialog/types";
import { getGiftCardErrorMessage } from "@dashboard/giftCards/GiftCardUpdate/messages";
import { FormChange } from "@dashboard/hooks/useForm";
import { commonMessages } from "@dashboard/intl";
import useGiftCardTagsSearch from "@dashboard/searches/useGiftCardTagsSearch";
import { mapEdgesToItems, mapMultiValueNodeToChoice } from "@dashboard/utils/maps";
import { Box } from "@saleor/macaw-ui-next";
import compact from "lodash/compact";
import uniq from "lodash/uniq";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardTagInputMessages as messages } from "./messages";
import { getMultiChoices } from "./utils";

interface GiftCardTagInputProps {
  name: string;
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
    </Box>
  );
};

export default GiftCardTagInput;
