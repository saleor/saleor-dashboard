import { paginatorContextValues } from "@saleor/fixtures";
import { PaginatorContext } from "@saleor/hooks/usePaginator";
import React from "react";

export const PaginatorContextDecorator = storyFn => (
  <PaginatorContext.Provider value={paginatorContextValues}>
    {storyFn()}
  </PaginatorContext.Provider>
);
