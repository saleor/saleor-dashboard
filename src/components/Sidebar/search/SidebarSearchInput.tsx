import { Box, Popover, SearchIcon } from "@saleor/macaw-ui-next";
import React, { useState } from "react";

interface SidebarSearchInputProps {
  onChangeQuery: (query: string) => void;
  children: React.ReactNode;
}

export const SidebarSearchInput = ({ onChangeQuery, children }: SidebarSearchInputProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsOpen(true);
    setQuery(event.target.value);

    if (event.target.value.length === 0) {
      setIsOpen(false);

      return;
    }

    onChangeQuery(event.target.value);
  };

  const clickOutside = () => {
    setIsOpen(false);
  };

  const handleContentClick = () => {
    setIsOpen(false);
    setQuery("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleInputClick = () => {
    if (query.length == 0 && !isOpen) return;

    setIsOpen(true);
  };

  return (
    <Box position="relative" onKeyDown={handleKeyDown}>
      <Popover open={isOpen}>
        <Popover.Trigger>
          <Box
            as="label"
            display="flex"
            alignItems="center"
            gap={2}
            paddingX={2}
            paddingY={1.5}
            borderRadius={3}
            borderWidth={1}
            borderStyle="solid"
            borderColor="default1"
            marginBottom={3}
            onClick={handleInputClick}
          >
            <SearchIcon />
            <Box
              as="input"
              type="text"
              placeholder="Search"
              borderWidth={0}
              width="100%"
              backgroundColor="transparent"
              outlineStyle="none"
              padding={0}
              value={query}
              onChange={handleChange}
            />
          </Box>
        </Popover.Trigger>
        <Popover.Content
          side="bottom"
          align="start"
          onInteractOutside={clickOutside}
          onOpenAutoFocus={e => {
            e.preventDefault();
          }}
        >
          <Box position="relative" onClick={handleContentClick}>
            <Popover.Arrow />
            <Box padding={3} __width="550px" __height="400px" overflowY="scroll">
              {children}
            </Box>
          </Box>
        </Popover.Content>
      </Popover>
    </Box>
  );
};
