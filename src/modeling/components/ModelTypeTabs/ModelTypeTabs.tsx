import { ButtonWithDropdown } from "@dashboard/components/ButtonWithDropdown";
import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { Pin, PinOff } from "lucide-react";
import { type ReactNode, useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useIntl } from "react-intl";

import { modelTypeTabsMessages } from "./messages";
import styles from "./ModelTypeTabs.module.css";

export const ALL_MODELS_TAB_ID = "__all__";

const PINNED_TABS_STORAGE_KEY = "modelTypeTabs.pinnedIds";

export interface ModelTypeTabItem {
  id: string;
  name: string;
}

export interface ModelTypeTabCount {
  value: number;
  hasMore: boolean;
}

export interface ModelTypeTabsProps {
  pageTypes: ModelTypeTabItem[] | undefined;
  activeId: string;
  counts: Record<string, ModelTypeTabCount | undefined>;
  onTabChange: (id: string) => void;
  /** Optional slot anchored to the right of the strip, sharing the bottom border. */
  rightSlot?: ReactNode;
}

const formatCount = (count: ModelTypeTabCount | undefined) => {
  if (!count) {
    return null;
  }

  const label = count.hasMore ? `${count.value}+` : `${count.value}`;

  return ` (${label})`;
};

const renderCount = (count: ModelTypeTabCount | undefined) => {
  const label = formatCount(count);

  if (!label) {
    return null;
  }

  return <span className={styles.count}>{label}</span>;
};

// Reserved horizontal budget for the More button + its surrounding slot padding.
const MORE_BUTTON_RESERVED_WIDTH = 140;

export const ModelTypeTabs = ({
  pageTypes,
  activeId,
  counts,
  onTabChange,
  rightSlot,
}: ModelTypeTabsProps) => {
  const intl = useIntl();
  const stripRef = useRef<HTMLDivElement>(null);
  const measureTabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [visibleCount, setVisibleCount] = useState<number | null>(null);
  const visibleCountRef = useRef<number | null>(null);
  const [pinnedIds, setPinnedIds] = useLocalStorage<string[]>(PINNED_TABS_STORAGE_KEY, []);

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

  const items: ModelTypeTabItem[] = useMemo(() => {
    const all: ModelTypeTabItem = {
      id: ALL_MODELS_TAB_ID,
      name: intl.formatMessage(modelTypeTabsMessages.allTab),
    };
    const types = pageTypes ?? [];
    const pinned = types.filter(t => pinnedSet.has(t.id));
    const unpinned = types.filter(t => !pinnedSet.has(t.id));

    return [all, ...pinned, ...unpinned];
  }, [intl, pageTypes, pinnedSet]);
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

    // If the More button is already mounted, clientWidth already excludes its slot.
    // Otherwise we need to reserve space for the slot the next render will introduce.
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

  // Recompute after every commit — picks up tab label changes (e.g. counts arriving async).
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

  // Promote the active tab into the visible set if it would otherwise be hidden.
  const activeIndex = items.findIndex(it => it.id === activeId);
  let displayItems = items;
  let overflowItems: ModelTypeTabItem[] = [];

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
  // Hide the visible strip while we haven't measured yet to avoid a flash of all-tabs.
  const measuring = visibleCount === null;

  const overflowOptions = useMemo(
    () =>
      overflowItems.map(item => {
        const countLabel = formatCount(counts[item.id])?.trim();

        return {
          label: countLabel ? `${item.name} ${countLabel}` : item.name,
          testId: `model-type-tab-${item.id}`,
          onSelect: () => onTabChange(item.id),
        };
      }),
    [overflowItems, counts, onTabChange],
  );

  return (
    <div className={styles.row}>
      {/* Hidden measurement layer — always renders all tabs at their natural width. */}
      <div className={styles.measureLayer} aria-hidden>
        {items.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            tabIndex={-1}
            ref={el => {
              measureTabRefs.current[idx] = el;
            }}
            className={styles.tab}
          >
            <span className={styles.tabLabel}>{item.name}</span>
            {renderCount(counts[item.id])}
          </button>
        ))}
      </div>

      <div
        role="tablist"
        ref={stripRef}
        className={styles.strip}
        data-test-id="model-type-tabs"
        style={measuring ? { visibility: "hidden" } : undefined}
      >
        {displayItems.map(item => {
          const isActive = item.id === activeId;
          const canPin = isActive && item.id !== ALL_MODELS_TAB_ID;
          const pinned = isPinned(item.id);

          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={styles.tab}
              onClick={() => onTabChange(item.id)}
              data-test-id={`model-type-tab-${item.id}`}
            >
              <span className={styles.tabLabel} title={item.name}>
                {item.name}
              </span>
              {renderCount(counts[item.id])}
              {canPin && (
                <span
                  role="button"
                  tabIndex={0}
                  className={styles.pinButton}
                  aria-label={intl.formatMessage(
                    pinned ? modelTypeTabsMessages.unpinTab : modelTypeTabsMessages.pinTab,
                  )}
                  data-test-id={`model-type-tab-pin-${item.id}`}
                  onClick={e => {
                    e.stopPropagation();
                    togglePin(item.id);
                  }}
                  onKeyDown={e => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      e.stopPropagation();
                      togglePin(item.id);
                    }
                  }}
                >
                  {pinned ? <PinOff size={14} /> : <Pin size={14} />}
                </span>
              )}
            </button>
          );
        })}
      </div>
      {rightSlot && <div className={styles.rightSlot}>{rightSlot}</div>}
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
    </div>
  );
};

ModelTypeTabs.displayName = "ModelTypeTabs";
