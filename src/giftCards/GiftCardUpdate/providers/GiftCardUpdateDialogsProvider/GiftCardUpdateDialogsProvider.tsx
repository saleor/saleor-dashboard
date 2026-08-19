import { GiftCardUpdatePageDeleteDialog } from "@dashboard/giftCards/components/GiftCardDeleteDialog/GiftCardUpdatePageDeleteDialog";
import { giftCardsListPath, giftCardUrl } from "@dashboard/giftCards/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import { createContext, type ReactNode } from "react";

import { GiftCardAssignCustomerDialog } from "../../GiftCardAssignCustomerDialog/GiftCardAssignCustomerDialog";
import { GiftCardMetadataDialog } from "../../GiftCardMetadataDialog/GiftCardMetadataDialog";
import { GiftCardResendCodeDialog } from "../../GiftCardResendCodeDialog/GiftCardResendCodeDialog";
import { GiftCardUpdateBalanceDialog } from "../../GiftCardUpdateBalanceDialog/GiftCardUpdateBalanceDialog";
import {
  GiftCardUpdatePageActionParamsEnum,
  type GiftCardUpdatePageUrlQueryParams,
} from "../../types";
import useGiftCardDetails from "../GiftCardDetailsProvider/hooks/useGiftCardDetails";

interface GiftCardUpdateDialogsProviderProps {
  children: ReactNode;
  params: GiftCardUpdatePageUrlQueryParams;
  id: string;
}

export interface GiftCardUpdateDialogsConsumerProps {
  onClose: () => void;
  openSetBalanceDialog: () => void;
  openDeleteDialog: () => void;
  openResendCodeDialog: () => void;
  openAssignCustomerDialog: () => void;
  openMetadataDialog: () => void;
}

export const GiftCardUpdateDialogsContext =
  createContext<GiftCardUpdateDialogsConsumerProps | null>(null);

const GiftCardUpdateDialogsProvider = ({
  children,
  params,
  id,
}: GiftCardUpdateDialogsProviderProps) => {
  const navigate = useNavigator();
  const { loading: loadingGiftCard, giftCard } = useGiftCardDetails();
  const { SET_BALANCE, DELETE, RESEND_CODE, ASSIGN_CUSTOMER, VIEW_METADATA } =
    GiftCardUpdatePageActionParamsEnum;
  const [openDialog, onClose] = createDialogActionHandlers<
    GiftCardUpdatePageActionParamsEnum,
    GiftCardUpdatePageUrlQueryParams
  >(navigate, params => giftCardUrl(id, params), params);
  const isDialogOpen = (action: GiftCardUpdatePageActionParamsEnum) => params?.action === action;
  const navigateBack = () => navigate(giftCardsListPath);
  const providerValues: GiftCardUpdateDialogsConsumerProps = {
    openSetBalanceDialog: () => openDialog(SET_BALANCE),
    openDeleteDialog: () => openDialog(DELETE),
    openResendCodeDialog: () => openDialog(RESEND_CODE),
    openAssignCustomerDialog: () => openDialog(ASSIGN_CUSTOMER),
    openMetadataDialog: () => openDialog(VIEW_METADATA),
    onClose,
  };

  return (
    <GiftCardUpdateDialogsContext.Provider value={providerValues}>
      {children}
      {!loadingGiftCard && (
        <>
          <GiftCardUpdateBalanceDialog onClose={onClose} open={isDialogOpen(SET_BALANCE)} />
          <GiftCardUpdatePageDeleteDialog
            onClose={onClose}
            open={isDialogOpen(DELETE)}
            onDelete={navigateBack}
          />
          <GiftCardResendCodeDialog open={isDialogOpen(RESEND_CODE)} onClose={onClose} />
          <GiftCardAssignCustomerDialog open={isDialogOpen(ASSIGN_CUSTOMER)} onClose={onClose} />
          <GiftCardMetadataDialog
            open={isDialogOpen(VIEW_METADATA) && !!giftCard}
            onClose={onClose}
            giftCard={giftCard}
          />
        </>
      )}
    </GiftCardUpdateDialogsContext.Provider>
  );
};

export default GiftCardUpdateDialogsProvider;
