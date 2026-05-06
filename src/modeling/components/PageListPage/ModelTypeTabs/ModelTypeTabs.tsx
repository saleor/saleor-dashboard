import FilterTabs, { FilterTab } from "@dashboard/components/TableFilter";
import {
  Box,
  Dropdown,
  DropdownButton,
  List,
  Skeleton,
  sprinkles,
  Text,
  vars,
} from "@saleor/macaw-ui-next";
import { Pin } from "lucide-react";
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { computeVisibleTypes, type ModelType } from "./computeVisibleTypes";
import { modelTypeTabsMessages as messages } from "./messages";
import styles from "./ModelTypeTabs.module.css";

const linkClass = sprinkles({ textDecoration: "none" });

interface ModelTypeTabsProps {
  types: ModelType[];
  counts: Record<string, number | undefined>;
  totalCount: number | undefined;
  activeType: string | null;
  pinnedTypeIds: string[];
  onTogglePin: (typeId: string) => void;
  loading?: boolean;
  visibleSlots?: number;
  emptyTypesUrl?: string;
  onChange: (typeId: string | null) => void;
  /**
   * Fired when the "More" overflow dropdown is opened. Caller can use this to
   * lazy-fetch counts for the overflow types (the visible row's counts are
   * already requested up front).
   */
  onOverflowOpen?: () => void;
}

const DEFAULT_VISIBLE_SLOTS = 6;

export { type ModelType };

export const ModelTypeTabs = ({
  types,
  counts,
  totalCount,
  activeType,
  pinnedTypeIds,
  onTogglePin,
  loading,
  visibleSlots = DEFAULT_VISIBLE_SLOTS,
  emptyTypesUrl,
  onChange,
  onOverflowOpen,
}: ModelTypeTabsProps) => {
  const intl = useIntl();
  const [moreOpen, setMoreOpen] = useState(false);

  const { pinnedVisibleTypes, overflowTypes, allVisibleTypes } = useMemo(
    () =>
      computeVisibleTypes({
        types,
        pinnedTypeIds,
        activeTypeId: activeType,
        visibleSlots,
      }),
    [types, pinnedTypeIds, activeType, visibleSlots],
  );
  // Set, not array.includes, so the per-tab lookup below stays O(1) even if a
  // user pins many types.
  const pinnedVisibleIds = useMemo(
    () => new Set(pinnedVisibleTypes.map(t => t.id)),
    [pinnedVisibleTypes],
  );

  const isAllActive = activeType === null;
  // Tabs render in order: All (index 0), pinned, alphabetical.
  const visibleIndex = isAllActive ? 0 : allVisibleTypes.findIndex(t => t.id === activeType) + 1;
  const currentTab = visibleIndex >= 0 ? visibleIndex : 0;

  const handleMoreOpenChange = (next: boolean) => {
    setMoreOpen(next);

    if (next) {
      onOverflowOpen?.();
    }
  };

  if (loading && types.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        gap={4}
        paddingX={4}
        paddingY={3}
        borderBottomWidth={1}
        borderBottomStyle="solid"
        borderColor="default1"
        data-test-id="model-type-tabs-loading"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} __width="80px" __height="20px" />
        ))}
      </Box>
    );
  }

  if (!loading && types.length === 0) {
    return (
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        paddingX={4}
        paddingY={3}
        borderBottomWidth={1}
        borderBottomStyle="solid"
        borderColor="default1"
        data-test-id="model-type-tabs-empty"
      >
        <Text size={3} color="default2">
          <FormattedMessage {...messages.emptyTypesCallout} />
        </Text>
        {emptyTypesUrl && (
          <Link to={emptyTypesUrl} className={linkClass}>
            <Text size={3} color="accent1">
              <FormattedMessage {...messages.createFirstType} />
            </Text>
          </Link>
        )}
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      data-test-id="model-type-tabs"
    >
      <Box __flex={1} __minWidth={0}>
        <FilterTabs currentTab={currentTab}>
          <FilterTab
            label={intl.formatMessage(messages.allTab)}
            count={totalCount}
            onClick={() => onChange(null)}
            selected={isAllActive}
          />
          {allVisibleTypes.map(type => (
            <FilterTab
              key={type.id}
              label={type.name}
              count={counts[type.id]}
              // Subtle marker on the tab itself (Chrome-style pinned tab affordance):
              // tells users at a glance which tabs are user-promoted vs alphabetical.
              leadingIcon={pinnedVisibleIds.has(type.id) ? <Pin size={11} /> : undefined}
              onClick={() => onChange(type.id)}
              selected={activeType === type.id}
            />
          ))}
        </FilterTabs>
      </Box>
      {/* The "More" trigger renders even when the overflow row is empty IF
          there's at least one type that could be pinned/unpinned from it.
          Today that's "any time we have types" — keeps the pin management
          surface consistently reachable. */}
      {types.length > 0 && (overflowTypes.length > 0 || pinnedVisibleTypes.length > 0) && (
        <Box
          display="flex"
          alignItems="center"
          // Match the page's `paddingX={6}` content gutter so the "More" trigger
          // aligns with the "Create model" button in the TopNav above.
          paddingRight={6}
          borderBottomWidth={1}
          borderBottomStyle="solid"
          borderColor="default1"
          __alignSelf="stretch"
        >
          <Dropdown open={moreOpen} onOpenChange={handleMoreOpenChange}>
            <Dropdown.Trigger>
              <DropdownButton
                variant="text"
                size="medium"
                data-test-id="model-type-tabs-more"
                style={{
                  borderColor: moreOpen ? vars.colors.border.accent1 : undefined,
                }}
              >
                <FormattedMessage {...messages.moreTab} />
              </DropdownButton>
            </Dropdown.Trigger>
            <Dropdown.Content align="end">
              <List
                __minWidth={240}
                __maxWidth={320}
                __maxHeight={400}
                overflowY="auto"
                padding={1}
                borderRadius={3}
                boxShadow="defaultOverlay"
                borderColor="default1"
                borderStyle="solid"
                borderWidth={1}
                marginTop={0.5}
                backgroundColor="default1"
              >
                {pinnedVisibleTypes.length > 0 && (
                  <>
                    <SectionHeader
                      label={intl.formatMessage(messages.pinnedSection)}
                      data-test-id="model-type-tabs-more-section-pinned"
                    />
                    {pinnedVisibleTypes.map(type => (
                      <OverflowItem
                        key={type.id}
                        type={type}
                        count={counts[type.id]}
                        isPinned
                        onSelect={() => {
                          setMoreOpen(false);
                          onChange(type.id);
                        }}
                        onTogglePin={() => onTogglePin(type.id)}
                        intl={intl}
                      />
                    ))}
                  </>
                )}
                {overflowTypes.length > 0 && (
                  <>
                    {pinnedVisibleTypes.length > 0 && (
                      <SectionHeader label={intl.formatMessage(messages.allTypesSection)} />
                    )}
                    {overflowTypes.map(type => (
                      <OverflowItem
                        key={type.id}
                        type={type}
                        count={counts[type.id]}
                        isPinned={false}
                        onSelect={() => {
                          setMoreOpen(false);
                          onChange(type.id);
                        }}
                        onTogglePin={() => onTogglePin(type.id)}
                        intl={intl}
                      />
                    ))}
                  </>
                )}
              </List>
            </Dropdown.Content>
          </Dropdown>
        </Box>
      )}
    </Box>
  );
};

