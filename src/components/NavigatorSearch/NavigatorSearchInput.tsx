import useDebounce from "@dashboard/hooks/useDebounce";
import { Box, SearchIcon, sprinkles } from "@saleor/macaw-ui-next";
import React from "react";

interface NavigatorSearchInputProps {
  onSearch: (query: string) => void;
  value: string;
}

const NavigatorSearchInput = ({ onSearch, value }: NavigatorSearchInputProps) => {
  const onSearchDebounced = useDebounce(onSearch);

  return (
    <Box display="flex" padding={4} height={12}>
      <SearchIcon
        size="small"
        className={sprinkles({
          alignSelf: "center",
          marginRight: 2,
        })}
      />
      <Box
        as="input"
        role="input"
        autoFocus
        onChange={e => onSearchDebounced((e.target as HTMLInputElement).value)}
        value={value}
        autoComplete="off"
        style={{
          border: "none",
          outline: "none",
          width: "100%",
          backgroundColor: "transparent",
          padding: 0,
        }}
        placeholder="Search"
      />
    </Box>
  );
};

export default NavigatorSearchInput;
