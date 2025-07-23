import Link from "@dashboard/components/Link";
import { Box, Text } from "@saleor/macaw-ui-next";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";

import { DashboardModal } from "../Modal";
import { Actions } from "./Actions";
import NavigatorSearchInput from "./NavigatorSearchInput";
import { ResourcesTable } from "./ResourcesTable";
import { useKeyboardNavigation } from "./useKeyboardNavigation";

const NavigatorSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const {
    handleKeyDown,
    isCommandMenuOpen,
    closeCommandMenu,
    collectLinks,
    collectTableRows,
    resetFocus,
  } = useKeyboardNavigation();

  const handleClick = () => {
    closeCommandMenu();
  };

  const handleSearch = (value: string) => {
    resetFocus();
    setQuery(value);
  };

  const handleActionsLoaded = () => {
    collectLinks();
  };

  const handleResourcesLoaded = () => {
    collectTableRows();
  };

  return (
    <DashboardModal open={isCommandMenuOpen} onChange={closeCommandMenu}>
      <DashboardModal.Content
        __width="100%"
        __maxWidth="720px"
        __height="420px"
        __maxHeight="420px"
        backgroundColor="default1"
        padding={0}
        paddingBottom={4}
        size="sm"
        className="command-menu"
        overflowY="hidden"
      >
        <Box width="100%" position="relative" onKeyDown={handleKeyDown}>
          <NavigatorSearchInput onSearch={handleSearch} value={query} />
          <Box
            __height="370px"
            style={{
              scrollbarWidth: "thin",
            }}
            width="100%"
            overflowY="scroll"
            paddingTop={2}
            paddingBottom={2}
          >
            <Actions
              query={query}
              onActionClick={handleClick}
              onActionsLoaded={handleActionsLoaded}
            />
            <Box marginTop={3}>
              <Text fontWeight="medium" size={2} color="default2" paddingX={6} display="block">
                <FormattedMessage id="49vo8t" defaultMessage="Quick search" />
              </Text>
              <Link href="/" data-href="/" className="command-menu-item" data-focus={false}>
                <Box
                  display="flex"
                  alignItems="center"
                  color="default1"
                  gap={2}
                  backgroundColor={{
                    hover: "default1Hovered",
                  }}
                  paddingY={1.5}
                  paddingX={6}
                  marginBottom={2}
                >
                  <Text size={2} fontWeight="medium" color="default1">
                    <FormattedMessage id="pdJlXC" defaultMessage="See all global search results" />
                  </Text>
                </Box>
              </Link>
              <ResourcesTable
                query={query}
                onResourceClick={handleClick}
                onResourcesLoaded={handleResourcesLoaded}
              />
            </Box>
          </Box>
        </Box>
      </DashboardModal.Content>
    </DashboardModal>
  );
};

export default NavigatorSearch;
