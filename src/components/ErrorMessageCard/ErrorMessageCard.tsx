import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { DashboardCard } from "../Card";

interface ErrorMessageCardProps {
  message: string;
}

const ErrorMessageCard = ({ message }: ErrorMessageCardProps) => (
  <DashboardCard>
    <DashboardCard.Content>
      <Text size={3} fontWeight="bold" lineHeight={2} as="h2">
        <FormattedMessage id="7v2oBd" defaultMessage="Error" description="header" />
      </Text>
      <Text size={4} fontWeight="regular">
        {message}
      </Text>
    </DashboardCard.Content>
  </DashboardCard>
);

ErrorMessageCard.displayName = "ErrorMessageCard";
export default ErrorMessageCard;
