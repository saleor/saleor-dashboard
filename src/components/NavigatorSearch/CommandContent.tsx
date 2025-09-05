import Link from "@dashboard/components/Link";
import { globalSearchUrl } from "@dashboard/search/urls";
import { Box, Text } from "@saleor/macaw-ui-next";
import { useState } from "react";
import { FormattedMessage } from "react-intl";

import { getShortcutLeadingKey } from "../Sidebar/shortcuts/utils";
import { Actions } from "./Actions";
import NavigatorSearchInput from "./NavigatorSearchInput";
import { ResourcesTable } from "./ResourcesTable";
import { useKeyboardNavigation } from "./useKeyboardNavigation";
import { useNavigatorSearchContext } from "./useNavigatorSearchContext";

export const CommandContent = () => {
  const { setNavigatorVisibility } = useNavigatorSearchContext();

  const [query, setQuery] = useState("");
  const { scope, collectLinks, collectTableRows, resetFocus } = useKeyboardNavigation({ query });

  const handleClick = () => {
    setNavigatorVisibility(false);
    resetFocus();
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
    <Box width="100%" position="relative" ref={scope}>
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
        <Actions query={query} onActionClick={handleClick} onActionsLoaded={handleActionsLoaded} />
        <Box marginTop={3}>
          <Text fontWeight="medium" size={2} color="default2" paddingX={6} display="block">
            <FormattedMessage id="49vo8t" defaultMessage="Quick search" />
          </Text>
          <Link
            href={globalSearchUrl({ query, trigger: true })}
            data-href={globalSearchUrl({ query, trigger: true })}
            className="command-menu-item"
            data-focus={false}
          >
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
              <Box
                borderColor="default1"
                borderStyle="solid"
                borderWidth={1}
                paddingX={0.5}
                borderRadius={2}
                fontSize={1}
                boxShadow="defaultFocused"
              >
                {getShortcutLeadingKey()} + ↩︎
              </Box>
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
  );
};
