import { Typography } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import SingleAutocompleteSelectField, {
  SingleAutocompleteSelectFieldProps
} from "@saleor/components/SingleAutocompleteSelectField";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { FormChange } from "@saleor/hooks/useForm";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import {
  mapEdgesToItems,
  mapSingleValueNodeToChoice
} from "@saleor/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardTagInputMessages as messages } from "./messages";
import useGiftCardTagsSearch from "./useGiftCardTagsSearch";

interface GiftCardTagInputProps
  extends Pick<SingleAutocompleteSelectFieldProps, "name"> {
  change: FormChange;
  setSelected: (id: string) => void;
  value: string;
  withTopLabel?: boolean;
}

const GiftCardTagInput: React.FC<GiftCardTagInputProps> = ({
  withTopLabel = false,
  change,
  setSelected,
  name,
  value
}) => {
  const intl = useIntl();

  const { loadMore, search, result } = useGiftCardTagsSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const choices = mapSingleValueNodeToChoice(
    mapEdgesToItems(result?.data?.search)?.filter(({ tag }) => !!tag),
    "tag"
  );

  const handleSelect = createSingleAutocompleteSelectHandler(
    change,
    setSelected,
    choices
  );

  return (
    <>
      {withTopLabel && (
        <>
          <Typography>{intl.formatMessage(messages.label)}</Typography>
          <VerticalSpacer />
        </>
      )}
      <SingleAutocompleteSelectField
        name={name || "giftCardTag"}
        allowCustomValues
        label={intl.formatMessage(messages.placeholder)}
        data-test-id="gift-card-tag-select-field"
        value={value}
        displayValue={value}
        choices={choices}
        fetchChoices={search}
        onChange={handleSelect}
        onFetchMore={loadMore}
      />
    </>
  );
};

export default GiftCardTagInput;
