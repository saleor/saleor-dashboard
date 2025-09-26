import { DashboardCard } from "@dashboard/components/Card";
import { Text } from "@saleor/macaw-ui-next";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  title: {
    id: "CT5PAn",
    defaultMessage: "Availability",
    description: "CannotDefineChannelsAvailabilityCard title",
  },
  subtitle: {
    id: "8qL/tV",
    defaultMessage: "You will be able to define availability of product after creating variants.",
    description: "CannotDefineChannelsAvailabilityCard subtitle",
  },
});
const CannotDefineChannelsAvailabilityCard = () => (
  <DashboardCard gap={2}>
    <DashboardCard.Header>
      <DashboardCard.Title>
        <FormattedMessage {...messages.title} />
      </DashboardCard.Title>
    </DashboardCard.Header>
    <DashboardCard.Content>
      <Text size={2} color="default2">
        <FormattedMessage {...messages.subtitle} />
      </Text>
    </DashboardCard.Content>
  </DashboardCard>
);

export default CannotDefineChannelsAvailabilityCard;
