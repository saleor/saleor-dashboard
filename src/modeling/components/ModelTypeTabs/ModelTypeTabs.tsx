import { ButtonWithDropdown } from "@dashboard/components/ButtonWithDropdown";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { Box, Checkbox, Dropdown, Input, List, Popover, Text } from "@saleor/macaw-ui-next";
import { Check, ChevronDown, Layers, Pin, PinOff, Settings2 } from "lucide-react";
import {
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useIntl } from "react-intl";

import { CountPill, type ModelTypeTabCount } from "./CountPill";
import {
  aggregateCounts,
  ALL_MODELS_TAB_ID,
  getActiveSubtypeInGroup,
  getModelTabNodeId,
  getModelTabNodeSelection,
  groupModelTypeTabs,
  isGroupAllSelected,
  isModelTabNodeActive,
  type ModelTabNode,
} from "./groupModelTypeTabs";
import { modelTypeTabsMessages } from "./messages";
import styles from "./ModelTypeTabs.module.css";
import { type ModelTypeTabGrouping, useModelTypeTabGrouping } from "./useModelTypeTabGrouping";

export type { ModelTypeTabCount } from "./CountPill";
export { ALL_MODELS_TAB_ID } from "./groupModelTypeTabs";

const PINNED_TABS_STORAGE_KEY = "modelTypeTabs.pinnedIds";

export interface ModelTypeTabItem {
  id: string;
  name: string;
}

export interface ModelTypeTabsProps {
  pageTypes: ModelTypeTabItem[] | undefined;
  selectedIds: string[];
  counts: Record<string, ModelTypeTabCount | undefined>;
  onTabChange: (ids: string[]) => void;
  /**
   * Grouping state owned by the parent so a single source of truth drives both the
   * tab strip and the parent's count bookkeeping. Falls back to a local hook instance
   * when rendered standalone (Storybook, tests).
   */
  grouping?: ModelTypeTabGrouping;
  /** Optional slot anchored to the right of the strip, sharing the bottom border. */
  rightSlot?: ReactNode;
}

type ModelTypeTabStripItem = { kind: "all"; id: string; name: string } | ModelTabNode;

const getStripItemId = (item: ModelTypeTabStripItem): string => {
  if (item.kind === "all") {
    return item.id;
  }

  return getModelTabNodeId(item);
};

const getStripItemSelection = (item: ModelTypeTabStripItem): string[] => {
  if (item.kind === "all") {
    return [];
  }

  return getModelTabNodeSelection(item);
};

const isStripItemActive = (item: ModelTypeTabStripItem, selectedIds: string[]): boolean => {
  if (item.kind === "all") {
    return selectedIds.length === 0;
  }

  return isModelTabNodeActive(item, selectedIds);
};

const getStripItemLabel = (item: ModelTypeTabStripItem, selectedIds: string[]): string => {
  if (item.kind === "all" || item.kind === "type") {
    return item.name;
  }

  const activeSubtype = getActiveSubtypeInGroup(item, selectedIds);

  if (activeSubtype) {
    return `${item.prefix} · ${activeSubtype.suffix}`;
  }

  return item.prefix;
};

const getStripItemCount = (
  item: ModelTypeTabStripItem,
  counts: Record<string, ModelTypeTabCount | undefined>,
): ModelTypeTabCount | undefined => {
  if (item.kind === "all") {
    return counts[item.id];
  }

  if (item.kind === "type") {
    return counts[item.id];
  }

  if (item.kind === "group") {
    return (
      counts[item.id] ??
      aggregateCounts(
        item.subtypes.map(subtype => subtype.id),
        counts,
      )
    );
  }

  return undefined;
};

// Reserved horizontal budget for the More button + its surrounding slot padding.
const MORE_BUTTON_RESERVED_WIDTH = 140;

interface ModelTypeTabsSettingsProps {
  separator: string;
  groupingEnabled: boolean;
  onSeparatorChange: (value: string) => void;
  onGroupingEnabledChange: (value: boolean) => void;
}

