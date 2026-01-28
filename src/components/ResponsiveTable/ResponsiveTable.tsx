import { Table } from "@material-ui/core";
import { Box, SearchInput, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FormattedMessage } from "react-intl";

import { iconSize, iconStrokeWidthBySize } from "../icons";
import styles from "./ResponsiveTable.module.css";

interface ResponsiveTableProps {
  children: React.ReactNode | React.ReactNodeArray;
  className?: string;
  onMouseLeave?: () => void;
  key?: string;
  search?: {
    placeholder?: string;
    initialValue?: string;
    onSearchChange?: (query: string) => void;
    toolbar?: React.ReactNode;
  };
  footer?: React.ReactNode;
  /** When 0 and search is active, shows "no results" state */
  filteredItemsCount?: number;
}

export const ResponsiveTable = (props: ResponsiveTableProps) => {
  const { children, className, onMouseLeave, search, footer, filteredItemsCount } = props;
  const [searchValue, setSearchValue] = useState(search?.initialValue ?? "");

  const isSearchActive = searchValue.length > 0;
  const showFilteredEmptyState = isSearchActive && filteredItemsCount === 0;
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchValue(value);

    if (search?.onSearchChange) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        search.onSearchChange?.(value);
      }, 300);
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    search?.onSearchChange?.("");

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      clearSearch();
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {search && (
          <Box
            className={styles.searchBar}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gap={4}
            paddingX={4}
            paddingY={3}
          >
            <Box __width="320px" position="relative">
              <SearchInput
                value={searchValue}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                placeholder={search.placeholder}
                size="small"
              />
              {searchValue.length > 0 && (
                <Box
                  as="button"
                  position="absolute"
                  __right="8px"
                  __top="50%"
                  __transform="translateY(-50%)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  padding={1}
                  borderRadius={2}
                  cursor="pointer"
                  onClick={clearSearch}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    color: "var(--mu-colors-foreground-default1)",
                  }}
                  title="Clear search (Esc)"
                >
                  <X size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />
                </Box>
              )}
            </Box>
            {search.toolbar && <Box>{search.toolbar}</Box>}
          </Box>
        )}
        {showFilteredEmptyState ? (
          <Box paddingY={6} paddingX={4}>
            <Text color="default2">
              <FormattedMessage
                id="0xMUfd"
                defaultMessage='No results found for "{query}"'
                values={{ query: searchValue }}
              />
            </Text>
          </Box>
        ) : (
          <Table className={clsx(styles.table, className)} onMouseLeave={onMouseLeave}>
            {children}
          </Table>
        )}
      </div>
      {footer && <Box padding={4}>{footer}</Box>}
    </div>
  );
};

ResponsiveTable.displayName = "ResponsiveTable";

export const tableStyles = {
  colAction: styles.colAction,
};
