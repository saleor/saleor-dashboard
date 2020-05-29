import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage } from "react-intl";

interface ActiveTextProps {
  isActive: boolean;
}

export const ActiveText: React.FC<ActiveTextProps> = ({ isActive }) => (
  <Typography data-tc="isActive" variant="caption">
    {isActive ? (
      <FormattedMessage defaultMessage="active" description="app status" />
    ) : (
      <FormattedMessage defaultMessage="inactive" description="app status" />
    )}
  </Typography>
);

export default ActiveText;
