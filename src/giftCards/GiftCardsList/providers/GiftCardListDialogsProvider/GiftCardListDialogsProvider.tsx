import { DashboardModal } from "@dashboard/components/Modal";
import GiftCardListPageDeleteDialog from "@dashboard/giftCards/components/GiftCardDeleteDialog/GiftCardListPageDeleteDialog";
import GiftCardBulkCreateDialog from "@dashboard/giftCards/GiftCardBulkCreateDialog";
import GiftCardCreateDialogContent from "@dashboard/giftCards/GiftCardCreateDialog";
import GiftCardExportDialogContent from "@dashboard/giftCards/GiftCardExportDialogContent";
import { giftCardListUrl } from "@dashboard/giftCards/urls";
import useNavigator from "@dashboard/hooks/useNavigator";
import createDialogActionHandlers from "@dashboard/utils/handlers/dialogActionHandlers";
import React, { createContext, useContext } from "react";

import { GIFT_CARD_LIST_QUERY } from "../../queries";
import { GiftCardListActionParamsEnum, GiftCardListUrlQueryParams } from "../../types";

interface GiftCardListDialogsProviderProps {
  children: React.ReactNode;
  params: GiftCardListUrlQueryParams;
}

interface GiftCardListDialogsConsumerProps {
  openCreateDialog: () => void;
  openBulkCreateDialog: () => void;
  openDeleteDialog: (id?: string | React.MouseEvent) => void;
  openSearchSaveDialog: () => void;
  openSearchDeleteDialog: () => void;
  onClose: () => void;
  openExportDialog: () => void;
  id: string;
}

const GiftCardListDialogsContext = createContext<GiftCardListDialogsConsumerProps | null>(null);

export const useGiftCardListDialogs = () => {
  const context = useContext(GiftCardListDialogsContext);

  if (!context) {
    throw new Error("You are trying to use GiftCardListDialogsContext outside of its provider");
  }

  return context;
};

const GiftCardListDialogsProvider: React.FC<GiftCardListDialogsProviderProps> = ({
  children,
  params,
}) => {
  const navigate = useNavigator();
  const id = params?.id;
  const { CREATE, DELETE, EXPORT, BULK_CREATE } = GiftCardListActionParamsEnum;
  const [openDialog, onClose] = createDialogActionHandlers<
    GiftCardListActionParamsEnum,
    GiftCardListUrlQueryParams
  >(navigate, giftCardListUrl, params);
  const handleOpenDialog = (type: GiftCardListActionParamsEnum) => () => openDialog(type);
  const isDialogOpen = (type: GiftCardListActionParamsEnum) => params?.action === type;
  const handleDeleteDialogOpen = () => {
    openDialog(DELETE);
  };
  const openSearchDeleteDialog = () => openDialog(GiftCardListActionParamsEnum.DELETE_SEARCH);
  const openSearchSaveDialog = () => openDialog(GiftCardListActionParamsEnum.SAVE_SEARCH);
  const providerValues: GiftCardListDialogsConsumerProps = {
    openCreateDialog: handleOpenDialog(CREATE),
    openExportDialog: handleOpenDialog(EXPORT),
    openBulkCreateDialog: handleOpenDialog(BULK_CREATE),
    openDeleteDialog: handleDeleteDialogOpen,
    openSearchSaveDialog,
    openSearchDeleteDialog,
    onClose,
    id: id ?? "",
  };

  return (
    <GiftCardListDialogsContext.Provider value={providerValues}>
      {children}
      <DashboardModal open={isDialogOpen(CREATE)} onChange={onClose}>
        <GiftCardCreateDialogContent onClose={onClose} refetchQueries={[GIFT_CARD_LIST_QUERY]} />
      </DashboardModal>
      <GiftCardListPageDeleteDialog open={isDialogOpen(DELETE)} onClose={onClose} />
      <DashboardModal open={isDialogOpen(EXPORT)} onChange={onClose}>
        <GiftCardExportDialogContent onClose={onClose} />
      </DashboardModal>
      <GiftCardBulkCreateDialog open={isDialogOpen(BULK_CREATE)} onClose={onClose} />
    </GiftCardListDialogsContext.Provider>
  );
};

export default GiftCardListDialogsProvider;
