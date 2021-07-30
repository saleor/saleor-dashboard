import PageHeader from "@saleor/components/PageHeader";
import PageTitleWithStatusChip from "@saleor/components/PageTitleWithStatusChip";
import { StatusType } from "@saleor/components/StatusChip/types";
import { sectionNames } from "@saleor/intl";
import { Backlink } from "@saleor/macaw-ui";
import React, { useContext } from "react";
import { useIntl } from "react-intl";

import { giftCardsListTableMessages as tableMessages } from "../GiftCardsList/messages";
import { GiftCardDetailsContext } from "./providers/GiftCardDetailsProvider";

interface GiftCardUpdatePageHeaderProps {
  onBack: () => void;
}

const GiftCardUpdatePageHeader: React.FC<GiftCardUpdatePageHeaderProps> = ({
  onBack
}) => {
  const intl = useIntl();
  const { giftCard } = useContext(GiftCardDetailsContext);

  if (!giftCard) {
    return null;
  }

  const { displayCode, isActive } = giftCard;

  const title = intl.formatMessage(tableMessages.codeEndingWithLabel, {
    displayCode
  });

  return (
    <>
      <Backlink onClick={onBack}>
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
      />
    </>
  );
};

export default GiftCardUpdatePageHeader;
