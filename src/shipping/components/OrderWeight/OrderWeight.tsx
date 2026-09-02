// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import { type ShippingErrorFragment } from "@dashboard/graphql";
import { type ChangeEvent } from "@dashboard/hooks/useForm";
import useShop from "@dashboard/hooks/useShop";
import { getShippingWeightRateErrorMessage } from "@dashboard/shipping/errors";
import { getFormErrors } from "@dashboard/utils/errors";
import { Box, Input, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage, useIntl } from "react-intl";

import { useStyles } from "./styles";

interface OrderWeightProps {
  disabled: boolean;
  errors: ShippingErrorFragment[];
  maxValue: string;
  minValue: string;
  onChange: (event: ChangeEvent) => void;
}

const OrderWeight = ({
  disabled,
  errors,
  maxValue = "",
  minValue = "",
  onChange,
}: OrderWeightProps) => {
  const classes = useStyles({});
  const intl = useIntl();
  const shop = useShop();
  const formFields = ["minimumOrderWeight", "maximumOrderWeight"];
  const formErrors = getFormErrors(formFields, errors);

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <Box display="flex" flexDirection="column">
          <DashboardCard.Title>
            {intl.formatMessage({
              id: "vWapBZ",
              defaultMessage: "Order Weight",
              description: "card title",
            })}
          </DashboardCard.Title>
          <DashboardCard.Subtitle fontSize={3} color="default2">
            <FormattedMessage
              id="YhfTcL"
              defaultMessage="Leave min and max empty to apply this rate to orders of any weight."
              description="order weight restrictions helper"
            />
          </DashboardCard.Subtitle>
        </Box>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <div className={classes.grid}>
          <Input
            data-test-id="min-order-weight-input"
            disabled={disabled}
            helperText={getShippingWeightRateErrorMessage(formErrors.minimumOrderWeight, intl)}
            error={!!formErrors.minimumOrderWeight}
            aria-invalid={!!formErrors.minimumOrderWeight}
            label={intl.formatMessage({
              id: "w+5Djm",
              defaultMessage: "Min. Order Weight",
            })}
            name="minValue"
            type="number"
            min={0}
            endAdornment={<Text color="default2">{shop?.defaultWeightUnit}</Text>}
            value={minValue}
            onChange={onChange}
          />
          <Input
            data-test-id="max-order-weight-input"
            disabled={disabled}
            helperText={getShippingWeightRateErrorMessage(formErrors.maximumOrderWeight, intl)}
            error={!!formErrors.maximumOrderWeight}
            aria-invalid={!!formErrors.maximumOrderWeight}
            label={intl.formatMessage({
              id: "u0V06N",
              defaultMessage: "Max. Order Weight",
            })}
            name="maxValue"
            type="number"
            min={minValue}
            endAdornment={<Text color="default2">{shop?.defaultWeightUnit}</Text>}
            value={maxValue}
            onChange={onChange}
          />
        </div>
      </DashboardCard.Content>
    </DashboardCard>
  );
};

export default OrderWeight;
