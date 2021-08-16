import PageHeader from "@saleor/components/PageHeader";
import PageTitleWithStatusChip from "@saleor/components/PageTitleWithStatusChip";
import { StatusType } from "@saleor/components/StatusChip/types";
import { sectionNames } from "@saleor/intl";
import { Backlink } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import { giftCardsListTableMessages as tableMessages } from "../../GiftCardsList/messages";
import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useGiftCardUpdateDialogs from "../providers/GiftCardUpdateDialogsProvider/hooks/useGiftCardUpdateDialogs";
import GiftCardEnableDisableSection from "./GiftCardEnableDisableSection";

const GiftCardUpdatePageHeader: React.FC = () => {
  const intl = useIntl();
  const { giftCard } = useGiftCardDetails();
  const { navigateBack } = useGiftCardUpdateDialogs();

  if (!giftCard) {
    return null;
  }

  const { displayCode, isActive } = giftCard;

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
          isActive ? (
            title
          ) : (
            <PageTitleWithStatusChip
              title={title}
              statusLabel={intl.formatMessage(
                tableMessages.giftCardDisabledLabel
              )}
              statusType={StatusType.ERROR}
            />
          )
        }
      >
        <GiftCardEnableDisableSection />
      </PageHeader>
    </>
  );
};

export default GiftCardUpdatePageHeader;
