import { Button } from "@material-ui/core";
import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import PageHeader from "@saleor/components/PageHeader";
import PageTitleWithStatusChip from "@saleor/components/PageTitleWithStatusChip";
import GiftCardStatusChip from "@saleor/giftCards/components/GiftCardStatusChip/GiftCardStatusChip";
import { sectionNames } from "@saleor/intl";
import { Backlink } from "@saleor/macaw-ui";
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

  if (!giftCard) {
    return null;
  }

  const { openResendCodeDialog } = useGiftCardUpdateDialogs();

  const { displayCode, isExpired } = giftCard;

  const title = intl.formatMessage(tableMessages.codeEndingWithLabel, {
    displayCode
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
          <Button
            color="primary"
            variant="contained"
            onClick={openResendCodeDialog}
          >
            {intl.formatMessage(messages.resendButtonLabel)}
          </Button>
        )}
      </PageHeader>
    </>
  );
};

export default GiftCardUpdatePageHeader;
