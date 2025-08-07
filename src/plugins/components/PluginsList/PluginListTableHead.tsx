// @ts-strict-ignore
import TableCellHeader from "@dashboard/components/TableCellHeader";
import { PluginListUrlSortField } from "@dashboard/plugins/urls";
import { SortPage } from "@dashboard/types";
import { getArrowDirection } from "@dashboard/utils/sort";
import { TableHead } from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";

import { pluginsListTableHeadMessages as messages } from "./messages";

type PluginListTableHeadProps = SortPage<PluginListUrlSortField>;

const PluginListTableHead = ({ sort, onSort }: PluginListTableHeadProps) => {
  const intl = useIntl();

  return (
    <TableHead>
      <TableCellHeader
        direction={
          sort.sort === PluginListUrlSortField.name ? getArrowDirection(sort.asc) : undefined
        }
        arrowPosition="right"
        onClick={() => onSort(PluginListUrlSortField.name)}
        colSpan={5}
      >
        {intl.formatMessage(messages.nameLabel)}
      </TableCellHeader>
      <TableCellHeader
        colSpan={2}
        direction={
          sort.sort === PluginListUrlSortField.active ? getArrowDirection(sort.asc) : undefined
        }
        onClick={() => onSort(PluginListUrlSortField.active)}
      >
        {intl.formatMessage(messages.confLabel)}
      </TableCellHeader>
      <TableCellHeader colSpan={2}>{intl.formatMessage(messages.channelLabel)}</TableCellHeader>
      <TableCellHeader></TableCellHeader>
    </TableHead>
  );
};

export default PluginListTableHead;