const ModelTypeTabsSettings = ({
  separator,
  groupingEnabled,
  onSeparatorChange,
  onGroupingEnabledChange,
}: ModelTypeTabsSettingsProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Popover.Trigger>
        <button
          type="button"
          className={styles.settingsButton}
          aria-label={intl.formatMessage(modelTypeTabsMessages.settingsTitle)}
          data-test-id="model-type-tabs-settings"
        >
          <Settings2 size={16} />
        </button>
      </Popover.Trigger>
      <Popover.Content align="end">
        <Box
          padding={4}
          display="flex"
          flexDirection="column"
          gap={4}
          backgroundColor="default1"
          borderRadius={2}
          boxShadow="defaultModal"
          __minWidth="280px"
        >
          <Text size={3} fontWeight="bold">
            {intl.formatMessage(modelTypeTabsMessages.settingsTitle)}
          </Text>
          <Box display="flex" flexDirection="column" gap={2}>
            <Text size={2}>{intl.formatMessage(modelTypeTabsMessages.separatorLabel)}</Text>
            <Input
              value={separator}
              onChange={event => onSeparatorChange(event.target.value)}
              data-test-id="model-type-tabs-separator"
            />
          </Box>
          <Checkbox
            checked={groupingEnabled}
            onCheckedChange={checked => onGroupingEnabledChange(checked === true)}
            data-test-id="model-type-tabs-grouping-enabled"
          >
            {intl.formatMessage(modelTypeTabsMessages.groupingEnabledLabel)}
          </Checkbox>
        </Box>
      </Popover.Content>
    </Popover>
  );
};

interface GroupTabDropdownProps {
  group: Extract<ModelTabNode, { kind: "group" }>;
  selectedIds: string[];
  counts: Record<string, ModelTypeTabCount | undefined>;
  onTabChange: (ids: string[]) => void;
  separator: string;
}

const GroupTabDropdown = ({
  group,
  selectedIds,
  counts,
  onTabChange,
  separator,
}: GroupTabDropdownProps) => {
  const intl = useIntl();

  const options = useMemo(() => {
    const allIds = group.subtypes.map(subtype => subtype.id);
    const allCount = aggregateCounts(allIds, counts);
    const allLabel = intl.formatMessage(modelTypeTabsMessages.groupAllLabel, {
      prefix: group.prefix,
      separator,
    });

    return [
      {
        nameLabel: allLabel,
        count: allCount,
        testId: `model-type-tab-${group.id}-all`,
        onSelect: () => onTabChange(allIds),
        isActive: isGroupAllSelected(group, selectedIds),
      },
      ...group.subtypes.map(subtype => ({
        nameLabel: subtype.suffix,
        count: counts[subtype.id],
        testId: `model-type-tab-${subtype.id}`,
        onSelect: () => onTabChange([subtype.id]),
        isActive: selectedIds.length === 1 && selectedIds[0] === subtype.id,
      })),
    ];
  }, [counts, group, intl, onTabChange, selectedIds, separator]);

  const handleCaretClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const handleCaretKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  return (
    <Dropdown>
      <Dropdown.Trigger>
        <button
          type="button"
          className={styles.caretButton}
          aria-label={intl.formatMessage(modelTypeTabsMessages.groupMenuLabel, {
            prefix: group.prefix,
          })}
          data-test-id={`model-type-tab-${group.id}-menu`}
          onClick={handleCaretClick}
          onKeyDown={handleCaretKeyDown}
        >
          <ChevronDown size={14} />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Content align="start">
        <Box>
          <List padding={2} borderRadius={4} boxShadow="defaultOverlay" backgroundColor="default1">
            {options.map(option => (
              <Dropdown.Item key={option.testId}>
                <List.Item
                  borderRadius={4}
                  paddingX={1.5}
                  paddingY={2}
                  onClick={option.onSelect}
                  data-test-id={option.testId}
                  className={option.isActive ? styles.dropdownItemActive : undefined}
                >
                  <Box display="flex" alignItems="center" gap={2} __width="100%">
                    {option.isActive ? <Check size={14} /> : <Box __width="14px" />}
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={3}
                      __flexGrow={1}
                      __minWidth={0}
                    >
                      <Text>{option.nameLabel}</Text>
                      <CountPill count={option.count} active={option.isActive} />
                    </Box>
                  </Box>
                </List.Item>
              </Dropdown.Item>
            ))}
          </List>
        </Box>
      </Dropdown.Content>
    </Dropdown>
  );
};

