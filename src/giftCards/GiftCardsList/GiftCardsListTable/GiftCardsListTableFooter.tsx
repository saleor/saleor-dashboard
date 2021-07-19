import { TableFooter, TableRow } from "@material-ui/core";
import TablePagination from "@saleor/components/TablePagination";
import useListSettings from "@saleor/hooks/useListSettings";
import { PageInfo } from "@saleor/hooks/useLocalPaginator";
import usePaginator, {
  createPaginationState
} from "@saleor/hooks/usePaginator";
import { ListViews } from "@saleor/types";
import React from "react";

import { GiftCardListColummns } from "../types";

interface GiftCardsListTableFooterProps {
  giftCardsPageInfo: PageInfo;
  numberOfColumns: number;
  disabled: boolean;
}

const GiftCardsListTableFooter: React.FC<GiftCardsListTableFooterProps> = ({
  giftCardsPageInfo,
  numberOfColumns,
  disabled
}) => {
  const paginate = usePaginator();

  const { updateListSettings, settings } = useListSettings<
    GiftCardListColummns
  >(ListViews.GIFT_CARD_LIST);

  const paginationState = createPaginationState(settings.rowNumber /* params*/);

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    giftCardsPageInfo,
    paginationState
    // params
  );

  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          colSpan={numberOfColumns}
          settings={settings}
          hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
          onNextPage={loadNextPage}
          onUpdateListSettings={updateListSettings}
          hasPreviousPage={
            pageInfo && !disabled ? pageInfo.hasPreviousPage : false
          }
          onPreviousPage={loadPreviousPage}
        />
      </TableRow>
    </TableFooter>
  );
};

export default GiftCardsListTableFooter;
