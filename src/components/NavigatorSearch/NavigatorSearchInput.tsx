import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import useDebounce from "@dashboard/hooks/useDebounce";
import { Box, sprinkles } from "@saleor/macaw-ui-next";
import { Search } from "lucide-react";
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
      <Search
        size={iconSize.small}
        strokeWidth={iconStrokeWidth}
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
