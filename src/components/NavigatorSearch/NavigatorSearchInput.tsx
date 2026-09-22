import { iconSize, iconStrokeWidth } from "@dashboard/components/icons";
import { MODAL_PADDING_SPACING } from "@dashboard/components/Modal/tokens";
import useDebounce from "@dashboard/hooks/useDebounce";
import { Box, sprinkles } from "@saleor/macaw-ui-next";
import { Search } from "lucide-react";
import type * as React from "react";
import { useState } from "react";
import { defineMessages, useIntl } from "react-intl";

import { NAVIGATOR_SEARCH_INPUT_ID, NAVIGATOR_SEARCH_LISTBOX_ID } from "./consts";

const messages = defineMessages({
  searchPlaceholder: {
    id: "QTuSw/",
    defaultMessage: "Search",
    description: "navigator search input placeholder",
  },
});

interface NavigatorSearchInputProps {
  onSearch: (query: string) => void;
  value: string;
  /** Whether the results listbox is displayed; mirrored to `aria-expanded`. */
  isExpanded: boolean;
}

const NavigatorSearchInput = ({ onSearch, value, isExpanded }: NavigatorSearchInputProps) => {
  const intl = useIntl();
  const [inputValue, setInputValue] = useState(value);
  const onSearchDebounced = useDebounce(onSearch);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    onSearchDebounced(e.target.value);
  };

  const label = intl.formatMessage(messages.searchPlaceholder);

  return (
    <Box
      display="flex"
      flexShrink="0"
      paddingX={MODAL_PADDING_SPACING}
      paddingY={4}
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
        id={NAVIGATOR_SEARCH_INPUT_ID}
        as="input"
        type="text"
        // `combobox` is the only role that legally carries the popup attributes
        // below; `aria-activedescendant` is managed by useCommandMenuInput.
        role="combobox"
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
        placeholder={label}
        aria-label={label}
        aria-autocomplete="list"
        aria-controls={NAVIGATOR_SEARCH_LISTBOX_ID}
        aria-expanded={isExpanded}
      />
    </Box>
  );
};

export default NavigatorSearchInput;
