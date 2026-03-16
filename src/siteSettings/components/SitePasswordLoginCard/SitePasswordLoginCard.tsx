import { DashboardCard } from "@dashboard/components/Card";
import { SimpleRadioGroupField } from "@dashboard/components/SimpleRadioGroupField";
import { PasswordLoginModeEnum } from "@dashboard/graphql/staging";
import { type ChangeEvent } from "@dashboard/hooks/useForm";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useIntl } from "react-intl";

import { messages } from "./messages";

interface SitePasswordLoginCardProps {
  value: PasswordLoginModeEnum;
  onChange: (event: ChangeEvent) => void;
}

export const SitePasswordLoginCard = ({ value, onChange }: SitePasswordLoginCardProps) => {
  const intl = useIntl();

  return (
    <DashboardCard>
      <DashboardCard.Header>
        <DashboardCard.Title>{intl.formatMessage(messages.cardHeader)}</DashboardCard.Title>
      </DashboardCard.Header>
      <DashboardCard.Content>
        <SimpleRadioGroupField
          name="passwordLoginMode"
          value={value}
          onChange={onChange}
          choices={[
            {
              label: (
                <Box>
                  <Text>{intl.formatMessage(messages.enabled)}</Text>
                  <Text size={2} color="default2" display="block">
                    {intl.formatMessage(messages.enabledDescription)}
                  </Text>
                </Box>
              ),
              value: PasswordLoginModeEnum.ENABLED,
            },
            {
              label: (
                <Box>
                  <Text>{intl.formatMessage(messages.customersOnly)}</Text>
                  <Text size={2} color="default2" display="block">
                    {intl.formatMessage(messages.customersOnlyDescription)}
                  </Text>
                </Box>
              ),
              value: PasswordLoginModeEnum.CUSTOMERS_ONLY,
            },
            {
              label: (
                <Box>
                  <Text>{intl.formatMessage(messages.disabled)}</Text>
                  <Text size={2} color="default2" display="block">
                    {intl.formatMessage(messages.disabledDescription)}
                  </Text>
                </Box>
              ),
              value: PasswordLoginModeEnum.DISABLED,
            },
          ]}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
