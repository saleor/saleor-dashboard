import { DashboardCard } from "@dashboard/components/Card";
import { NewRadioGroupField as RadioGroupField } from "@dashboard/components/RadioGroupField";
import { AllocationStrategyEnum, StockSettingsInput } from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { Text, Tooltip } from "@saleor/macaw-ui-next";
import { CircleQuestionMark } from "lucide-react";
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
  onChange: (event: ChangeEvent) => void;
}

const ChannelAllocationStrategy = ({
  data,
  disabled,
  onChange,
}: ChannelAllocationStrategyProps) => {
  const classes = useStyles();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>
          <div className={classes.preview}>
            <FormattedMessage {...messages.allocationStrategy} />
          </div>
        </DashboardCard.Title>
      </DashboardCard.Header>

      <DashboardCard.Content>
        <RadioGroupField
          label={
            <Text marginBottom={4} display="block">
              <FormattedMessage {...messages.allocationStrategyDescription} />
              <Tooltip>
                <Tooltip.Trigger>
                  <CircleQuestionMark className={classes.tooltipIcon} />
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
              <>
                <FormattedMessage {...option.title} />
                {option.subtitle && (
                  <Text size={2} fontWeight="light" color="default2" display="block">
                    <FormattedMessage {...option.subtitle} />
                  </Text>
                )}
              </>
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