export const ModelTypeTabs = ({
  pageTypes,
  selectedIds,
  counts,
  onTabChange,
  grouping,
  rightSlot,
}: ModelTypeTabsProps) => {
  const intl = useIntl();
  const stripRef = useRef<HTMLDivElement>(null);
  const measureTabRefs = useRef<Array<HTMLElement | null>>([]);
  const [visibleCount, setVisibleCount] = useState<number | null>(null);
  const visibleCountRef = useRef<number | null>(null);
  const [pinnedIds, setPinnedIds] = useLocalStorage<string[]>(PINNED_TABS_STORAGE_KEY, []);
  // Used only when no parent-owned grouping is supplied (standalone rendering).
  const fallbackGrouping = useModelTypeTabGrouping();
  const { separator, setSeparator, groupingEnabled, setGroupingEnabled, groupingOptions } =
    grouping ?? fallbackGrouping;

  visibleCountRef.current = visibleCount;

  const pinnedSet = useMemo(() => new Set(pinnedIds), [pinnedIds]);
  const isPinned = useCallback((id: string) => pinnedSet.has(id), [pinnedSet]);
  const togglePin = useCallback(
    (id: string) => {
      setPinnedIds(prev =>
        prev.includes(id) ? prev.filter(pinId => pinId !== id) : [...prev, id],
      );
    },
    [setPinnedIds],
  );

  const tabNodes = useMemo(
    () => groupModelTypeTabs(pageTypes ?? [], groupingOptions),
    [groupingOptions, pageTypes],
  );

  const items: ModelTypeTabStripItem[] = useMemo(() => {
    const all: ModelTypeTabStripItem = {
      kind: "all",
      id: ALL_MODELS_TAB_ID,
      name: intl.formatMessage(modelTypeTabsMessages.allTab),
    };
    const pinned = tabNodes.filter(node => pinnedSet.has(getModelTabNodeId(node)));
    const unpinned = tabNodes.filter(node => !pinnedSet.has(getModelTabNodeId(node)));

    return [all, ...pinned, ...unpinned];
  }, [intl, pinnedSet, tabNodes]);
  const itemsLength = items.length;

  const recompute = useCallback(() => {
    const strip = stripRef.current;

    if (!strip) {
      return;
    }

    const widths = measureTabRefs.current.slice(0, itemsLength).map(el => el?.offsetWidth ?? 0);

    if (widths.length !== itemsLength || widths.some(w => w === 0)) {
      return;
    }

    const style = window.getComputedStyle(strip);
    const horizontalPadding =
      parseFloat(style.paddingLeft || "0") + parseFloat(style.paddingRight || "0");
    const available = strip.clientWidth - horizontalPadding;
    const total = widths.reduce((a, b) => a + b, 0);

    if (total <= available) {
      setVisibleCount(prev => (prev === widths.length ? prev : widths.length));

      return;
    }

    const moreAlreadyMounted =
      visibleCountRef.current !== null && visibleCountRef.current < widths.length;
    const reserve = moreAlreadyMounted ? 0 : MORE_BUTTON_RESERVED_WIDTH;

    let running = 0;
    let count = 0;

    for (const w of widths) {
      if (running + w + reserve > available) {
        break;
      }

      running += w;
      count++;
    }

    const next = Math.max(1, count);

    setVisibleCount(prev => (prev === next ? prev : next));
  }, [itemsLength]);

  useLayoutEffect(() => {
    recompute();
  });

  useLayoutEffect(() => {
    if (!stripRef.current || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => recompute());

    observer.observe(stripRef.current);

    return () => observer.disconnect();
  }, [recompute]);

  const activeIndex = items.findIndex(item => isStripItemActive(item, selectedIds));
  let displayItems = items;
  let overflowItems: ModelTypeTabStripItem[] = [];

  if (visibleCount !== null && visibleCount < items.length) {
    const visibleCap = visibleCount;
    const indices = items.map((_, i) => i);

    if (activeIndex >= visibleCap) {
      const visibleIndices = [...indices.slice(0, visibleCap - 1), activeIndex];
      const overflowIndices = indices.filter(i => !visibleIndices.includes(i));

      displayItems = visibleIndices.map(i => items[i]);
      overflowItems = overflowIndices.map(i => items[i]);
    } else {
      displayItems = items.slice(0, visibleCap);
      overflowItems = items.slice(visibleCap);
    }
  }

  const showMore = overflowItems.length > 0;
  const measuring = visibleCount === null;

  const overflowOptions = useMemo(
    () =>
      overflowItems.map(item => {
        const count = getStripItemCount(item, counts);
        const label = getStripItemLabel(item, selectedIds);
        const isActive = isStripItemActive(item, selectedIds);

        return {
          label: (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              gap={3}
              __width="100%"
            >
              <Text>{label}</Text>
              <CountPill count={count} active={isActive} />
            </Box>
          ),
          testId: `model-type-tab-${getStripItemId(item)}`,
          onSelect: () => onTabChange(getStripItemSelection(item)),
        };
      }),
    [counts, onTabChange, overflowItems, selectedIds],
  );

  const renderTabPin = (item: ModelTypeTabStripItem, isActive: boolean) => {
    const itemId = getStripItemId(item);

    if (!isActive || item.kind === "all") {
      return null;
    }

    const pinned = isPinned(itemId);

    return (
      <span
        role="button"
        tabIndex={0}
        className={styles.pinButton}
        aria-label={intl.formatMessage(
          pinned ? modelTypeTabsMessages.unpinTab : modelTypeTabsMessages.pinTab,
        )}
        data-test-id={`model-type-tab-pin-${itemId}`}
        onClick={event => {
          event.stopPropagation();
          togglePin(itemId);
        }}
        onKeyDown={event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            event.stopPropagation();
            togglePin(itemId);
          }
        }}
      >
        {pinned ? <PinOff size={14} /> : <Pin size={14} />}
      </span>
    );
  };

  const renderTabLabel = (item: ModelTypeTabStripItem, isActive: boolean) => {
    const label = getStripItemLabel(item, selectedIds);
    const count = getStripItemCount(item, counts);

    return (
      <>
        {item.kind === "group" && <Layers size={14} className={styles.groupIcon} aria-hidden />}
        <span className={styles.tabLabel} title={label}>
          {label}
        </span>
        <CountPill count={count} active={isActive} />
      </>
    );
  };

  const renderTab = (item: ModelTypeTabStripItem, isActive: boolean) => {
    const itemId = getStripItemId(item);

    if (item.kind === "group") {
      return (
        <div
          key={itemId}
          role="tab"
          aria-selected={isActive}
          className={styles.groupTab}
          data-test-id={`model-type-tab-${itemId}`}
        >
          <button
            type="button"
            className={styles.tabMain}
            onClick={() => onTabChange(getStripItemSelection(item))}
          >
            {renderTabLabel(item, isActive)}
          </button>
          <GroupTabDropdown
            group={item}
            selectedIds={selectedIds}
            counts={counts}
            onTabChange={onTabChange}
            separator={separator}
          />
          {renderTabPin(item, isActive)}
        </div>
      );
    }

    return (
      <button
        key={itemId}
        type="button"
        role="tab"
        aria-selected={isActive}
        className={styles.tab}
        onClick={() => onTabChange(getStripItemSelection(item))}
        data-test-id={`model-type-tab-${itemId}`}
      >
        {renderTabLabel(item, isActive)}
        {renderTabPin(item, isActive)}
      </button>
    );
  };

  const renderMeasureTab = (item: ModelTypeTabStripItem) => {
    if (item.kind === "group") {
      return (
        <span className={styles.groupTab}>
          <span className={styles.tabMain}>{renderTabLabel(item, false)}</span>
          <span className={styles.caretButton} aria-hidden>
            <ChevronDown size={14} />
          </span>
        </span>
      );
    }

    return (
      <button type="button" tabIndex={-1} className={styles.tab}>
        {renderTabLabel(item, false)}
      </button>
    );
  };

  return (
    <div className={styles.row}>
      <div className={styles.measureLayer} aria-hidden>
        {items.map((item, idx) => (
          <span
            key={getStripItemId(item)}
            ref={el => {
              measureTabRefs.current[idx] = el;
            }}
          >
            {renderMeasureTab(item)}
          </span>
        ))}
      </div>

      <div
        role="tablist"
        ref={stripRef}
        className={styles.strip}
        data-test-id="model-type-tabs"
        style={measuring ? { visibility: "hidden" } : undefined}
      >
        {displayItems.map(item => renderTab(item, isStripItemActive(item, selectedIds)))}
      </div>
      {showMore && (
        <div className={styles.moreSlot}>
          <ButtonWithDropdown
            variant="tertiary"
            size="small"
            options={overflowOptions}
            testId="model-type-tabs-more"
            className={styles.moreButton}
          >
            {intl.formatMessage(modelTypeTabsMessages.moreTab)}
          </ButtonWithDropdown>
        </div>
      )}
      <div className={styles.trailingSlot}>
        {rightSlot}
        <ModelTypeTabsSettings
          separator={separator}
          groupingEnabled={groupingEnabled}
          onSeparatorChange={setSeparator}
          onGroupingEnabledChange={setGroupingEnabled}
        />
      </div>
    </div>
  );
};

ModelTypeTabs.displayName = "ModelTypeTabs";
