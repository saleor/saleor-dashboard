import { ArrowLeftIcon, CloseIcon } from "@saleor/macaw-ui/next";
import React from "react";

import { AvailableColumn } from "../Datagrid/types";
import { ColumnCategory } from "./useColumns";

export const filterEmptyColumn = (column: AvailableColumn) =>
  column.title !== "";

export const getExitIcon = (
  columnCategories: ColumnCategory[],
  selectedCategory: string,
) => {
  if (columnCategories.length === 1) {
    return <CloseIcon />;
  }
  if (selectedCategory) {
    return <ArrowLeftIcon />;
  }
  return <CloseIcon />;
};

export const getExitOnClick = ({
  columnCategories,
  selectedCategory,
  setSelectedCategory,
  onClose,
}: {
  columnCategories: ColumnCategory[];
  selectedCategory: string;
  setSelectedCategory: (category: string | undefined) => void;
  onClose: () => void;
}) => {
  if (columnCategories.length === 1) {
    return onClose;
  }
  if (selectedCategory) {
    return () => setSelectedCategory(undefined);
  } else {
    return onClose;
  }
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
