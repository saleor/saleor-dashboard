import { Decorator } from "@storybook/react";
import React from "react";
import { paginatorContextValues } from "../../src/fixtures";
import { PaginatorContext } from "../../src/hooks/usePaginator";

export const PaginatorContextDecorator: Decorator = Story => (
  <PaginatorContext.Provider value={paginatorContextValues}>
    <Story />
  </PaginatorContext.Provider>
);
