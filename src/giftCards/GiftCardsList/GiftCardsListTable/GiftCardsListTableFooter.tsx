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
  const paginate = usePaginator();

  const {
    settings,
    updateListSettings,
    pageInfo: apiPageInfo,
    paginationState,
    params
  } = useContext(GiftCardsListContext);

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
          hasNextPage={pageInfo && !disabled ? pageInfo.hasNextPage : false}
          onNextPage={loadNextPage}
          onUpdateListSettings={updateListSettings}
          onPreviousPage={loadPreviousPage}
          hasPreviousPage={
            pageInfo && !disabled ? pageInfo.hasPreviousPage : false
          }
        />
      </TableRow>
    </TableFooter>
  );
};

export default GiftCardsListTableFooter;
