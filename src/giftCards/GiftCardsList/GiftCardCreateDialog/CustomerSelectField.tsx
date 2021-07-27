import SingleAutocompleteSelectField, {
  SingleAutocompleteSelectFieldProps
} from "@saleor/components/SingleAutocompleteSelectField";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import { commonMessages } from "@saleor/intl";
import { getFullName } from "@saleor/misc";
import useCustomerSearch from "@saleor/searches/useCustomerSearch";
import createSingleAutocompleteSelectHandler, {
  SingleAutocompleteSelectedChangeHandlerProps
} from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import { mapEdgesToItems } from "@saleor/utils/maps";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardCreateDialogMessages as messages } from "./messages";

interface CustomerSelectFieldProps
  extends Pick<
      SingleAutocompleteSelectedChangeHandlerProps,
      "change" | "setSelected"
    >,
    Pick<SingleAutocompleteSelectFieldProps, "value"> {
  optional?: boolean;
}

const CustomerSelectField: React.FC<CustomerSelectFieldProps> = ({
  change,
  value,
  setSelected,
  optional
}) => {
  const intl = useIntl();

  const { loadMore, search, result } = useCustomerSearch({
    variables: DEFAULT_INITIAL_SEARCH_DATA
  });

  const choices = mapEdgesToItems(
    result?.data?.search
  )?.map(({ id, ...rest }) => ({ value: id, label: getFullName(rest) }));

  const handleSelect = createSingleAutocompleteSelectHandler(
    change,
    setSelected,
    choices
  );

  const customerLabel = intl.formatMessage(messages.customerLabel);

  const label = optional
    ? `${customerLabel} *${intl.formatMessage(commonMessages.optionalField)}`
    : customerLabel;

  return (
    <SingleAutocompleteSelectField
      name="customer"
      allowCustomValues
      label={label}
      data-test-id="customer-field"
      displayValue=""
      value={value}
      choices={choices || []}
      fetchChoices={search}
      onChange={handleSelect}
      onFetchMore={loadMore}
    />
  );
};

export default CustomerSelectField;
