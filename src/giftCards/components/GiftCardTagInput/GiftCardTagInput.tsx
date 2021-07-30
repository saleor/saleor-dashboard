import { Typography } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import SingleAutocompleteSelectField, {
  SingleAutocompleteSelectFieldProps
} from "@saleor/components/SingleAutocompleteSelectField";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { FormChange } from "@saleor/hooks/useForm";
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
  withTopLabel?: boolean;
}

const GiftCardTagInput: React.FC<GiftCardTagInputProps> = ({
  withTopLabel = false,
  change,
  name,
  value
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
    <>
      {withTopLabel && (
        <>
          <Typography>{intl.formatMessage(messages.label)}</Typography>
          <VerticalSpacer />
        </>
      )}
      <SingleAutocompleteSelectField
        allowCustomValues
        name={name || "giftCardTag"}
        label={intl.formatMessage(messages.placeholder)}
        data-test-id="gift-card-tag-select-field"
        value={value}
        displayValue={value}
        choices={choices}
        fetchChoices={search}
        onChange={change}
        onFetchMore={loadMore}
      />
    </>
  );
};

export default GiftCardTagInput;
