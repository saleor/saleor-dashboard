// @ts-strict-ignore
import CollectionWithDividers from "@dashboard/components/CollectionWithDividers/CollectionWithDividers";
import { DetailSettingsCard } from "@dashboard/components/DetailSettingsCard/DetailSettingsCard";
import { Placeholder } from "@dashboard/components/Placeholder/Placeholder";
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
      <DetailSettingsCard
        data-test-id="customer-gift-cards"
        title={<FormattedMessage {...messages.customerGiftCardsCardTitle} />}
        headerEnd={
          <Button
            variant="secondary"
            onClick={handleCreateNewCardButton}
            data-test-id="issue-new-gift-card"
            disabled={!customer}
          >
            <FormattedMessage {...messages.customerGiftCardsIssueNewCardButton} />
          </Button>
        }
      >
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
      </DetailSettingsCard>
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
