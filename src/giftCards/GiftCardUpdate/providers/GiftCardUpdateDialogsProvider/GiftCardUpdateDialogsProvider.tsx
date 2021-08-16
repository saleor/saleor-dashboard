import { giftCardsListPath, giftCardUrl } from "@saleor/giftCards/urls";
import useNavigator from "@saleor/hooks/useNavigator";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React, { createContext } from "react";

import GiftCardUpdateBalanceDialog from "../../GiftCardUpdateBalanceDialog";
import {
  GiftCardUpdatePageActionParamsEnum,
  GiftCardUpdatePageUrlQueryParams
} from "../../types";
import useGiftCardDetails from "../GiftCardDetailsProvider/hooks/useGiftCardDetails";

interface GiftCardUpdateDialogsProviderProps {
  children: React.ReactNode;
  params: GiftCardUpdatePageUrlQueryParams;
  id: string;
}

export interface GiftCardUpdateDialogsConsumerProps {
  navigateBack: () => void;
  openSetBalanceDialog: () => void;
  closeDialog: () => void;
}

export const GiftCardUpdateDialogsContext = createContext<
  GiftCardUpdateDialogsConsumerProps
>(null);

const GiftCardUpdateDialogsProvider: React.FC<GiftCardUpdateDialogsProviderProps> = ({
  children,
  params,
  id
}) => {
  const navigate = useNavigator();

  const { loading: loadingGiftCard } = useGiftCardDetails();

  const [openDialog, closeDialog] = createDialogActionHandlers<
    GiftCardUpdatePageActionParamsEnum,
    GiftCardUpdatePageUrlQueryParams
  >(navigate, params => giftCardUrl(id, params), params);

  const openSetBalanceDialog = () =>
    openDialog(GiftCardUpdatePageActionParamsEnum.SET_BALANCE);

  const isSetBalanceDialogOpen =
    params?.action === GiftCardUpdatePageActionParamsEnum.SET_BALANCE;

  const navigateBack = () => navigate(giftCardsListPath);

  const providerValues: GiftCardUpdateDialogsConsumerProps = {
    openSetBalanceDialog,
    closeDialog,
    navigateBack
  };

  return (
    <GiftCardUpdateDialogsContext.Provider value={providerValues}>
      {children}
      {!loadingGiftCard && (
        <GiftCardUpdateBalanceDialog
          onClose={closeDialog}
          open={isSetBalanceDialogOpen}
        />
      )}
    </GiftCardUpdateDialogsContext.Provider>
  );
};

export default GiftCardUpdateDialogsProvider;
