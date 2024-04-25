import { commonStatusMessages } from "@dashboard/intl";
import { Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "./styles";

export const DeactivatedText: React.FC<{}> = () => {
  const classes = useStyles({});

  return (
    <Typography className={classes.root}>
      <FormattedMessage {...commonStatusMessages.deactivated} />
    </Typography>
  );
};

export default DeactivatedText;
