import { TableFooter, TableRow } from "@material-ui/core";
import TablePagination from "@saleor/components/TablePagination";
import usePaginator from "@saleor/hooks/usePaginator";
import React, { useContext } from "react";

import { GiftCardsListContext } from "../GiftCardsListProvider";
import { GiftCardsListTableCommonProps } from "../types";

const GiftCardsListTableFooter: React.FC<GiftCardsListTableCommonProps> = ({
  numberOfColumns,
  disabled
}) => {
  const {
    settings,
    updateListSettings,
    pageInfo: apiPageInfo,
    paginationState,
    params
  } = useContext(GiftCardsListContext);
  const paginate = usePaginator();

  const { loadNextPage, loadPreviousPage, pageInfo } = paginate(
    apiPageInfo,
    paginationState,
    params
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
