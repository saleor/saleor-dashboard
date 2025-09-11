import useDebounce from "@dashboard/hooks/useDebounce";
import { Box, SearchIcon, sprinkles } from "@saleor/macaw-ui-next";
import { useState } from "react";
import * as React from "react";

interface NavigatorSearchInputProps {
  onSearch: (query: string) => void;
  value: string;
}

const NavigatorSearchInput = ({ onSearch, value }: NavigatorSearchInputProps) => {
  const [inputValue, setInputValue] = useState(value);
  const onSearchDebounced = useDebounce(onSearch);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onSearchDebounced(e.target.value);
  };

  return (
    <Box
      display="flex"
      padding={4}
      __height="50px"
      borderBottomWidth={1}
      borderBottomStyle="solid"
      borderColor="default1"
    >
      <SearchIcon
        size="small"
        className={sprinkles({
          alignSelf: "center",
          marginRight: 2,
        })}
      />
      <Box
        id="navigator-search-input"
        as="input"
        role="input"
        autoFocus
        onChange={handleSearch}
        value={inputValue}
        autoComplete="off"
        style={{
          border: "none",
          outline: "none",
          width: "100%",
          backgroundColor: "transparent",
          padding: 0,
        }}
        placeholder="Search"
        aria-activedescendant="/orders/"
        aria-expanded
      />
    </Box>
  );
};

export default NavigatorSearchInput;
