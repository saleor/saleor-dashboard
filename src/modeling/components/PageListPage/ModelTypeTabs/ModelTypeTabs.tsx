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
import { useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Link } from "react-router-dom";

import { modelTypeTabsMessages as messages } from "./messages";

const linkClass = sprinkles({ textDecoration: "none" });

export interface ModelType {
  id: string;
  name: string;
}

interface ModelTypeTabsProps {
  types: ModelType[];
  counts: Record<string, number | undefined>;
  totalCount: number | undefined;
  activeType: string | null;
  loading?: boolean;
  visibleSlots?: number;
  emptyTypesUrl?: string;
  onChange: (typeId: string | null) => void;
}

const DEFAULT_VISIBLE_SLOTS = 6;

export const ModelTypeTabs = ({
  types,
  counts,
  totalCount,
  activeType,
  loading,
  visibleSlots = DEFAULT_VISIBLE_SLOTS,
  emptyTypesUrl,
  onChange,
}: ModelTypeTabsProps) => {
  const intl = useIntl();
  const [moreOpen, setMoreOpen] = useState(false);

  // Sort types alphabetically by name. Predictable order that doesn't shuffle as
  // counts change, and matches how users typically scan a list of named entities.
  const sortedTypes = useMemo(
    () => [...types].sort((a, b) => a.name.localeCompare(b.name)),
    [types],
  );

  // Split into "visible" and "overflow" buckets, then promote the active type
  // into the visible row if it lives in overflow so the user always sees what's selected.
  // Both lists stay strictly alphabetical: when a swap happens, the overflow is re-sorted
  // so the displaced item lands in its proper alphabetical position rather than at the head.
  const { visibleTypes, overflowTypes } = useMemo(() => {
    if (sortedTypes.length <= visibleSlots) {
      return { visibleTypes: sortedTypes, overflowTypes: [] as ModelType[] };
    }

    const initialVisible = sortedTypes.slice(0, visibleSlots);
    const initialOverflow = sortedTypes.slice(visibleSlots);

    if (!activeType || initialVisible.some(t => t.id === activeType)) {
      return { visibleTypes: initialVisible, overflowTypes: initialOverflow };
    }

    const promoted = initialOverflow.find(t => t.id === activeType);

    if (!promoted) {
      return { visibleTypes: initialVisible, overflowTypes: initialOverflow };
    }

    // Swap: promote active into the last visible slot, demote the displaced type into overflow.
    const displaced = initialVisible[initialVisible.length - 1];
    const overflowAfterSwap = [displaced, ...initialOverflow.filter(t => t.id !== activeType)].sort(
      (a, b) => a.name.localeCompare(b.name),
    );

    return {
      visibleTypes: [...initialVisible.slice(0, -1), promoted],
      overflowTypes: overflowAfterSwap,
    };
  }, [sortedTypes, visibleSlots, activeType]);

  const isAllActive = activeType === null;
  const activeIndex = isAllActive ? 0 : visibleTypes.findIndex(t => t.id === activeType) + 1;
  // material-ui uses `false` to indicate "no tab selected" (e.g., dropdown is the active one,
  // but never happens here because we promote). Always pass a numeric index.
  const currentTab = activeIndex >= 0 ? activeIndex : 0;

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
          {visibleTypes.map(type => (
            <FilterTab
              key={type.id}
              label={type.name}
              count={counts[type.id]}
              onClick={() => onChange(type.id)}
              selected={activeType === type.id}
            />
          ))}
        </FilterTabs>
      </Box>
      {overflowTypes.length > 0 && (
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
          <Dropdown open={moreOpen} onOpenChange={setMoreOpen}>
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
                __minWidth={200}
                __maxWidth={280}
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
                {overflowTypes.map(type => (
                  <Dropdown.Item key={type.id}>
                    <List.Item
                      paddingX={1.5}
                      paddingY={2}
                      borderRadius={3}
                      onClick={() => {
                        setMoreOpen(false);
                        onChange(type.id);
                      }}
                      data-test-id={`model-type-tabs-more-${type.id}`}
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        gap={4}
                        width="100%"
                      >
                        <Text>{type.name}</Text>
                        {typeof counts[type.id] === "number" && (
                          <Text color="default2" size={2}>
                            {counts[type.id]}
                          </Text>
                        )}
                      </Box>
                    </List.Item>
                  </Dropdown.Item>
                ))}
              </List>
            </Dropdown.Content>
          </Dropdown>
        </Box>
      )}
    </Box>
  );
};

ModelTypeTabs.displayName = "ModelTypeTabs";
