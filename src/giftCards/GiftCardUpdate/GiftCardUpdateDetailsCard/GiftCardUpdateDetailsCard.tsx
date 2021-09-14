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
import useGiftCardUpdateForm from "../providers/GiftCardUpdateFormProvider/hooks/useGiftCardUpdateForm";
import GiftCardUpdateDetailsBalanceSection from "./GiftCardUpdateDetailsBalanceSection";
import { giftCardUpdateDetailsCardMessages as messages } from "./messages";

const GiftCardUpdateDetailsCard: React.FC = () => {
  const intl = useIntl();

  const { loading } = useGiftCardDetails();
  const { openSetBalanceDialog } = useGiftCardUpdateDialogs();

  const {
    change,
    data: { tag },
    formErrors
  } = useGiftCardUpdateForm();

  return (
    <Card>
      <CardTitle
        title={intl.formatMessage(messages.title)}
        toolbar={
          <Button
            data-test-id="set-balance-button"
            color="primary"
            onClick={openSetBalanceDialog}
          >
            {intl.formatMessage(messages.setBalanceButtonLabel)}
          </Button>
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
              <GiftCardTagInput
                error={formErrors?.tag}
                name="tag"
                withTopLabel
                value={tag}
                change={change}
              />
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
