import GiftCardListPageDeleteDialog from "@saleor/giftCards/components/GiftCardDeleteDialog/GiftCardListPageDeleteDialog";
import GiftCardBulkCreateDialog from "@saleor/giftCards/GiftCardBulkCreateDialog";
import GiftCardCreateDialog from "@saleor/giftCards/GiftCardCreateDialog";
import { giftCardListUrl } from "@saleor/giftCards/urls";
import useNavigator from "@saleor/hooks/useNavigator";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React, { createContext } from "react";

import {
  GiftCardListActionParamsEnum,
  GiftCardListUrlQueryParams
} from "../../types";

interface GiftCardListDialogsProviderProps {
  children: React.ReactNode;
  params: GiftCardListUrlQueryParams;
}

export interface GiftCardListDialogsConsumerProps {
  openCreateDialog: () => void;
  openBulkCreateDialog: () => void;
  openDeleteDialog: (id?: string | React.MouseEvent) => void;
  openSearchSaveDialog: () => void;
  openSearchDeleteDialog: () => void;
  onClose: () => void;
  id: string;
}

export const GiftCardListDialogsContext = createContext<
  GiftCardListDialogsConsumerProps
>(null);

const GiftCardListDialogsProvider: React.FC<GiftCardListDialogsProviderProps> = ({
  children,
  params
}) => {
  const navigate = useNavigator();

  const id = params?.id;

  const [openDialog, onClose] = createDialogActionHandlers<
    GiftCardListActionParamsEnum,
    GiftCardListUrlQueryParams
  >(navigate, giftCardListUrl, params);

  const openCreateDialog = () =>
    openDialog(GiftCardListActionParamsEnum.CREATE);

  const openBulkCreateDialog = () =>
    openDialog(GiftCardListActionParamsEnum.BULK_CREATE);

  const isCreateDialogOpen =
    params?.action === GiftCardListActionParamsEnum.CREATE;

  const isDeleteDialogOpen =
    params?.action === GiftCardListActionParamsEnum.DELETE;

  const isBulkCreateDialogOpen =
    params?.action === GiftCardListActionParamsEnum.BULK_CREATE;

  const handleDeleteDialogOpen = (id?: string) => {
    openDialog(
      GiftCardListActionParamsEnum.DELETE,
      typeof id === "string" ? { id } : undefined
    );
  };

  const openSearchDeleteDialog = () =>
    openDialog(GiftCardListActionParamsEnum.DELETE_SEARCH);

  const openSearchSaveDialog = () =>
    openDialog(GiftCardListActionParamsEnum.SAVE_SEARCH);

  const providerValues: GiftCardListDialogsConsumerProps = {
    openCreateDialog,
    openBulkCreateDialog,
    openDeleteDialog: handleDeleteDialogOpen,
    openSearchSaveDialog,
    openSearchDeleteDialog,
    onClose,
    id
  };

  return (
    <GiftCardListDialogsContext.Provider value={providerValues}>
      {children}
      <GiftCardCreateDialog open={isCreateDialogOpen} onClose={onClose} />
      <GiftCardListPageDeleteDialog
        open={isDeleteDialogOpen}
        onClose={onClose}
      />
      <GiftCardBulkCreateDialog
        open={isBulkCreateDialogOpen}
        onClose={onClose}
      />
    </GiftCardListDialogsContext.Provider>
  );
};

export default GiftCardListDialogsProvider;
