import { Typography } from "@material-ui/core";
import React from "react";
import { FormattedMessage } from "react-intl";

import { messages } from "./messages";
import { useActionsStyles } from "./styles";

export interface ComingSoonTextProps {
  releaseDate: string;
}

const ComingSoonText = ({ releaseDate }: ComingSoonTextProps) => {
  const classes = useActionsStyles();

  return (
    <Typography className={classes.releaseDate}>
      <FormattedMessage
        {...messages.releaseComingSoon}
        values={{
          releaseDate,
        }}
      />
    </Typography>
  );
};
ComingSoonText.displayName = "ComingSoonText";
export default ComingSoonText;
