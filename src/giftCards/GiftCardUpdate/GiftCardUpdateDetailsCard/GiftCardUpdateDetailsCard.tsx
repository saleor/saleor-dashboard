import { Button, Card, CardContent, Divider } from "@material-ui/core";
import CardSpacer from "@saleor/components/CardSpacer";
import CardTitle from "@saleor/components/CardTitle";
import Skeleton from "@saleor/components/Skeleton";
import GiftCardTagInput from "@saleor/giftCards/components/GiftCardTagInput";
import GiftCardUpdateExpirySelect from "@saleor/giftCards/GiftCardUpdate/GiftCardUpdateExpirySelect";
import React from "react";
import { useIntl } from "react-intl";

import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useGiftCardUpdateDialogs from "../providers/GiftCardUpdateDialogsProvider/hooks/useGiftCardUpdateDialogs";
import GiftCardUpdateDetailsBalanceSection from "./GiftCardUpdateDetailsBalanceSection";
import GiftCardUpdateDetailsTagSection from "./GiftCardUpdateDetailsTagSection";
import { giftCardUpdateDetailsCardMessages as messages } from "./messages";

const GiftCardUpdateDetailsCard: React.FC = () => {
  const intl = useIntl();

  const { loading, giftCard } = useGiftCardDetails();
  const { openSetBalanceDialog } = useGiftCardUpdateDialogs();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(messages.title)}
        toolbar={
          !loading &&
          !giftCard?.isExpired && (
            <Button
              data-test-id="set-balance-button"
              color="primary"
              onClick={openSetBalanceDialog}
            >
              {intl.formatMessage(messages.setBalanceButtonLabel)}
            </Button>
          )
        }
      />
      <CardContent>
        <Skeleton>
          {!loading && (
            <>
              <GiftCardUpdateDetailsBalanceSection />
              <CardSpacer />
              <Divider />
              <CardSpacer />
              <GiftCardUpdateDetailsTagSection />
              <CardSpacer />
              <GiftCardUpdateExpirySelect />
            </>
          )}
        </Skeleton>
      </CardContent>
    </Card>
  );
};

export default GiftCardUpdateDetailsCard;
