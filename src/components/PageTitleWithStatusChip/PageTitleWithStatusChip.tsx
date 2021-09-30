import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import GiftCardStatusChip from "@saleor/giftCards/components/GiftCardStatusChip/GiftCardStatusChip";
import {
  ExtendedGiftCard,
  GiftCardBase
} from "@saleor/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";
import { useIntl } from "react-intl";

import StatusChip from "../StatusChip";
import { StatusType } from "../StatusChip/types";

export interface PageTitleWithStatusChipProps {
  title: string;
  giftCard?: ExtendedGiftCard<GiftCardBase & { isActive: boolean }>;
  statusLabel?: string;
  statusType?: StatusType;
}

const useStyles = makeStyles(
  () => ({
    container: {
      alignItems: "center",
      display: "flex"
    }
  }),
  { name: "OrderDetailsPageTitleWithStatusChip" }
);

const PageTitleWithStatusChip: React.FC<PageTitleWithStatusChipProps> = ({
  title,
  giftCard,
  statusLabel,
  statusType
}) => {
  const classes = useStyles({});
  const intl = useIntl();

  const getStatusChip = () => {
    if (statusLabel && statusType) {
      return (
        <StatusChip
          size="md"
          status={statusType}
          label={intl.formatMessage({
            defaultMessage: statusLabel,
            description: "status chip label"
          })}
        />
      );
    }

    return <GiftCardStatusChip giftCard={giftCard} />;
  };

  return (
    <div className={classes.container}>
      {title}
      <HorizontalSpacer spacing={2} />
      {getStatusChip()}
    </div>
  );
};

export default PageTitleWithStatusChip;
