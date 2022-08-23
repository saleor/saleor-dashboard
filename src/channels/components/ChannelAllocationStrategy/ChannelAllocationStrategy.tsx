import { Card, CardContent, Typography } from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import RadioGroupField from "@saleor/components/RadioGroupField";
import { AllocationStrategyEnum, StockSettingsInput } from "@saleor/graphql";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { messages } from "./messages";
import { useStyles } from "./styles";

const strategyOptions = [
  {
    title: messages.prioritizeBySortOrder,
    subtitle: messages.prioritizeBySortOrderDescription,
    type: AllocationStrategyEnum.PRIORITIZE_SORTING_ORDER,
  },
  {
    title: messages.prioritizeByHighestStock,
    subtitle: messages.prioritizeByHighestStockDescription,
    type: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
  },
];

interface ChannelAllocationStrategyProps {
  data?: {
    stockSettings: StockSettingsInput;
  };
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const ChannelAllocationStrategy: React.FC<ChannelAllocationStrategyProps> = ({
  data,
  disabled,
  onChange,
}) => {
  const { stockSettings } = data;
  const intl = useIntl();
  const classes = useStyles();

  return (
    <Card>
      <CardTitle title={intl.formatMessage(messages.allocationStrategy)} />
      <CardContent>
        <RadioGroupField
          label={
            <Typography>
              <FormattedMessage {...messages.allocationStrategyDescription} />
            </Typography>
          }
          choices={strategyOptions.map(option => ({
            label: (
              <div
                className={classes.option}
                data-test-id={`channel-allocation-strategy-option-${option.type}`}
              >
                <Typography variant="body1">
                  <FormattedMessage {...option.title} />
                </Typography>
                {option.subtitle && (
                  <Typography color="textSecondary" variant="caption">
                    <FormattedMessage {...option.subtitle} />
                  </Typography>
                )}
              </div>
            ),
            value: option.type,
          }))}
          disabled={disabled}
          name="allocationStrategy"
          value={stockSettings?.allocationStrategy}
          onChange={event =>
            onChange({
              ...event,
              target: {
                ...event.target,
                value: {
                  ...stockSettings,
                  allocationStrategy: event.target.value,
                },
                name: "stockSettings",
              },
            })
          }
        />
      </CardContent>
    </Card>
  );
};
ChannelAllocationStrategy.displayName = "ChannelAllocationStrategy";
export default ChannelAllocationStrategy;
