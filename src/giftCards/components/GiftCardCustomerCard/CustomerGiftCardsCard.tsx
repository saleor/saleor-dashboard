import { Button, Card, CardActions } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import CardTitle from "@saleor/components/CardTitle";
import { CustomerDetailsContext } from "@saleor/customers/providers/CustomerDetailsProvider";
import GiftCardCreateDialog from "@saleor/giftCards/GiftCardCreateDialog/GiftCardCreateDialog";
import { getFullName } from "@saleor/misc";
import { mapEdgesToItems } from "@saleor/utils/maps";
import * as React from "react";
import { useContext } from "react";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import CustomerGiftCardsList from "./CustomerGiftCardsList";
import { giftCardCustomerCardMessages as messages } from "./messages";
import {
  CUSTOMER_GIFT_CARD_LIST_QUERY,
  useCustomerGiftCardQuery
} from "./queries";
import { useCardActionsStyles } from "./styles";

const CustomerGiftCardsCard: React.FC = () => {
  const customerDetails = useContext(CustomerDetailsContext);
  const customer = customerDetails?.customer?.user;
  const id = customer?.id;

  const { data, loading } = useCustomerGiftCardQuery({
    variables: {
      first: 5,
      filter: {
        usedBy: [id]
      }
    }
  });
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const closeCreateDialog = () => setOpenCreateDialog(false);

  const giftCards = mapEdgesToItems(data?.giftCards);

  const classes = useCardActionsStyles({
    buttonPosition: giftCards?.length > 0 ? "right" : "left"
  });

  const handleViewAllButton = () => {
    // history push to filtered gift cards
  };

  const handleCreateNewCardButton = () => {
    setOpenCreateDialog(true);
  };

  return (
    <>
      <Card>
        <CardTitle
          title="Gift Cards"
          toolbar={
            !!giftCards?.length && (
              <Button
                variant="text"
                color="primary"
                onClick={handleViewAllButton}
              >
                <FormattedMessage
                  {...messages.customerGiftCardsViewAllButton}
                />
              </Button>
            )
          }
        >
          <FormattedMessage
            {...(!!giftCards?.length
              ? messages.customerGiftCardsPresentSubtitle
              : messages.customerGiftCardsAbsentSubtitle)}
          />
          <VerticalSpacer spacing={2} />
        </CardTitle>
        <CustomerGiftCardsList giftCards={giftCards} loading={loading} />
        <CardActions className={classes.cardActions}>
          <Button
            variant="text"
            color="primary"
            onClick={handleCreateNewCardButton}
          >
            <FormattedMessage
              {...messages.customerGiftCardsIssueNewCardButton}
            />
          </Button>
        </CardActions>
      </Card>
      <GiftCardCreateDialog
        open={openCreateDialog}
        closeDialog={closeCreateDialog}
        refetchQueries={[CUSTOMER_GIFT_CARD_LIST_QUERY]}
        initialCustomer={{
          email: customer?.email,
          name: getFullName({
            firstName: customer?.firstName,
            lastName: customer?.lastName
          })
        }}
      />
    </>
  );
};

export default CustomerGiftCardsCard;
