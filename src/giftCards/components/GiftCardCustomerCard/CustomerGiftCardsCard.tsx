import { Button, Card, CardActions, Dialog } from "@material-ui/core";
import VerticalSpacer from "@saleor/apps/components/VerticalSpacer";
import CardTitle from "@saleor/components/CardTitle";
import CollectionWithDividers from "@saleor/components/CollectionWithDividers";
import Skeleton from "@saleor/components/Skeleton";
import { useCustomerDetails } from "@saleor/customers/hooks/useCustomerDetails";
import GiftCardCreateDialogContent from "@saleor/giftCards/GiftCardCreateDialog/GiftCardCreateDialogContent";
import { getExtendedGiftCard } from "@saleor/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/utils";
import { giftCardListUrl } from "@saleor/giftCards/urls";
import useNavigator from "@saleor/hooks/useNavigator";
import { getFullName } from "@saleor/misc";
import { mapEdgesToItems } from "@saleor/utils/maps";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CustomerGiftCardsCardListItem from "./CustomerGiftCardsCardListItem";
import { giftCardCustomerCardMessages as messages } from "./messages";
import {
  CUSTOMER_GIFT_CARD_LIST_QUERY,
  useCustomerGiftCardQuery
} from "./queries";
import { useCardActionsStyles } from "./styles";

const CustomerGiftCardsCard: React.FC = () => {
  const intl = useIntl();
  const navigate = useNavigator();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const customerDetails = useCustomerDetails();
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

  const closeCreateDialog = () => setOpenCreateDialog(false);

  const giftCards = mapEdgesToItems(data?.giftCards);

  const classes = useCardActionsStyles({
    buttonPosition: giftCards?.length > 0 ? "right" : "left"
  });

  const handleViewAllButton = () => {
    navigate(
      giftCardListUrl({
        usedBy: [id]
      })
    );
  };

  const handleCreateNewCardButton = () => {
    setOpenCreateDialog(true);
  };

  return (
    <>
      <Card>
        <CardTitle
          title={intl.formatMessage(messages.customerGiftCardsCardTitle)}
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
        <Skeleton>
          {!loading && giftCards && (
            <CollectionWithDividers
              collection={giftCards}
              renderItem={giftCard => (
                <CustomerGiftCardsCardListItem
                  giftCard={getExtendedGiftCard(giftCard)}
                />
              )}
              withOuterDividers
            />
          )}
        </Skeleton>
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
      <Dialog open={openCreateDialog} maxWidth="sm">
        <GiftCardCreateDialogContent
          onClose={closeCreateDialog}
          refetchQueries={[CUSTOMER_GIFT_CARD_LIST_QUERY]}
          initialCustomer={{
            email: customer?.email,
            name: getFullName(customer)
          }}
        />
      </Dialog>
    </>
  );
};

export default CustomerGiftCardsCard;
