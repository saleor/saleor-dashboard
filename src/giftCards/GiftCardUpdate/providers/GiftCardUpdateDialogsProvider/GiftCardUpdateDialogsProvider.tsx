import GiftCardUpdatePageDeleteDialog from "@saleor/giftCards/components/GiftCardDeleteDialog/GiftCardUpdatePageDeleteDialog";
import { giftCardsListPath, giftCardUrl } from "@saleor/giftCards/urls";
import useNavigator from "@saleor/hooks/useNavigator";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React, { createContext } from "react";

import GiftCardResendCodeDialog from "../../GiftCardResendCodeDialog";
import GiftCardUpdateBalanceDialog from "../../GiftCardUpdateBalanceDialog";
import {
  GiftCardUpdatePageActionParamsEnum,
  GiftCardUpdatePageUrlQueryParams,
} from "../../types";
import useGiftCardDetails from "../GiftCardDetailsProvider/hooks/useGiftCardDetails";

interface GiftCardUpdateDialogsProviderProps {
  children: React.ReactNode;
  params: GiftCardUpdatePageUrlQueryParams;
  id: string;
}

export interface GiftCardUpdateDialogsConsumerProps {
  onClose: () => void;
  openSetBalanceDialog: () => void;
  openDeleteDialog: () => void;
  openResendCodeDialog: () => void;
}

export const GiftCardUpdateDialogsContext = createContext<
  GiftCardUpdateDialogsConsumerProps
>(null);

const GiftCardUpdateDialogsProvider: React.FC<GiftCardUpdateDialogsProviderProps> = ({
  children,
  params,
  id,
}) => {
  const navigate = useNavigator();

  const { loading: loadingGiftCard } = useGiftCardDetails();

  const {
    SET_BALANCE,
    DELETE,
    RESEND_CODE,
  } = GiftCardUpdatePageActionParamsEnum;

  const [openDialog, onClose] = createDialogActionHandlers<
    GiftCardUpdatePageActionParamsEnum,
    GiftCardUpdatePageUrlQueryParams
  >(navigate, params => giftCardUrl(id, params), params);

  const isDialogOpen = (action: GiftCardUpdatePageActionParamsEnum) =>
    params?.action === action;

  const navigateBack = () => navigate(giftCardsListPath);

  const providerValues: GiftCardUpdateDialogsConsumerProps = {
    openSetBalanceDialog: () => openDialog(SET_BALANCE),
    openDeleteDialog: () => openDialog(DELETE),
    openResendCodeDialog: () => openDialog(RESEND_CODE),
    onClose,
  };

  return (
    <GiftCardUpdateDialogsContext.Provider value={providerValues}>
      {children}
      {!loadingGiftCard && (
        <>
          <GiftCardUpdateBalanceDialog
            onClose={onClose}
            open={isDialogOpen(SET_BALANCE)}
          />
          <GiftCardUpdatePageDeleteDialog
            onClose={onClose}
            open={isDialogOpen(DELETE)}
            onDelete={navigateBack}
          />
          <GiftCardResendCodeDialog
            open={isDialogOpen(RESEND_CODE)}
            onClose={onClose}
          />
        </>
      )}
    </GiftCardUpdateDialogsContext.Provider>
  );
};

export default GiftCardUpdateDialogsProvider;
