import { SearchInput } from "@dashboard/components/SearchInput/SearchInput";
import { SettingsOwnershipChip } from "@dashboard/components/Settings/SettingsOwnershipChip";
import { type ResolvedSettingsCatalogEntry } from "@dashboard/configuration/settingsCatalog/catalog";
import { Box, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { type KeyboardEvent, useEffect, useRef } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import styles from "./ConfigurationSettingsSearch.module.css";

export const CONFIGURATION_SETTINGS_LISTBOX_ID = "configuration-settings-search-listbox";

const KindBadge = ({ kind }: { kind: ResolvedSettingsCatalogEntry["kind"] }): JSX.Element => {
  switch (kind) {
    case "hub":
      return (
        <FormattedMessage
          id="3eV79b"
          defaultMessage="Hub"
          description="settings search result kind badge"
        />
      );
    case "section":
      return (
        <FormattedMessage
          id="trx0Os"
          defaultMessage="Section"
          description="settings search result kind badge"
        />
      );
    case "setting":
    default:
      return (
        <FormattedMessage
          id="s5Huhi"
          defaultMessage="Setting"
          description="settings search result kind badge"
        />
      );
  }
};

export const getConfigurationSettingsOptionId = (entryId: string): string =>
  `configuration-settings-result-${entryId}`;

interface ConfigurationSettingsSearchToolbarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  activeOptionId?: string;
}

/**
 * Sticky search chrome under TopNav — page tool, not a content widget.
 */
export const ConfigurationSettingsSearchToolbar = ({
  query,
  onQueryChange,
  onKeyDown,
  activeOptionId,
}: ConfigurationSettingsSearchToolbarProps): JSX.Element => {
  const intl = useIntl();
  const hasQuery = query.trim().length > 0;

  return (
    <Box
      className={styles.toolbar}
      data-test-id="configuration-settings-search"
      position="sticky"
      top={0}
      zIndex="1"
      backgroundColor="default1"
      borderBottomWidth={1}
      borderBottomStyle="solid"
      borderColor="default1"
    >
      <Box className={styles.toolbarInner} paddingX={6} paddingY={4}>
        <SearchInput
          value={query}
          onChange={onQueryChange}
          onKeyDown={onKeyDown}
          aria-controls={hasQuery ? CONFIGURATION_SETTINGS_LISTBOX_ID : undefined}
          aria-activedescendant={activeOptionId}
          placeholder={intl.formatMessage({
            id: "38izkC",
            defaultMessage: "Search settings…",
            description: "placeholder for configuration settings search",
          })}
          data-test-id="configuration-settings-search-input"
        />
      </Box>
    </Box>
  );
};

interface ConfigurationSettingsSearchResultsProps {
  results: ResolvedSettingsCatalogEntry[];
  query: string;
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
}

/**
 * Full-bleed list mode when Configuration is searching — replaces the card grid.
 */
export const ConfigurationSettingsSearchResults = ({
  results,
  query,
  activeIndex,
  onActiveIndexChange,
}: ConfigurationSettingsSearchResultsProps): JSX.Element => {
  const listRef = useRef<HTMLUListElement | null>(null);

  useEffect(
    function scrollActiveResultIntoView() {
      if (activeIndex < 0 || !listRef.current) {
        return;
      }

      const active = listRef.current.querySelector<HTMLElement>(
        `[data-result-index="${activeIndex}"]`,
      );

      active?.scrollIntoView({ block: "nearest" });
    },
    [activeIndex],
  );

  return (
    <Box
      className={styles.resultsPanel}
      marginTop={5}
      marginBottom={5}
      backgroundColor="default1"
      borderWidth={1}
      borderStyle="solid"
      borderColor="default1"
      borderRadius={3}
      overflow="hidden"
    >
      <Box
        className={styles.results}
        data-test-id="configuration-settings-search-results"
        as="ul"
        ref={listRef}
        id={CONFIGURATION_SETTINGS_LISTBOX_ID}
        role="listbox"
        margin={0}
        padding={0}
        listStyleType="none"
      >
        {results.length === 0 ? (
          <Box as="li" paddingY={6} paddingX={5}>
            <Text size={2} color="default2">
              <FormattedMessage
                id="nVIFGq"
                defaultMessage="No settings match “{query}”."
                description="empty state when settings search has no results"
                values={{ query: query.trim() }}
              />
            </Text>
          </Box>
        ) : (
          results.map((entry, index) => {
            const isActive = index === activeIndex;
            const optionId = getConfigurationSettingsOptionId(entry.id);

            return (
              <Box
                as="li"
                key={entry.id}
                className={styles.resultItem}
                role="option"
                id={optionId}
                aria-selected={isActive}
                data-result-index={index}
              >
                <Link
                  to={entry.href}
                  className={clsx(styles.resultLink, isActive && styles.resultLinkActive)}
                  data-test-id={`configuration-settings-search-result-${entry.id}`}
                  onMouseEnter={() => onActiveIndexChange(index)}
                >
                  <Box className={styles.resultRow} display="flex" flexDirection="column" gap={1}>
                    <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                      <Text size={1} color="default2">
                        <KindBadge kind={entry.kind} />
                      </Text>
                      {entry.ownership ? (
                        <SettingsOwnershipChip ownership={entry.ownership} />
                      ) : null}
                    </Box>
                    {entry.breadcrumbPath ? (
                      <Text size={1} color="default2">
                        {entry.breadcrumbPath}
                      </Text>
                    ) : null}
                    <Text size={3} fontWeight="medium" color="default1">
                      {entry.title}
                    </Text>
                    {entry.description ? (
                      <Text size={2} color="default2" className={styles.resultDescription}>
                        {entry.description}
                      </Text>
                    ) : null}
                  </Box>
                </Link>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
};
