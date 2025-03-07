import { commonStatusMessages } from "@dashboard/intl";
import { Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";

import { useStyles } from "./styles";

export const DeactivatedText = () => {
  const classes = useStyles({});

  return (
    <Text className={classes.root}>
      <FormattedMessage {...commonStatusMessages.deactivated} />
    </Text>
  );
};

export default DeactivatedText;
