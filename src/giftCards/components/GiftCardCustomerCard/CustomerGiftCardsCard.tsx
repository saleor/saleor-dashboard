// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import CollectionWithDividers from "@dashboard/components/CollectionWithDividers";
import { Placeholder } from "@dashboard/components/Placeholder";
import { useCustomerDetails } from "@dashboard/customers/hooks/useCustomerDetails";
import { GiftCardCreateDialogContent } from "@dashboard/giftCards/GiftCardCreateDialog/GiftCardCreateDialogContent";
import { getExtendedGiftCard } from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/utils";
import { useCustomerGiftCardListQuery } from "@dashboard/graphql";
import { getFullName } from "@dashboard/misc";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Button, Skeleton } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CustomerGiftCardsCardListItem from "./CustomerGiftCardsCardListItem";
import { giftCardCustomerCardMessages as messages } from "./messages";
import { CUSTOMER_GIFT_CARD_LIST_QUERY } from "./queries";

export const CustomerGiftCardsCard = () => {
  const intl = useIntl();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const customerDetails = useCustomerDetails();
  const customer = customerDetails?.customer?.user;
  const id = customer?.id;

  const { data, loading } = useCustomerGiftCardListQuery({
    variables: {
      userId: id,
      first: 5,
    },
    skip: !id,
  });

  const giftCards = mapEdgesToItems(data?.user?.giftCards);
  const hasGiftCards = !!giftCards?.length;

  const closeCreateDialog = () => setOpenCreateDialog(false);
  const handleCreateNewCardButton = () => setOpenCreateDialog(true);

  return (
    <>
      <DashboardCard>
        <DashboardCard.Header>
          <DashboardCard.Title size={6} fontWeight="medium">
            <FormattedMessage {...messages.customerGiftCardsCardTitle} />
          </DashboardCard.Title>
          <DashboardCard.Toolbar>
            <Button
              variant="secondary"
              onClick={handleCreateNewCardButton}
              data-test-id="issue-new-gift-card"
              disabled={!customer}
            >
              <FormattedMessage {...messages.customerGiftCardsIssueNewCardButton} />
            </Button>
          </DashboardCard.Toolbar>
        </DashboardCard.Header>
        <DashboardCard.Content>
          {loading || !giftCards ? (
            <Skeleton height={2} />
          ) : hasGiftCards ? (
            <CollectionWithDividers
              collection={giftCards}
              renderItem={giftCard => (
                <CustomerGiftCardsCardListItem giftCard={getExtendedGiftCard(giftCard)} />
              )}
              withOuterDividers
            />
          ) : (
            <Placeholder>
              <FormattedMessage {...messages.customerGiftCardsAbsentSubtitle} />
            </Placeholder>
          )}
        </DashboardCard.Content>
      </DashboardCard>
      <GiftCardCreateDialogContent
        open={openCreateDialog}
        onClose={closeCreateDialog}
        refetchQueries={[CUSTOMER_GIFT_CARD_LIST_QUERY]}
        initialCustomer={{
          email: customer?.email,
          name:
            getFullName(customer) ||
            intl.formatMessage({
              defaultMessage: "Unknown customer",
              id: "+mbkbU",
              description: "unknown customer display name",
            }),
        }}
      />
    </>
  );
};
