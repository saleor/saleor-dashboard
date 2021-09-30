import HorizontalSpacer from "@saleor/apps/components/HorizontalSpacer";
import GiftCardStatusChip from "@saleor/giftCards/components/GiftCardStatusChip/GiftCardStatusChip";
import {
  ExtendedGiftCard,
  GiftCardBase
} from "@saleor/giftCards/GiftCardUpdate/providers/GiftCardDetailsProvider/types";
import { makeStyles } from "@saleor/macaw-ui";
import React from "react";

export interface PageTitleWithStatusChipProps {
  title: string;
  giftCard: ExtendedGiftCard<GiftCardBase & { isActive: boolean }>;
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
  giftCard
}) => {
  const classes = useStyles({});

  return (
    <div className={classes.container}>
      {title}
      <HorizontalSpacer spacing={2} />
      <GiftCardStatusChip giftCard={giftCard} />
    </div>
  );
};

export default PageTitleWithStatusChip;
