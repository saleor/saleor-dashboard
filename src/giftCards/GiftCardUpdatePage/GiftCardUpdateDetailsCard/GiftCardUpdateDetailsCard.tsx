import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  makeStyles
} from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import GiftCardTagInput from "@saleor/giftCards/components/GiftCardTagInput";
import React from "react";
import { useIntl } from "react-intl";

import GiftCardUpdateDetailsBalanceSection from "./GiftCardUpdateDetailsBalanceSection";
import { giftCardUpdateDetailsCardMessages as messages } from "./messages";

interface GiftCardUpdateDetailsCardProps {}

const GiftCardUpdateDetailsCard: React.FC<GiftCardUpdateDetailsCardProps> = ({}) => {
  const intl = useIntl();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(messages.title)}
        toolbar={
          <Button
            data-test-id="createApp"
            color="primary"
            // onClick={navigateToCustomAppCreate}
          >
            {intl.formatMessage(messages.setBalanceButtonLabel)}
          </Button>
        }
      />
      <CardContent>
        <GiftCardUpdateDetailsBalanceSection />
        <CardSpacer />
        <Divider />
        <CardSpacer />
        <GiftCardTagInput />
      </CardContent>
    </Card>
  );
};

export default GiftCardUpdateDetailsCard;
