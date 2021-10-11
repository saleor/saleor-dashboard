import GiftCardListPageDeleteDialog from "@saleor/giftCards/components/GiftCardDeleteDialog/GiftCardListPageDeleteDialog";
import GiftCardBulkCreateDialog from "@saleor/giftCards/GiftCardBulkCreateDialog";
import GiftCardCreateDialog from "@saleor/giftCards/GiftCardCreateDialog";
import { giftCardsListUrl } from "@saleor/giftCards/urls";
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
  closeDialog: () => void;
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

  const [openDialog, closeDialog] = createDialogActionHandlers<
    GiftCardListActionParamsEnum,
    GiftCardListUrlQueryParams
  >(navigate, giftCardsListUrl, params);

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

  const providerValues: GiftCardListDialogsConsumerProps = {
    openCreateDialog,
    openBulkCreateDialog,
    openDeleteDialog: handleDeleteDialogOpen,
    closeDialog,
    id
  };

  return (
    <GiftCardListDialogsContext.Provider value={providerValues}>
      {children}
      <GiftCardCreateDialog
        open={isCreateDialogOpen}
        closeDialog={closeDialog}
      />
      <GiftCardListPageDeleteDialog
        open={isDeleteDialogOpen}
        closeDialog={closeDialog}
      />
      <GiftCardBulkCreateDialog
        open={isBulkCreateDialogOpen}
        closeDialog={closeDialog}
      />
    </GiftCardListDialogsContext.Provider>
  );
};

export default GiftCardListDialogsProvider;
