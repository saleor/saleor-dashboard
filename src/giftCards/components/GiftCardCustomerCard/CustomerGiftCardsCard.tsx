// @ts-strict-ignore
import { Button } from "@dashboard/components/Button";
import { DashboardCard } from "@dashboard/components/Card";
import CollectionWithDividers from "@dashboard/components/CollectionWithDividers";
import Link from "@dashboard/components/Link";
import { DashboardModal } from "@dashboard/components/Modal";
import PreviewPill from "@dashboard/components/PreviewPill";
import VerticalSpacer from "@dashboard/components/VerticalSpacer";
import { useCustomerDetails } from "@dashboard/customers/hooks/useCustomerDetails";
import GiftCardCreateDialogContent from "@dashboard/giftCards/GiftCardCreateDialog/GiftCardCreateDialogContent";
import { getExtendedGiftCard } from "@dashboard/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/utils";
import { giftCardListUrl } from "@dashboard/giftCards/urls";
import { useCustomerGiftCardListQuery } from "@dashboard/graphql";
import { getFullName } from "@dashboard/misc";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Skeleton, sprinkles } from "@saleor/macaw-ui-next";
import * as React from "react";
import { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import CustomerGiftCardsCardListItem from "./CustomerGiftCardsCardListItem";
import { giftCardCustomerCardMessages as messages } from "./messages";
import { CUSTOMER_GIFT_CARD_LIST_QUERY } from "./queries";

const CustomerGiftCardsCard: React.FC = () => {
  const intl = useIntl();
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const customerDetails = useCustomerDetails();
  const customer = customerDetails?.customer?.user;
  const id = customer?.id;

  const { data, loading } = useCustomerGiftCardListQuery({
    variables: {
      first: 5,
      filter: {
        usedBy: [id],
      },
    },
    skip: !id,
  });

  const closeCreateDialog = () => setOpenCreateDialog(false);

  const giftCards = mapEdgesToItems(data?.giftCards);

  const viewAllGiftCardsUrl = giftCardListUrl({
    usedBy: [id],
  });

  const handleCreateNewCardButton = () => {
    setOpenCreateDialog(true);
  };

  return (
    <>
      <DashboardCard>
        <DashboardCard.Header>
          <DashboardCard.Title
            title={intl.formatMessage(messages.customerGiftCardsCardTitle)}
            toolbar={
              <>
                {!!giftCards?.length && (
                  <Button variant="tertiary" href={viewAllGiftCardsUrl} component={Link}>
                    <FormattedMessage {...messages.customerGiftCardsViewAllButton} />
                  </Button>
                )}
                <PreviewPill className={sprinkles({ marginLeft: 2 })} />
              </>
            }
          >
            <FormattedMessage
              {...(giftCards?.length
                ? messages.customerGiftCardsPresentSubtitle
                : messages.customerGiftCardsAbsentSubtitle)}
            />
            <VerticalSpacer spacing={2} />
          </DashboardCard.Title>
        </DashboardCard.Header>

        {!loading && giftCards ? (
          <CollectionWithDividers
            collection={giftCards}
            renderItem={giftCard => (
              <CustomerGiftCardsCardListItem giftCard={getExtendedGiftCard(giftCard)} />
            )}
            withOuterDividers
          />
        ) : (
          <Skeleton height={2} marginX={6} />
        )}
        <DashboardCard.Actions paddingX={6} paddingY={0}>
          <Button
            variant="tertiary"
            onClick={handleCreateNewCardButton}
            data-test-id="issue-new-gift-card"
          >
            <FormattedMessage {...messages.customerGiftCardsIssueNewCardButton} />
          </Button>
        </DashboardCard.Actions>
      </DashboardCard>
      <DashboardModal open={openCreateDialog} onChange={closeCreateDialog}>
        <GiftCardCreateDialogContent
          onClose={closeCreateDialog}
          refetchQueries={[CUSTOMER_GIFT_CARD_LIST_QUERY]}
          initialCustomer={{
            email: customer?.email,
            name: getFullName(customer),
          }}
        />
      </DashboardModal>
    </>
  );
};

export default CustomerGiftCardsCard;
