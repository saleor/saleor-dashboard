import { commonStatusMessages } from "@dashboard/intl";
import { Text } from "@saleor/macaw-ui-next";
import React from "react";
import { FormattedMessage } from "react-intl";

import { useStyles } from "./styles";

export const DeactivatedText: React.FC<{}> = () => {
  const classes = useStyles({});

  return (
    <Text className={classes.root}>
      <FormattedMessage {...commonStatusMessages.deactivated} />
    </Text>
  );
};

export default DeactivatedText;
