import { Button, Card, CardContent, Divider } from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import GiftCardExpirySelect from "@saleor/giftCards/components/GiftCardExpirySelect";
import GiftCardTagInput from "@saleor/giftCards/components/GiftCardTagInput";
import React, { useContext } from "react";
import { useIntl } from "react-intl";

import { GiftCardUpdateFormContext } from "../GiftCardUpdateFormProvider";
import GiftCardUpdateDetailsBalanceSection from "./GiftCardUpdateDetailsBalanceSection";
import { giftCardUpdateDetailsCardMessages as messages } from "./messages";

const GiftCardUpdateDetailsCard: React.FC = ({}) => {
  const intl = useIntl();

  const {
    change,
    setSelectedTag,
    data: { expiryType, expiryPeriodAmount, expiryPeriodType }
  } = useContext(GiftCardUpdateFormContext);

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(messages.title)}
        toolbar={
          <Button data-test-id="set-balance-button" color="primary">
            {intl.formatMessage(messages.setBalanceButtonLabel)}
          </Button>
        }
      />
      <CardContent>
        <GiftCardUpdateDetailsBalanceSection />
        <CardSpacer />
        <Divider />
        <CardSpacer />
        <GiftCardTagInput
          withTopLabel
          change={change}
          setSelected={setSelectedTag}
        />
        <CardSpacer />
        <GiftCardExpirySelect
          change={change}
          expiryType={expiryType}
          expiryPeriodAmount={expiryPeriodAmount}
          expiryPeriodType={expiryPeriodType}
        />
      </CardContent>
    </Card>
  );
};

export default GiftCardUpdateDetailsCard;
