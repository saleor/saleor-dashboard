import { DashboardCard } from "@dashboard/components/Card";
import { DeleteFilterTabDialog } from "@dashboard/components/DeleteFilterTabDialog/DeleteFilterTabDialog";
import { ListPageLayout } from "@dashboard/components/Layouts/List/Root";
import { SaveFilterTabDialog } from "@dashboard/components/SaveFilterTabDialog/SaveFilterTabDialog";

import GiftCardListSearchAndFilters from "./GiftCardListSearchAndFilters/GiftCardListSearchAndFilters";
import { GiftCardsListDatagrid } from "./GiftCardsListDatagrid/GiftCardsListDatagrid";
import GiftCardsListHeader from "./GiftCardsListHeader/GiftCardsListHeader";
import { useGiftCardListDialogs } from "./providers/GiftCardListDialogsProvider/GiftCardListDialogsProvider";
import { useGiftCardList } from "./providers/GiftCardListProvider/GiftCardListProvider";
import { GiftCardListActionParamsEnum } from "./types";

export const GiftCardListPage = (): React.ReactNode => {
  const { params, onPresetSave, onPresetDelete, getPresetNameToDelete } = useGiftCardList();
  const { onClose } = useGiftCardListDialogs();

  return (
    <>
      <ListPageLayout>
        <GiftCardsListHeader />
        <DashboardCard>
          <GiftCardListSearchAndFilters />
          <GiftCardsListDatagrid />
        </DashboardCard>
      </ListPageLayout>
      <SaveFilterTabDialog
        open={params.action === GiftCardListActionParamsEnum.SAVE_SEARCH}
        confirmButtonState="default"
        onClose={onClose}
        onSubmit={onPresetSave}
      />
      <DeleteFilterTabDialog
        open={params.action === GiftCardListActionParamsEnum.DELETE_SEARCH}
        confirmButtonState="default"
        onClose={onClose}
        onSubmit={onPresetDelete}
        tabName={getPresetNameToDelete()}
      />
    </>
  );
};
