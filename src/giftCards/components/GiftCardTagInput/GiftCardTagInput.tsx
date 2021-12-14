import MultiAutocompleteSelectField, {
  MultiAutocompleteChoiceType
} from "@saleor/components/MultiAutocompleteSelectField";
import SingleAutocompleteSelectField, {
  SingleAutocompleteSelectFieldProps
} from "@saleor/components/SingleAutocompleteSelectField";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { GiftCardBulkCreateFormError } from "@saleor/giftCards/GiftCardBulkCreateDialog/types";
import { getGiftCardErrorMessage } from "@saleor/giftCards/GiftCardUpdate/messages";
import { ChangeEvent, FormChange } from "@saleor/hooks/useForm";
import useMultiAutocomplete from "@saleor/hooks/useMultiAutocomplete";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import { commonMessages } from "@saleor/intl";
import createMultiAutocompleteSelectHandler from "@saleor/utils/handlers/multiAutocompleteSelectChangeHandler";
import {
  mapEdgesToItems,
  mapMultiTagNodeToChoice,
  mapMultiValueNodeToChoice,
  mapNodeToChoice,
  mapSingleValueNodeToChoice,
  mapTagNodeToChoice
} from "@saleor/utils/maps";
import compact from "lodash/compact";
import uniq from "lodash/uniq";
import React from "react";
import { useIntl } from "react-intl";

import { multiAutocompleteSelectChangeTagsHandler } from "./handlers";
import { giftCardTagInputMessages as messages } from "./messages";
import useGiftCardTagsSearch from "./useGiftCardTagsSearch";

interface GiftCardTagInputProps
  extends Pick<SingleAutocompleteSelectFieldProps, "name"> {
  change: FormChange;
  values: string[];
  error: GiftCardBulkCreateFormError;
  optional?: boolean;
  loading?: boolean;
}

function tagToChoice(tag: string) {
  return {
    label: tag,
    value: tag
  };
}

const GiftCardTagInput: React.FC<GiftCardTagInputProps> = ({
  change,
  name,
  values,
  error,
  optional = true,
  loading
}) => {
  const intl = useIntl();

  const [tagsDisplayValues, setTagsDisplayValues] = useStateFromProps(values);

  const { loadMore, search, result } = useGiftCardTagsSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const choices = mapMultiValueNodeToChoice(
    uniq(
      compact(mapEdgesToItems(result?.data?.search)?.map(({ name }) => name))
    ),
    "tags"
  );

  // console.log({ choices });

  // const { change: XDChance, data: autocompleteTags } = useMultiAutocomplete(
  //   values?.map(el => ({
  //     label: el,
  //     value: el
  //   }))
  // );

  // const handleTagsChange = createMultiAutocompleteSelectHandler(
  //   change,
  //   setTagsDisplayValues,
  //   tagsDisplayValues,
  //   choices
  // );

  const handlerXD = multiAutocompleteSelectChangeTagsHandler(
    change,
    choices,
    values,
    setTagsDisplayValues
  );

  // const tagsChange = createMultiAutocompleteSelectHandler(
  //   change,
  //   () => undefined,
  //   choices,
  //   values.map(el => ({
  //     label: el,
  //     value: el
  //   }))
  // );

  // const choicesXD = mapMultiTagNodeToChoice(
  //   mapEdgesToItems(result?.data?.search)?.map(({ id, name }) => ({
  //     tag: name,
  //     id
  //   }))
  // );

  // const choicesXD =

  const label = optional
    ? `${intl.formatMessage(messages.placeholder)} *${intl.formatMessage(
        commonMessages.optionalField
      )}`
    : intl.formatMessage(messages.placeholder);

  const getMultiChoices = (values: string[]): MultiAutocompleteChoiceType[] =>
    values.map(el => ({
      label: el,
      value: el
    }));

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
      onChange={handlerXD}
      onFetchMore={loadMore}
      loading={result?.loading || loading}
      allowCustomValues
    />
  );
};

export default GiftCardTagInput;
