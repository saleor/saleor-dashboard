import { DashboardCard } from "@dashboard/components/Card";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { NewRadioGroupField as RadioGroupField } from "@dashboard/components/RadioGroupField";
import { AllocationStrategyEnum, type StockSettingsInput } from "@dashboard/graphql";
import { type ChangeEvent } from "@dashboard/hooks/useForm";
import { Text, Tooltip } from "@macaw-ui";
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
          label="Allocation strategy"
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
          disabled={disabled ? "true" : "false"}
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
