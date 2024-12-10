import { useGiftCardProductsCountQuery } from "@dashboard/graphql";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { Alert } from "@saleor/macaw-ui";
import { useIntl } from "react-intl";

import { giftCardsListHeaderMenuItemsMessages as messages } from "../messages";
import GiftCardsListHeaderAlertContent from "./GiftCardsListHeaderAlertContent";

const GiftCardsListHeaderAlert = () => {
  const intl = useIntl();
  const [selectedChannel] = useLocalStorage("channel", "");
  const { data: giftCardProductsCount, loading: giftCardProductsCountLoading } =
    useGiftCardProductsCountQuery({
      variables: {
        channel: selectedChannel,
      },
    });
  const giftCardProductTypesExist =
    (giftCardProductsCount?.giftCardProductTypes?.totalCount ?? 0) > 0;
  const giftCardProductsExist = (giftCardProductsCount?.giftCardProducts?.totalCount ?? 0) > 0;
  const showNoGiftCardProductsAlert =
    !giftCardProductsCountLoading && (!giftCardProductTypesExist || !giftCardProductsExist);

  if (showNoGiftCardProductsAlert) {
    return (
      <Alert
        title={intl.formatMessage(messages.noGiftCardsAlertTitle)}
        variant="warning"
        close={false}
        className="remove-icon-background remove-content-padding-top "
      >
        <GiftCardsListHeaderAlertContent
          giftCardProductTypesExist={giftCardProductTypesExist}
          giftCardProductsExist={giftCardProductsExist}
        />
      </Alert>
    );
  }

  return null;
};

export default GiftCardsListHeaderAlert;
