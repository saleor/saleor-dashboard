import { Box } from "@saleor/macaw-ui-next";
import { Search, X } from "lucide-react";
import { useRef } from "react";

interface ChannelSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export const ChannelSearchInput = ({ value, onChange, placeholder }: ChannelSearchInputProps) => {
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
        onChange={event => onChange(event.target.value)}
        onKeyDown={event => {
          if (event.key === "Escape") {
            onChange("");
            inputRef.current?.blur();
          }
        }}
        placeholder={placeholder}
        data-test-id="channel-search-input"
        style={{
          flex: 1,
          border: "none",
          outline: "none",
          backgroundColor: "transparent",
          fontSize: "14px",
          color: "var(--mu-colors-text-default1)",
          minWidth: 0,
        }}
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
          data-test-id="channel-search-clear"
        >
          <X size={16} color="var(--mu-colors-text-default2)" />
        </Box>
      )}
    </Box>
  );
};
