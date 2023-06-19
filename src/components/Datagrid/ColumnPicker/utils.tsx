import { ArrowLeftIcon, CloseIcon } from "@saleor/macaw-ui/next";
import uniqBy from "lodash/uniqBy";
import React from "react";

import { AvailableColumn } from "../types";
import { ColumnCategory } from "./useColumns";

export const filterEmptyColumn = (column: AvailableColumn) =>
  column.title !== "";

export const getExitIcon = (
  columnCategories: ColumnCategory[],
  currentCategory: ColumnCategory,
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
  currentCategory: ColumnCategory;
  setCurrentCategory: (category: string | undefined) => void;
  onClose: () => void;
}) => {
  if (columnCategories.length === 1) {
    return onClose;
  }
  if (currentCategory) {
    return () => setCurrentCategory(undefined);
  } else {
    return onClose;
  }
};

export const getExitDataTestId = (
  columnCategories: ColumnCategory[],
  currentCategory: ColumnCategory,
) => {
  if (columnCategories.length === 1) {
    return "close-search";
  }
  if (currentCategory) {
    return "back-search";
  }
  return "close-search";
};

export const isLastEnabledColumn = (
  columnIdToCheck: string,
  targetArray: AvailableColumn[],
  selectedColumns: string[],
): boolean => {
  const enabledColumns = targetArray.filter(column =>
    selectedColumns.includes(column.id),
  );
  return (
    enabledColumns.length === 1 && enabledColumns[0].id === columnIdToCheck
  );
};

export const sortColumns = (columns: AvailableColumn[], order: string[]) =>
  columns.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

export const filterColumns = (columns: AvailableColumn[], selected: string[]) =>
  columns.filter(column => selected.includes(column.id));

export const areCategoriesLoaded = (categories: ColumnCategory[] | undefined) =>
  categories?.every(category => Array.isArray(category.selectedNodes));

export const extractSelectedNodesFromCategories = (
  categories: ColumnCategory[] | undefined,
) => categories.flatMap(category => category.selectedNodes);

export const extractAvailableNodesFromCategories = (
  categories: ColumnCategory[] | undefined,
) => categories.flatMap(category => category.availableNodes);

export const mergeSelectedColumns = ({
  staticColumns,
  dynamicColumns,
  selectedColumns,
}: {
  staticColumns: AvailableColumn[];
  dynamicColumns: AvailableColumn[];
  selectedColumns: string[];
}) =>
  [...staticColumns, ...(dynamicColumns ?? [])].filter(
    column => selectedColumns.includes(column.id) || column.id === "empty",
  );

export const mergeCurrentDynamicColumnsWithCandidates = (
  dynamicColumns: AvailableColumn[] | undefined,
  candidates: AvailableColumn[],
) => uniqBy([...(dynamicColumns ?? []), ...candidates], "id");
