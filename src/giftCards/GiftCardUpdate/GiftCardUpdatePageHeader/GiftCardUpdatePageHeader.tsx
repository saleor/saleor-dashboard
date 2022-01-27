import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import PageHeader from "@saleor/components/PageHeader";
import PageTitleWithStatusChip from "@saleor/components/PageTitleWithStatusChip";
import GiftCardStatusChip from "@saleor/giftCards/components/GiftCardStatusChip/GiftCardStatusChip";
import { sectionNames } from "@saleor/intl";
import { Backlink, Button } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardsListTableMessages as tableMessages } from "../../GiftCardsList/messages";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useGiftCardUpdateDialogs from "../providers/GiftCardUpdateDialogsProvider/hooks/useGiftCardUpdateDialogs";
import GiftCardEnableDisableSection from "./GiftCardEnableDisableSection";
import { giftCardUpdatePageHeaderMessages as messages } from "./messages";

const GiftCardUpdatePageHeader: React.FC = () => {
  const intl = useIntl();
  const { giftCard } = useGiftCardDetails();
  const { navigateBack } = useGiftCardUpdateDialogs();

  const { openResendCodeDialog } = useGiftCardUpdateDialogs();

  if (!giftCard) {
    return null;
  }

  const { last4CodeChars, isExpired } = giftCard;

  const title = intl.formatMessage(tableMessages.codeEndingWithLabel, {
    last4CodeChars
  });

  return (
    <>
      <Backlink onClick={navigateBack}>
        {intl.formatMessage(sectionNames.giftCards)}
      </Backlink>
      <PageHeader
        inline
        title={
          <PageTitleWithStatusChip title={title}>
            <GiftCardStatusChip giftCard={giftCard} />
          </PageTitleWithStatusChip>
        }
      >
        <GiftCardEnableDisableSection />
        <HorizontalSpacer />
        {!isExpired && (
          <Button variant="primary" onClick={openResendCodeDialog}>
            {intl.formatMessage(messages.resendButtonLabel)}
          </Button>
        )}
      </PageHeader>
    </>
  );
};

export default GiftCardUpdatePageHeader;
