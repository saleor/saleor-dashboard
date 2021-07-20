import PageHeader from "@saleor/components/PageHeader";
import PageTitleWithStatusChip from "@saleor/components/PageTitleWithStatusChip";
import { StatusType } from "@saleor/components/StatusChip/types";
import React, { useContext } from "react";
import { useIntl } from "react-intl";

import { giftCardsListTableMessages as tableMessages } from "../GiftCardsList/messages";
import { GiftCardDetailsContext } from "./GiftCardDetailsProvider";

interface GiftCardUpdatePageHeaderProps {}

const GiftCardUpdatePageHeader: React.FC<GiftCardUpdatePageHeaderProps> = ({}) => {
  const intl = useIntl();
  const { giftCard } = useContext(GiftCardDetailsContext);
  const { code } = giftCard;

  return (
    <PageHeader
      inline
      title={
        <PageTitleWithStatusChip
          title={`${intl.formatMessage(
            tableMessages.codeEndingWithLabel
          )} ${code}`}
          statusLabel={intl.formatMessage(tableMessages.giftCardDisabledLabel)}
          statusType={StatusType.ERROR}
        />
      }
    />
  );
};

export default GiftCardUpdatePageHeader;