ModelTypeTabs.displayName = "ModelTypeTabs";

interface SectionHeaderProps {
  label: string;
  "data-test-id"?: string;
}

const SectionHeader = ({ label, "data-test-id": dataTestId }: SectionHeaderProps) => (
  <Box paddingX={1.5} paddingTop={2} paddingBottom={1} data-test-id={dataTestId}>
    <Text
      size={1}
      color="default2"
      textTransform="uppercase"
      __letterSpacing="0.04em"
      fontWeight="medium"
    >
      {label}
    </Text>
  </Box>
);

interface OverflowItemProps {
  type: ModelType;
  count: number | undefined;
  isPinned: boolean;
  onSelect: () => void;
  onTogglePin: () => void;
  intl: ReturnType<typeof useIntl>;
}

const OverflowItem = ({
  type,
  count,
  isPinned,
  onSelect,
  onTogglePin,
  intl,
}: OverflowItemProps) => {
  const pinLabel = intl.formatMessage(
    isPinned ? messages.unpinTypeAction : messages.pinTypeAction,
    {
      name: type.name,
    },
  );

  return (
    <Dropdown.Item>
      <List.Item
        paddingX={1.5}
        paddingY={2}
        borderRadius={3}
        onClick={onSelect}
        data-test-id={`model-type-tabs-more-${type.id}`}
        className={styles.overflowItem}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" gap={4} width="100%">
          <Text>{type.name}</Text>
          <Box display="flex" alignItems="center" gap={2}>
            {typeof count === "number" && (
              <Text color="default2" size={2}>
                {count}
              </Text>
            )}
            {/* Native button: keeps keyboard focus + Enter/Space handling for free
                and lets us stop propagation cleanly so clicking the pin doesn't
                also fire the row's onSelect. */}
            <button
              type="button"
              onClick={event => {
                event.stopPropagation();
                onTogglePin();
              }}
              aria-label={pinLabel}
              title={pinLabel}
              data-test-id={`model-type-tabs-more-pin-${type.id}`}
              className={isPinned ? styles.pinButtonActive : styles.pinButton}
            >
              <Pin size={14} />
            </button>
          </Box>
        </Box>
      </List.Item>
    </Dropdown.Item>
  );
};
