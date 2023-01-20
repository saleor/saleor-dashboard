import HorizontalSpacer from "@dashboard/apps/components/HorizontalSpacer";
import { Backlink } from "@dashboard/components/Backlink";
import { Button } from "@dashboard/components/Button";
import PageHeader from "@dashboard/components/PageHeader";
import GiftCardStatusChip from "@dashboard/giftCards/components/GiftCardStatusChip/GiftCardStatusChip";
import { giftCardsListPath } from "@dashboard/giftCards/urls";
import { sectionNames } from "@dashboard/intl";
import { getStringOrPlaceholder } from "@dashboard/misc";
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
