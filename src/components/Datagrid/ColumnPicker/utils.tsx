import { ArrowLeftIcon, CloseIcon } from "@saleor/macaw-ui-next";
import React, { Dispatch, SetStateAction } from "react";

import { AvailableColumn } from "../types";
import { ColumnCategory } from "./useColumns";

export const filterEmptyColumn = (column: AvailableColumn) => column.title !== "";

export const getExitIcon = (
  columnCategories: ColumnCategory[],
  currentCategory: ColumnCategory | undefined,
) => {
  if (columnCategories.length === 1) {
    return <CloseIcon />;
  }

  if (currentCategory) {
    return <ArrowLeftIcon />;
  }

  return <CloseIcon />;
};

export const getExitOnClick = ({
  columnCategories,
  currentCategory,
  setCurrentCategory,
  onClose,
}: {
  columnCategories: ColumnCategory[];
  currentCategory: ColumnCategory | undefined;
  setCurrentCategory: Dispatch<SetStateAction<string | null>>;
  onClose: () => void;
}) => {
  if (columnCategories?.length === 1) {
    return onClose;
  }

  if (currentCategory) {
    return () => setCurrentCategory(null);
  } else {
    return onClose;
  }
};

export const isLastEnabledColumn = (
  columnIdToCheck: string,
  columnsToCheck: AvailableColumn[],
  selectedColumns: string[],
): boolean => {
  const enabledColumns = columnsToCheck.filter(column => selectedColumns.includes(column.id));

  return enabledColumns.length === 1 && enabledColumns[0].id === columnIdToCheck;
};

export const sortColumns = (columns: AvailableColumn[] | undefined, order: string[]) =>
  columns?.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id)) ?? null;

export const areCategoriesLoaded = (categories: ColumnCategory[] | undefined) =>
  categories?.every(category => Array.isArray(category.selectedNodes));

export const extractSelectedNodesFromCategories = (categories: ColumnCategory[] | undefined) =>
  categories?.flatMap(category => category.selectedNodes).filter(isValidColumn);

export const isValidColumn = (column: AvailableColumn | undefined): column is AvailableColumn =>
  !!column;

export const findDynamicColumn = (categories: ColumnCategory[] | undefined, columnId: string) =>
  categories?.flatMap(category => category.availableNodes).find(column => column?.id === columnId);

export const mergeSelectedColumns = ({
  staticColumns,
  dynamicColumns,
  selectedColumns,
}: {
  staticColumns: AvailableColumn[];
  dynamicColumns: AvailableColumn[] | null;
  selectedColumns: string[];
}) => {
  return [...staticColumns, ...(dynamicColumns ?? [])].filter(
    column => selectedColumns.includes(column.id) || column.id === "empty",
  );
};
