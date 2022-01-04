import { Dialog } from "@material-ui/core";
import GiftCardListPageDeleteDialog from "@saleor/giftCards/components/GiftCardDeleteDialog/GiftCardListPageDeleteDialog";
import GiftCardBulkCreateDialog from "@saleor/giftCards/GiftCardBulkCreateDialog";
import GiftCardCreateDialog from "@saleor/giftCards/GiftCardCreateDialog";
import GiftCardExportDialog from "@saleor/giftCards/GiftCardExportDialog";
import { giftCardListUrl } from "@saleor/giftCards/urls";
import useNavigator from "@saleor/hooks/useNavigator";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import React, { createContext } from "react";

import {
  GIFT_CARD_LIST_QUERY,
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
  openExportDialog: () => void;
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

  const { CREATE, DELETE, EXPORT, BULK_CREATE } = GiftCardListActionParamsEnum;

  const [openDialog, onClose] = createDialogActionHandlers<
    GiftCardListActionParamsEnum,
    GiftCardListUrlQueryParams
  >(navigate, giftCardListUrl, params);

  const handleOpenDialog = (type: GiftCardListActionParamsEnum) => () =>
    openDialog(type);

  const isDialogOpen = (type: GiftCardListActionParamsEnum) =>
    params?.action === type;

  const handleDeleteDialogOpen = (id?: string) => {
    openDialog(DELETE, id ? { id } : undefined);
  };

  const openSearchDeleteDialog = () =>
    openDialog(GiftCardListActionParamsEnum.DELETE_SEARCH);

  const openSearchSaveDialog = () =>
    openDialog(GiftCardListActionParamsEnum.SAVE_SEARCH);

  const providerValues: GiftCardListDialogsConsumerProps = {
    openCreateDialog: handleOpenDialog(CREATE),
    openExportDialog: handleOpenDialog(EXPORT),
    openBulkCreateDialog: handleOpenDialog(BULK_CREATE),
    openDeleteDialog: handleDeleteDialogOpen,
    openSearchSaveDialog,
    openSearchDeleteDialog,
    onClose,
    id
  };

  return (
    <GiftCardListDialogsContext.Provider value={providerValues}>
      {children}
      <Dialog open={isDialogOpen(CREATE)} maxWidth="sm">
        <GiftCardCreateDialog
          onClose={onClose}
          refetchQueries={[GIFT_CARD_LIST_QUERY]}
        />
      </Dialog>
      <GiftCardListPageDeleteDialog
        open={isDialogOpen(DELETE)}
        onClose={onClose}
      />
      <GiftCardExportDialog open={isDialogOpen(EXPORT)} onClose={onClose} />
      <GiftCardBulkCreateDialog
        open={isDialogOpen(BULK_CREATE)}
        onClose={onClose}
      />
    </GiftCardListDialogsContext.Provider>
  );
};

export default GiftCardListDialogsProvider;
