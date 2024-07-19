import { Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import { DashboardCard } from "../Card";

interface ErrorMessageCardProps {
  message: string;
}

const ErrorMessageCard: React.FC<ErrorMessageCardProps> = ({ message }) => (
  <DashboardCard>
    <DashboardCard.Content>
      <Typography variant="h5" component="h2">
        <FormattedMessage id="7v2oBd" defaultMessage="Error" description="header" />
      </Typography>
      <Typography variant="body1">{message}</Typography>
    </DashboardCard.Content>
  </DashboardCard>
);

ErrorMessageCard.displayName = "ErrorMessageCard";
export default ErrorMessageCard;
