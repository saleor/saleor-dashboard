import { Callout } from "@dashboard/components/Callout/Callout";
import { type AccountErrorFragment, type OrderErrorFragment } from "@dashboard/graphql";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { getOrderLevelErrorMessage } from "./utils";

interface AddressEditDialogErrorCalloutProps {
  errors: Array<OrderErrorFragment | AccountErrorFragment>;
}

export const AddressEditDialogErrorCallout = ({ errors }: AddressEditDialogErrorCalloutProps) => {
  const intl = useIntl();

  if (!errors.length) {
    return null;
  }

  return (
    <Callout
      type="error"
      title={
        errors.length === 1 ? (
          <Text size={2}>{getOrderLevelErrorMessage(errors[0], intl)}</Text>
        ) : (
          <Box display="flex" flexDirection="column" gap={1}>
            {errors.map((error, index) => (
              <Text size={2} key={`${error.field ?? "order"}-${error.code}-${index}`}>
                {getOrderLevelErrorMessage(error, intl)}
              </Text>
            ))}
          </Box>
        )
      }
    />
  );
};
