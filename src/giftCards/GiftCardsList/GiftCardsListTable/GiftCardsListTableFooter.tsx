import { TableFooter, TableRow } from "@material-ui/core";
import TablePagination from "@saleor/components/TablePagination";
import usePaginator from "@saleor/hooks/usePaginator";
import React from "react";

import { useGiftCardList } from "../providers/GiftCardListProvider";

const GiftCardsListTableFooter: React.FC = () => {
  const {
    settings,
    updateListSettings,
    pageInfo: apiPageInfo,
    paginationState,
    params,
    numberOfColumns,
  } = useGiftCardList();

  const paginationValues = usePaginator({
    pageInfo: apiPageInfo,
    paginationState,
    queryString: params,
  });

  return (
    <TableFooter>
      <TableRow>
        <TablePagination
          {...paginationValues}
          settings={settings}
          colSpan={numberOfColumns}
          onUpdateListSettings={updateListSettings}
        />
      </TableRow>
    </TableFooter>
  );
};

export default GiftCardsListTableFooter;
