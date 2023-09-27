// @ts-strict-ignore
import TablePagination from "@dashboard/components/TablePagination";
import TableRowLink from "@dashboard/components/TableRowLink";
import usePaginator from "@dashboard/hooks/usePaginator";
import { TableFooter } from "@material-ui/core";
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
      <TableRowLink>
        <TablePagination
          {...paginationValues}
          settings={settings}
          colSpan={numberOfColumns}
          onUpdateListSettings={updateListSettings}
        />
      </TableRowLink>
    </TableFooter>
  );
};

export default GiftCardsListTableFooter;
