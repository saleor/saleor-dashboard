import SearchInput from "@dashboard/components/AppLayout/ListFilters/components/SearchInput";
import { Box, Switch, SwitchItemProps } from "@saleor/macaw-ui-next";
import React, { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";

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
            <FormattedMessage id="zQvVDJ" defaultMessage="All" />
          </SwitchItem>
          <SwitchItem id="products" value="products">
            <FormattedMessage id="7NFfmz" defaultMessage="Products" />
          </SwitchItem>
          <SwitchItem id="variants" value="variants">
            <FormattedMessage id="h5P++h" defaultMessage="Variants" />
          </SwitchItem>
          <SwitchItem id="orders" value="orders">
            <FormattedMessage id="X7jl6w" defaultMessage="Orders" />
          </SwitchItem>
          <SwitchItem id="categories" value="categories">
            <FormattedMessage id="VKb1MS" defaultMessage="Categories" />
          </SwitchItem>
          <SwitchItem id="collections" value="collections">
            <FormattedMessage id="ulh3kf" defaultMessage="Collections" />
          </SwitchItem>
          <SwitchItem id="models" value="models">
            <FormattedMessage id="blWvag" defaultMessage="Models" />
          </SwitchItem>
          <SwitchItem id="model-types" value="model-types">
            <FormattedMessage id="GgvbdW" defaultMessage="Model types" />
          </SwitchItem>
        </Switch>
      </Box>
    </Box>
  );
};
