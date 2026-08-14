import { commonMessages } from "@dashboard/intl";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";

interface AttributeValueRequiredCellProps {
  valueRequired: boolean;
}

export const AttributeValueRequiredCell = ({
  valueRequired,
}: AttributeValueRequiredCellProps): JSX.Element => (
  <Text size={2} color={valueRequired ? "default1" : "default2"} data-test-id="value-required">
    {valueRequired ? (
      <FormattedMessage {...messages.required} />
    ) : (
      <FormattedMessage {...commonMessages.optionalField} />
    )}
  </Text>
);
