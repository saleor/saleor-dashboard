import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles
} from "@material-ui/core";
import CardTitle from "@saleor/components/CardTitle";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardUpdateDetailsCardMessages as messages } from "./messages";

interface GiftCardUpdateDetailsCardProps {}

const useStyles = makeStyles(
  () => ({
    setBalanceButton: {
      marginTop: 10
    }
  }),
  { name: "GiftCardUpdateDetailsCard" }
);

const GiftCardUpdateDetailsCard: React.FC<GiftCardUpdateDetailsCardProps> = ({}) => {
  const intl = useIntl();
  const classes = useStyles({});

  return (
    <Card>
      <CardHeader
        title={intl.formatMessage(messages.title)}
        action={
          <Button
            className={classes.setBalanceButton}
            color="primary"
            // onClick={navigateToCustomAppCreate}
            data-test-id="createApp"
          >
            {intl.formatMessage(messages.setBalanceButtonLabel)}
          </Button>
        }
      />
      <Divider />
      <CardContent>lol</CardContent>
    </Card>
  );
};

export default GiftCardUpdateDetailsCard;
