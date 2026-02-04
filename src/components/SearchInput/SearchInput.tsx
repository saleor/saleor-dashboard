import { Box } from "@saleor/macaw-ui-next";
import { Search, X } from "lucide-react";
import { useRef } from "react";

import styles from "./SearchInput.module.css";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  "data-test-id"?: string;
}

export const SearchInput = ({
  value,
  onChange,
  placeholder,
  "data-test-id": dataTestId = "search-input",
}: SearchInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Box
      display="flex"
      alignItems="center"
      gap={2}
      paddingX={3}
      paddingY={2}
      borderWidth={1}
      borderStyle="solid"
      borderColor="default1"
      borderRadius={3}
      backgroundColor="default1"
    >
      <Box display="flex" alignItems="center" flexShrink="0">
        <Search size={16} color="var(--mu-colors-text-default2)" />
      </Box>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === "Escape") {
            onChange("");
            inputRef.current?.blur();
          }
        }}
        placeholder={placeholder}
        data-test-id={dataTestId}
        className={styles.input}
      />
      {value && (
        <Box
          as="button"
          type="button"
          display="flex"
          alignItems="center"
          justifyContent="center"
          padding={0}
          borderWidth={0}
          backgroundColor="transparent"
          cursor="pointer"
          onClick={() => {
            onChange("");
            inputRef.current?.focus();
          }}
          data-test-id={`${dataTestId}-clear`}
        >
          <X size={16} color="var(--mu-colors-text-default2)" />
        </Box>
      )}
    </Box>
  );
};
