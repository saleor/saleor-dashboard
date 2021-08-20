import { TableFooter, TableRow } from "@material-ui/core";
import TablePagination from "@saleor/components/TablePagination";
import usePaginator from "@saleor/hooks/usePaginator";
import React from "react";

import useGiftCardList from "../providers/GiftCardListProvider/hooks/useGiftCardList";

const GiftCardsListTableFooter: React.FC = () => {
  const paginate = usePaginator();

  const {
    settings,
    updateListSettings,
    pageInfo: apiPageInfo,
    paginationState,
    params,
    numberOfColumns
  } = useGiftCardList();

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    apiPageInfo,
    paginationState,
    params
  );

  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          settings={settings}
          colSpan={numberOfColumns}
          hasNextPage={pageInfo ? pageInfo.hasNextPage : false}
          onNextPage={loadNextPage}
          onUpdateListSettings={updateListSettings}
          onPreviousPage={loadPreviousPage}
          hasPreviousPage={pageInfo ? pageInfo.hasPreviousPage : false}
        />
      </TableRow>
    </TableFooter>
  );
};

export default GiftCardsListTableFooter;
