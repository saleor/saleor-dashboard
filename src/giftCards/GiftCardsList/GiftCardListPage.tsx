import { DashboardCard } from "@dashboard/components/Card";
import { DeleteFilterTabDialog } from "@dashboard/components/DeleteFilterTabDialog";
import { ListPageLayout } from "@dashboard/components/Layouts";
import { SaveFilterTabDialog } from "@dashboard/components/SaveFilterTabDialog/SaveFilterTabDialog";

import GiftCardListSearchAndFilters from "./GiftCardListSearchAndFilters";
import { GiftCardsListDatagrid } from "./GiftCardsListDatagrid";
import GiftCardsListHeader from "./GiftCardsListHeader";
import { useGiftCardListDialogs } from "./providers/GiftCardListDialogsProvider";
import { useGiftCardList } from "./providers/GiftCardListProvider";
import { GiftCardListActionParamsEnum } from "./types";

export const GiftCardListPage = (): JSX.Element => {
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
