import { paginatorContextValues } from "@dashboard/fixtures";
import { PaginatorContext } from "@dashboard/hooks/usePaginator";
import React from "react";

export const PaginatorContextDecorator = storyFn => (
  <PaginatorContext.Provider value={paginatorContextValues}>{storyFn()}</PaginatorContext.Provider>
);
