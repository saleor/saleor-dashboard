import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage } from "react-intl";
interface ErrorMessageCardProps {
  message: string;
}

const ErrorMessageCard: React.FC<ErrorMessageCardProps> = ({ message }) => (
  <Card>
    <CardContent>
      <Typography variant="h5" component="h2">
        <FormattedMessage defaultMessage="Error" description="header" />
      </Typography>
      <Typography variant="body1">{message}</Typography>
    </CardContent>
  </Card>
);
ErrorMessageCard.displayName = "ErrorMessageCard";
export default ErrorMessageCard;
