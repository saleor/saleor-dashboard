import { CommandMenu } from "@dashboard/command-menu/command-menu-model";
import { Command } from "cmdk";
import React from "react";
import { DashboardModal } from "@dashboard/components/Modal";
import { ResourcesTable } from "@dashboard/components/NavigatorSearch/ResourcesTable";
import Link from "@dashboard/components/Link";
import { globalSearchUrl } from "@dashboard/search/urls";
import { Box, SearchIcon, sprinkles, Text } from "@saleor/macaw-ui-next";
import { FormattedMessage } from "react-intl";
import { getShortcutLeadingKey } from "@dashboard/components/Sidebar/shortcuts/utils";
import "./command-menu.css";

const GlobalSearchButton = ({ query }: { query: string }) => {
  return (
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
  );
};

const Input = ({ onQueryChange, value }: { onQueryChange: (string) => void; value: string }) => {
  const classNameInput = sprinkles({
    borderWidth: 0,
    width: "100%",
    backgroundColor: "transparent",
    padding: 0,
    height: "100%",
  });

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
      <Command.Input
        tabIndex={0}
        style={{
          outline: "none",
        }}
        placeholder="Search"
        role="input"
        id="navigator-search-input"
        autoComplete="off"
        autoFocus
        className={classNameInput}
        value={value}
        onValueChange={onQueryChange}
      />
    </Box>
  );
};

/**
 * todo should resources load eagerly
 */
export const CommandMenuUi = () => {
  const { query, updateQuery, open, setClose } = CommandMenu.useCommandBar();

  return (
    <DashboardModal open={open} onChange={setClose}>
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
        <Command>
          <Input value={query} onQueryChange={updateQuery} />

          <Command.Item onSelect={console.log} value="test">
            <button>test</button>
          </Command.Item>

          <Box overflowY="auto">
            <Command.Item onSelect={console.log} value="Products list">
              Go to products list
            </Command.Item>
            {query && (
              <Command.Item>
                <GlobalSearchButton query={query} />
              </Command.Item>
            )}
            <Command.Group value="actions" heading="Actions">
              <Command.Item onSelect={console.log} value="copy id">
                Copy ID
              </Command.Item>
            </Command.Group>
            <Command.Group value="resources">
              <ResourcesTable
                query={query}
                onResourceClick={setClose}
                onResourcesLoaded={() => {
                  // todo
                }}
              />
            </Command.Group>
          </Box>
        </Command>
      </DashboardModal.Content>
    </DashboardModal>
  );
};
