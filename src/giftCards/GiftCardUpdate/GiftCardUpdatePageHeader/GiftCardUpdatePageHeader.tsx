import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import { Backlink } from "@saleor/components/Backlink";
import { Button } from "@saleor/components/Button";
import PageHeader from "@saleor/components/PageHeader";
import GiftCardStatusChip from "@saleor/giftCards/components/GiftCardStatusChip/GiftCardStatusChip";
import { giftCardsListPath } from "@saleor/giftCards/urls";
import { sectionNames } from "@saleor/intl";
import { getStringOrPlaceholder } from "@saleor/misc";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardsListTableMessages as tableMessages } from "../../GiftCardsList/messages";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useGiftCardUpdateDialogs from "../providers/GiftCardUpdateDialogsProvider/hooks/useGiftCardUpdateDialogs";
import GiftCardEnableDisableSection from "./GiftCardEnableDisableSection";
import { giftCardUpdatePageHeaderMessages as messages } from "./messages";
import useStyles from "./styles";

const GiftCardUpdatePageHeader: React.FC = () => {
  const classes = useStyles();
  const intl = useIntl();
  const { giftCard } = useGiftCardDetails();

  const { openResendCodeDialog } = useGiftCardUpdateDialogs();

  if (!giftCard) {
    return <PageHeader preview title={getStringOrPlaceholder(undefined)} />;
  }

  const { last4CodeChars, isExpired } = giftCard;

  const title = intl.formatMessage(tableMessages.codeEndingWithLabel, {
    last4CodeChars,
  });

  return (
    <>
      <Backlink href={giftCardsListPath}>
        {intl.formatMessage(sectionNames.giftCards)}
      </Backlink>
      <PageHeader
        preview
        inline
        title={
          <div className={classes.title}>
            {title}
            <HorizontalSpacer spacing={2} />
            <GiftCardStatusChip giftCard={giftCard} />
          </div>
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
