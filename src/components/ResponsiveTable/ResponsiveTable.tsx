import useDebounce from "@dashboard/hooks/useDebounce";
import { Table } from "@material-ui/core";
import { Box, SearchInput, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { X } from "lucide-react";
import { type ChangeEvent, type KeyboardEvent, type ReactNode, useState } from "react";
import { FormattedMessage } from "react-intl";

import { iconSize, iconStrokeWidthBySize } from "../icons";
import styles from "./ResponsiveTable.module.css";

interface ResponsiveTableProps {
  children: ReactNode | ReactNode[];
  bleed?: boolean;
  className?: string;
  fillHeight?: boolean;
  onMouseLeave?: () => void;
  key?: string;
  search?: {
    placeholder?: string;
    initialValue?: string;
    onSearchChange?: (query: string) => void;
    toolbar?: ReactNode;
  };
  footer?: ReactNode;
  /** When 0 and search is active, shows "no results" state */
  filteredItemsCount?: number;
}

export const ResponsiveTable = (props: ResponsiveTableProps) => {
  const {
    bleed = false,
    children,
    className,
    fillHeight = false,
    onMouseLeave,
    search,
    footer,
    filteredItemsCount,
  } = props;
  const [searchValue, setSearchValue] = useState(search?.initialValue ?? "");

  const isSearchActive = searchValue.length > 0;
  const showFilteredEmptyState = isSearchActive && filteredItemsCount === 0;

  const debouncedOnSearchChange = useDebounce((value: string) => {
    search?.onSearchChange?.(value);
  }, 300);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchValue(value);

    if (search?.onSearchChange) {
      debouncedOnSearchChange(value);
    }
  };

  const clearSearch = () => {
    setSearchValue("");
    search?.onSearchChange?.("");
  };

  const handleSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      clearSearch();
    }
  };

  return (
    <div className={clsx(styles.container, fillHeight && styles.containerFill)}>
      <div
        className={clsx(
          styles.wrapper,
          fillHeight && styles.wrapperFill,
          bleed && styles.wrapperBleed,
        )}
      >
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
          <Table
            className={clsx(styles.table, bleed && styles.tableBleed, className)}
            onMouseLeave={onMouseLeave}
          >
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
  cellFlush: styles.cellFlush,
};
