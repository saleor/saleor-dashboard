import { Card, CardContent, Typography } from "@material-ui/core";
import HelpOutline from "@material-ui/icons/HelpOutline";
import CardTitle from "@saleor/components/CardTitle";
import PreviewPill from "@saleor/components/PreviewPill";
import RadioGroupField from "@saleor/components/RadioGroupField";
import { AllocationStrategyEnum, StockSettingsInput } from "@saleor/graphql";
import { Tooltip } from "@saleor/macaw-ui";
import React from "react";
import { FormattedMessage } from "react-intl";

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
  data?: StockSettingsInput;
  disabled: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const ChannelAllocationStrategy: React.FC<ChannelAllocationStrategyProps> = ({
  data,
  disabled,
  onChange,
}) => {
  const classes = useStyles();

  return (
    <Card>
      <CardTitle
        title={
          <div className={classes.preview}>
            <FormattedMessage {...messages.allocationStrategy} />
            <PreviewPill />
          </div>
        }
      />
      <CardContent>
        <RadioGroupField
          label={
            <Typography>
              <FormattedMessage {...messages.allocationStrategyDescription} />
              <Tooltip
                title={
                  <>
                    <FormattedMessage {...messages.allocaationMayOccur} />
                    <ul>
                      <li>
                        <FormattedMessage
                          {...messages.allocaationMayOccurWithTrackInventory}
                        />
                      </li>
                      <li>
                        <FormattedMessage
                          {...messages.allocaationMayOccurWithReservationTime}
                        />
                      </li>
                    </ul>
                  </>
                }
              >
                <HelpOutline className={classes.tooltipIcon} />
              </Tooltip>
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
          value={data?.allocationStrategy}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
ChannelAllocationStrategy.displayName = "ChannelAllocationStrategy";
export default ChannelAllocationStrategy;
