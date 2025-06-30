import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { Box, Switch, SwitchItemProps } from "@saleor/macaw-ui-next";
import React from "react";

import { useSearchCriteria } from "./useSearchCriteria";

const SwitchItem = ({ children, ...props }: SwitchItemProps) => {
  return (
    <Switch.Item display="flex" alignItems="center" paddingX={2} {...props}>
      {children}
    </Switch.Item>
  );
};

export const SearchForm = () => {
  const { query, scope, changeScope, changeQuery } = useSearchCriteria();

  const handleSearchChange = (value: string) => {
    changeQuery(value);
  };

  const handleScopeChange = (value: string) => {
    changeScope(value);
  };

  return (
    <Box display="grid" __gridTemplateColumns="auto 1fr" gap={4} paddingBottom={2} paddingX={6}>
      <Box display="flex" alignItems="center" gap={4}>
        <Box __width="320px">
          <SearchInput
            initialSearch={query}
            placeholder={"Search"}
            onSearchChange={handleSearchChange}
          />
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Switch defaultValue={scope} onValueChange={handleScopeChange}>
          <SwitchItem id="all" value="all">
            All
          </SwitchItem>
          <SwitchItem id="products" value="products">
            Products
          </SwitchItem>
          <SwitchItem id="orders" value="orders">
            Orders
          </SwitchItem>
          <SwitchItem id="categories" value="categories">
            Categories
          </SwitchItem>
          <SwitchItem id="collections" value="collections">
            Collections
          </SwitchItem>
          <SwitchItem id="models" value="models">
            Models
          </SwitchItem>
          <SwitchItem id="model-types" value="model-types">
            Models Types
          </SwitchItem>
        </Switch>
      </Box>
    </Box>
  );
};
