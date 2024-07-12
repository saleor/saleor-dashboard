import { DashboardCard } from "@dashboard/components/Card";
import PreviewPill from "@dashboard/components/PreviewPill";
import RadioGroupField from "@dashboard/components/RadioGroupField";
import { AllocationStrategyEnum, StockSettingsInput } from "@dashboard/graphql";
import HelpOutline from "@material-ui/icons/HelpOutline";
import { Text, Tooltip } from "@saleor/macaw-ui-next";
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
    <DashboardCard>
      <DashboardCard.Title>
        <div className={classes.preview}>
          <FormattedMessage {...messages.allocationStrategy} />
          <PreviewPill />
        </div>
      </DashboardCard.Title>

      <DashboardCard.Content>
        <RadioGroupField
          label={
            <Text>
              <FormattedMessage {...messages.allocationStrategyDescription} />
              <Tooltip>
                <Tooltip.Trigger>
                  <HelpOutline className={classes.tooltipIcon} />
                </Tooltip.Trigger>
                <Tooltip.Content side="bottom">
                  <Tooltip.Arrow />
                  <FormattedMessage {...messages.allocaationMayOccur} />
                  <ul>
                    <li>
                      <FormattedMessage {...messages.allocaationMayOccurWithTrackInventory} />
                    </li>
                    <li>
                      <FormattedMessage {...messages.allocaationMayOccurWithReservationTime} />
                    </li>
                  </ul>
                </Tooltip.Content>
              </Tooltip>
            </Text>
          }
          choices={strategyOptions.map(option => ({
            label: (
              <div
                className={classes.option}
                data-test-id={`channel-allocation-strategy-option-${option.type}`}
              >
                <Text>
                  <FormattedMessage {...option.title} />
                </Text>
                {option.subtitle && (
                  <Text fontWeight="light">
                    <FormattedMessage {...option.subtitle} />
                  </Text>
                )}
              </div>
            ),
            value: option.type,
          }))}
          disabled={disabled}
          name="allocationStrategy"
          value={data?.allocationStrategy!}
          onChange={onChange}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};

ChannelAllocationStrategy.displayName = "ChannelAllocationStrategy";
export default ChannelAllocationStrategy;
