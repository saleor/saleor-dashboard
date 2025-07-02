import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { Box, Switch, SwitchItemProps } from "@saleor/macaw-ui-next";
import React, { useEffect, useRef } from "react";

const SwitchItem = ({ children, ...props }: SwitchItemProps) => {
  return (
    <Switch.Item display="flex" alignItems="center" paddingX={2} {...props}>
      {children}
    </Switch.Item>
  );
};

export const SearchForm = ({
  onSearchChange,
  onScopeChange,
  scope,
  query,
}: {
  onSearchChange: (value: string) => void;
  onScopeChange: (value: string) => void;
  scope: string;
  query: string;
}) => {
  const inputSearchContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!inputSearchContainer.current) return;

    const searchInput = inputSearchContainer.current.getElementsByTagName("input")[0];

    searchInput.focus();
  }, [inputSearchContainer]);

  return (
    <Box display="grid" __gridTemplateColumns="auto 1fr" gap={4} paddingBottom={2} paddingX={6}>
      <Box display="flex" alignItems="center" gap={4}>
        <Box __width="320px" ref={inputSearchContainer}>
          <SearchInput
            initialSearch={query}
            placeholder={"Search"}
            onSearchChange={onSearchChange}
          />
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <Switch defaultValue={scope} onValueChange={onScopeChange}>
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
