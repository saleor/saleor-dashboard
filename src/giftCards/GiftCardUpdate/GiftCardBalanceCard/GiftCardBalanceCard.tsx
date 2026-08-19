import useGiftCardDetails from "../providers/GiftCardDetailsProvider/hooks/useGiftCardDetails";
import useGiftCardUpdateDialogs from "../providers/GiftCardUpdateDialogsProvider/hooks/useGiftCardUpdateDialogs";
import { GiftCardBalanceCardView } from "./GiftCardBalanceCardView";

export const GiftCardBalanceCard = (): JSX.Element => {
  const { loading, giftCard } = useGiftCardDetails();
  const { openSetBalanceDialog } = useGiftCardUpdateDialogs();

  return (
    <GiftCardBalanceCardView
      giftCard={giftCard}
      loading={loading}
      onSetBalance={openSetBalanceDialog}
    />
  );
};
