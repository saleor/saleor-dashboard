import Typography from "@material-ui/core/Typography";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "./styles";

export const DeactivatedText: React.FC<{}> = () => {
  const classes = useStyles({});
  return (
    <Typography className={classes.root}>
      <FormattedMessage
        defaultMessage="Deactivated"
        description="app deactivated"
      />
    </Typography>
  );
};

export default DeactivatedText;
