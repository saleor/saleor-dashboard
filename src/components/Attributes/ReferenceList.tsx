import { DragHandle } from "@dashboard/components/DragHandle/DragHandle";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { Placeholder } from "@dashboard/components/Placeholder/Placeholder";
import { SearchInput } from "@dashboard/components/SearchInput/SearchInput";
import { AttributeEntityTypeEnum } from "@dashboard/graphql";
import { buttonMessages } from "@dashboard/intl";
import { type ReorderEvent } from "@dashboard/types";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToFirstScrollableAncestor,
  restrictToParentElement,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Button, Checkbox, Dropdown, List, Text } from "@saleor/macaw-ui-next";
import clsx from "clsx";
import { ArrowDown, ArrowUp, EllipsisVertical, GalleryHorizontal, ListIcon, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { defineMessages, useIntl } from "react-intl";

import { SortableChipMenu } from "../SortableChipsField/SortableChipMenu";
import {
  commitReorderIndexes,
  useSortableDragOver,
} from "../SortableChipsField/useSortableDragOver";
import { type AttributeReferenceListMode } from "./attributeReferenceListView";
import styles from "./ReferenceList.module.css";
import {
  ReferenceChipBody,
  type ReferenceListValue,
  ReferenceRowBody,
} from "./referenceValueAppearance";
import { savedReferencePosition } from "./savedReferencePosition";
import { useModelReferenceIcons } from "./useModelReferenceIcons";
import {
  mergeReferenceDetails,
  type ProductReferenceDetails,
  useProductReferenceDetails,
} from "./useProductReferenceDetails";

const messages = defineMessages({
  filterProducts: {
    id: "anv5WJ",
    defaultMessage: "Filter {count, plural, one {# product} other {# products}}",
    description: "search field in a product reference list",
  },
  filterVariants: {
    id: "1PClWl",
    defaultMessage: "Filter {count, plural, one {# product variant} other {# product variants}}",
    description: "search field in a product variant reference list",
  },
  filterModels: {
    id: "F8VOsV",
    defaultMessage: "Filter {count, plural, one {# model} other {# models}}",
    description: "search field in a model reference list",
  },
  filterCategories: {
    id: "VvlXUe",
    defaultMessage: "Filter {count, plural, one {# category} other {# categories}}",
    description: "search field in a category reference list",
  },
  filterCollections: {
    id: "qBa0ms",
    defaultMessage: "Filter {count, plural, one {# collection} other {# collections}}",
    description: "search field in a collection reference list",
  },
  listActions: {
    id: "b7yA7/",
    defaultMessage: "List actions",
    description: "accessible label of the reference list menu",
  },
  removeAll: {
    id: "61Ix0p",
    defaultMessage: "Remove all",
    description: "dangerous action that clears every value in a reference attribute",
  },
  deleteSelected: {
    defaultMessage: "Delete ({count})",
    id: "7sAOBL",
    description: "removes the checked references from an attribute",
  },
  selectedCount: {
    id: "uxsZRg",
    defaultMessage: "{count, plural, one {# selected} other {# selected}}",
    description: "how many product references are checked",
  },
  moveUp: {
    id: "mGjaDZ",
    defaultMessage: "Move up",
    description: "moves a product reference one position up",
  },
  moveDown: {
    id: "ADOU97",
    defaultMessage: "Move down",
    description: "moves a product reference one position down",
  },
  listView: {
    id: "gzSP20",
    defaultMessage: "List",
    description: "show referenced products as a list",
  },
  packedView: {
    id: "Edp8Kj",
    defaultMessage: "Packed",
    description: "show referenced products as a wrapped row of chips",
  },
  noProducts: {
    id: "QYrORf",
    defaultMessage: "No products",
    description: "empty product reference list",
  },
  noVariants: {
    id: "6kPUGg",
    defaultMessage: "No product variants",
    description: "empty product variant reference list",
  },
  noModels: {
    id: "SRhwCq",
    defaultMessage: "No models",
    description: "empty model reference list",
  },
  noCategories: {
    id: "lmUorC",
    defaultMessage: "No categories",
    description: "empty category reference list",
  },
  noCollections: {
    id: "hNTI05",
    defaultMessage: "No collections",
    description: "empty collection reference list",
  },
  noResults: {
    defaultMessage: 'No results found for "{query}"',
    id: "KILQYJ",
    description: "empty state when a reference list filter matches nothing",
  },
});

/** Wrapped chips must reflow in the DOM. Transform offsets overlap variable-width items. */
function disableSortingStrategy() {
  return null;
}

const filterMessageByEntity: Partial<
  Record<AttributeEntityTypeEnum, (typeof messages)[keyof typeof messages]>
> = {
  [AttributeEntityTypeEnum.PRODUCT]: messages.filterProducts,
  [AttributeEntityTypeEnum.PRODUCT_VARIANT]: messages.filterVariants,
  [AttributeEntityTypeEnum.PAGE]: messages.filterModels,
  [AttributeEntityTypeEnum.CATEGORY]: messages.filterCategories,
  [AttributeEntityTypeEnum.COLLECTION]: messages.filterCollections,
};

const emptyMessageByEntity: Partial<
  Record<AttributeEntityTypeEnum, (typeof messages)[keyof typeof messages]>
> = {
  [AttributeEntityTypeEnum.PRODUCT]: messages.noProducts,
  [AttributeEntityTypeEnum.PRODUCT_VARIANT]: messages.noVariants,
  [AttributeEntityTypeEnum.PAGE]: messages.noModels,
  [AttributeEntityTypeEnum.CATEGORY]: messages.noCategories,
  [AttributeEntityTypeEnum.COLLECTION]: messages.noCollections,
};

interface ReferenceListProps {
  values: ReferenceListValue[];
  entityType?: AttributeEntityTypeEnum | null;
  disabled?: boolean;
  /** Preloaded rows. When set, the list does not request product details. */
  details?: ProductReferenceDetails[];
  /** Reference ids in the last saved order. The row number stays on this until save. */
  savedIds?: readonly string[];
  /** When set with `onViewChange`, the list or packed choice is remembered by the parent. */
  view?: AttributeReferenceListMode;
  onViewChange?: (mode: AttributeReferenceListMode) => void;
  onRemove: (ids: string[]) => void;
  onRemoveAll: () => void;
  onReorder: (event: ReorderEvent) => void;
}

interface ReferenceRowProps {
  value: ReferenceListValue;
  entityType?: AttributeEntityTypeEnum | null;
  index: number;
  position: number;
  count: number;
  subtitle?: string | null;
  thumbnailUrl?: string | null;
  checked: boolean;
  disabled?: boolean;
  draggable: boolean;
  onCheckedChange: (id: string) => void;
  onRemove: (id: string) => void;
  onReorder: (event: ReorderEvent) => void;
}

const ReferenceRow = ({
  value,
  entityType,
  index,
  position,
  count,
  subtitle,
  thumbnailUrl,
  checked,
  disabled,
  draggable,
  onCheckedChange,
  onRemove,
  onReorder,
}: ReferenceRowProps) => {
  const intl = useIntl();
  const moveUpLabel = intl.formatMessage(messages.moveUp);
  const moveDownLabel = intl.formatMessage(messages.moveDown);
  const removeLabel = intl.formatMessage(buttonMessages.remove);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: value.value,
    disabled: disabled || !draggable,
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={styles.row}
      data-test-id="product-reference-row"
      data-checked={checked ? "true" : undefined}
      data-dragging={isDragging ? "true" : undefined}
    >
      <div
        className={clsx(styles.grip, !draggable && styles.gripMuted)}
        {...attributes}
        {...listeners}
        data-test-id="button-drag-handle"
      >
        <DragHandle
          cursor={draggable && !disabled ? (isDragging ? "grabbing" : "grab") : "not-allowed"}
        />
      </div>
      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={() => onCheckedChange(value.value)}
        data-test-id="product-reference-checkbox"
      />
      <span className={styles.index}>{position}</span>
      <div className={styles.identity}>
        <ReferenceRowBody
          value={value}
          entityType={entityType}
          subtitle={subtitle}
          thumbnailUrl={thumbnailUrl}
        />
      </div>
      <div className={styles.actions}>
        <span title={moveUpLabel} className={styles.action}>
          <Button
            variant="tertiary"
            size="small"
            type="button"
            disabled={disabled || index === 0}
            aria-label={moveUpLabel}
            title={moveUpLabel}
            data-test-id="product-reference-move-up"
            onClick={() => onReorder({ oldIndex: index, newIndex: index - 1 })}
            icon={<ArrowUp size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
          />
        </span>
        <span title={moveDownLabel} className={styles.action}>
          <Button
            variant="tertiary"
            size="small"
            type="button"
            disabled={disabled || index === count - 1}
            aria-label={moveDownLabel}
            title={moveDownLabel}
            data-test-id="product-reference-move-down"
            onClick={() => onReorder({ oldIndex: index, newIndex: index + 1 })}
            icon={<ArrowDown size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
          />
        </span>
        <span title={removeLabel} className={styles.action}>
          <Button
            variant="tertiary"
            size="small"
            type="button"
            disabled={disabled}
            aria-label={removeLabel}
            title={removeLabel}
            data-test-id="product-reference-remove"
            onClick={() => onRemove(value.value)}
            icon={<X size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
          />
        </span>
      </div>
    </div>
  );
};

interface ReferenceChipProps {
  value: ReferenceListValue;
  entityType?: AttributeEntityTypeEnum | null;
  index: number;
  count: number;
  thumbnailUrl?: string | null;
  disabled?: boolean;
  draggable: boolean;
  onRemove: (id: string) => void;
  onReorder: (event: ReorderEvent) => void;
}

const ReferenceChip = ({
  value,
  entityType,
  index,
  count,
  thumbnailUrl,
  disabled,
  draggable,
  onRemove,
  onReorder,
}: ReferenceChipProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: value.value,
    disabled: disabled || !draggable,
  });
  // The held chip is a separate overlay. A transform here would slide this
  // variable-width chip across the wrap and leave the others overlapping.
  const style = {
    transform: isDragging ? undefined : CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(styles.chip, isDragging && styles.chipDragging)}
      data-test-id="product-reference-chip"
      data-dragging={isDragging ? "true" : undefined}
    >
      <div
        className={clsx(styles.chipGrip, !draggable && styles.gripMuted)}
        {...attributes}
        {...listeners}
        data-test-id="button-drag-handle"
      >
        <DragHandle
          cursor={draggable && !disabled ? (isDragging ? "grabbing" : "grab") : "not-allowed"}
        />
      </div>
      <ReferenceChipBody value={value} entityType={entityType} thumbnailUrl={thumbnailUrl} />
      <SortableChipMenu
        count={count}
        disabled={disabled}
        index={index}
        onMove={newIndex => onReorder({ oldIndex: index, newIndex })}
        onRemove={() => onRemove(value.value)}
      />
    </div>
  );
};

export const ReferenceList = ({
  values: incomingValues,
  entityType = AttributeEntityTypeEnum.PRODUCT,
  disabled,
  details,
  savedIds,
  view: viewProp,
  onViewChange,
  onRemove,
  onRemoveAll,
  onReorder,
}: ReferenceListProps) => {
  const intl = useIntl();
  const modelIcons = useModelReferenceIcons({
    entityType,
    ids: incomingValues.map(value => value.value),
  });
  const valuesWithIcons = useMemo(
    () =>
      modelIcons.size === 0
        ? incomingValues
        : incomingValues.map(value => ({
            ...value,
            icon: modelIcons.get(value.value) ?? value.icon,
          })),
    [incomingValues, modelIcons],
  );
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [uncontrolledView, setUncontrolledView] = useState<AttributeReferenceListMode>("list");
  const view = viewProp ?? uncontrolledView;
  const setView = (mode: AttributeReferenceListMode) => {
    onViewChange?.(mode);

    if (viewProp === undefined) {
      setUncontrolledView(mode);
    }
  };
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const draftRef = useRef<ReferenceListValue[] | null>(null);
  const [draft, setDraft] = useState<ReferenceListValue[] | null>(null);
  const provisionalPositions = useRef(new Map<string, number>());
  const valueIds = incomingValues.map(value => value.value);
  const fetchedDetails = useProductReferenceDetails({
    ids: valueIds,
    entityType,
    skip: details !== undefined,
  });
  const resolved = useMemo(() => {
    if (details !== undefined) {
      return new Map(details.map(item => [item.id, item]));
    }

    return fetchedDetails;
  }, [details, fetchedDetails]);
  const values = useMemo(
    () => mergeReferenceDetails(valuesWithIcons, resolved),
    [resolved, valuesWithIcons],
  );
  const orderedValues = draft ?? values;

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visibleValues = normalizedQuery
    ? orderedValues.filter(value => {
        const detail = resolved.get(value.value);
        const subtitle = detail?.categoryName ?? detail?.productTypeName ?? "";

        return (
          value.label.toLocaleLowerCase().includes(normalizedQuery) ||
          (value.caption ?? "").toLocaleLowerCase().includes(normalizedQuery) ||
          subtitle.toLocaleLowerCase().includes(normalizedQuery)
        );
      })
    : orderedValues;
  const reorderLocally = (event: ReorderEvent) => {
    const source = draftRef.current ?? values;
    const next = [...source];
    const [moved] = next.splice(event.oldIndex, 1);

    if (!moved) {
      return;
    }

    next.splice(event.newIndex, 0, moved);
    draftRef.current = next;
    setDraft(next);
  };
  const { handleDragOver } = useSortableDragOver({
    items: orderedValues,
    onReorder: reorderLocally,
  });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );
  const selectedSet = new Set(selected.filter(id => valueIds.includes(id)));

  const toggle = (id: string) => {
    setSelected(current =>
      current.includes(id) ? current.filter(item => item !== id) : [...current, id],
    );
  };

  const startPackedDrag = (event: DragStartEvent) => {
    draftRef.current = values;
    setDraft(values);
    setActiveId(event.active.id);
  };
  const finishPackedDrag = (event: DragEndEvent, commit: boolean) => {
    const next = draftRef.current;

    draftRef.current = null;
    setDraft(null);
    setActiveId(null);

    if (!commit || disabled || !next) {
      return;
    }

    const reorder = commitReorderIndexes(
      values.map(value => value.value),
      next.map(value => value.value),
      String(event.active.id),
    );

    if (reorder) {
      onReorder(reorder);
    }
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = values.findIndex(value => value.value === active.id);
    const newIndex = values.findIndex(value => value.value === over.id);

    if (oldIndex < 0 || newIndex < 0) {
      return;
    }

    onReorder({ oldIndex, newIndex });
  };
  const activeValue = orderedValues.find(value => value.value === activeId);
  const activeDetail = activeValue ? resolved.get(activeValue.value) : undefined;

  if (values.length === 0) {
    return (
      <Box paddingX={6} paddingY={4} data-test-id="product-reference-list">
        <Placeholder>
          {intl.formatMessage(
            (entityType && emptyMessageByEntity[entityType]) || messages.noProducts,
          )}
        </Placeholder>
      </Box>
    );
  }

  return (
    <Box data-test-id="product-reference-list">
      <Box className={styles.search}>
        <Box className={styles.toolbar}>
          <Box className={styles.searchField}>
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder={intl.formatMessage(
                (entityType && filterMessageByEntity[entityType]) || messages.filterProducts,
                { count: values.length },
              )}
              data-test-id="attribute-reference-search"
            />
          </Box>
          {selectedSet.size > 0 ? (
            <Text
              size={2}
              color="default2"
              whiteSpace="nowrap"
              data-test-id="product-reference-selected"
            >
              {intl.formatMessage(messages.selectedCount, { count: selectedSet.size })}
            </Text>
          ) : null}
          <Box className={styles.toolbarActions}>
            {selectedSet.size > 0 ? (
              <Button
                variant="error"
                size="small"
                type="button"
                disabled={disabled}
                data-test-id="product-reference-remove-selected"
                onClick={() => {
                  onRemove([...selectedSet]);
                  setSelected([]);
                }}
              >
                {intl.formatMessage(messages.deleteSelected, { count: selectedSet.size })}
              </Button>
            ) : null}
            <Box className={styles.viewToggle}>
              <Button
                variant={view === "list" ? "secondary" : "tertiary"}
                size="small"
                type="button"
                aria-pressed={view === "list"}
                aria-label={intl.formatMessage(messages.listView)}
                data-test-id="product-reference-view-list"
                onClick={() => setView("list")}
                icon={<ListIcon size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />}
              />
              <Button
                variant={view === "packed" ? "secondary" : "tertiary"}
                size="small"
                type="button"
                aria-pressed={view === "packed"}
                aria-label={intl.formatMessage(messages.packedView)}
                data-test-id="product-reference-view-packed"
                onClick={() => setView("packed")}
                icon={
                  <GalleryHorizontal
                    size={iconSize.small}
                    strokeWidth={iconStrokeWidthBySize.small}
                  />
                }
              />
            </Box>
            <Dropdown>
              <Dropdown.Trigger>
                <Button
                  variant="tertiary"
                  size="small"
                  type="button"
                  disabled={disabled || values.length === 0}
                  aria-label={intl.formatMessage(messages.listActions)}
                  data-test-id="attribute-reference-list-menu"
                  icon={
                    <EllipsisVertical
                      size={iconSize.small}
                      strokeWidth={iconStrokeWidthBySize.small}
                    />
                  }
                />
              </Dropdown.Trigger>
              <Dropdown.Content align="end">
                <List
                  padding={2}
                  borderRadius={4}
                  boxShadow="defaultOverlay"
                  backgroundColor="default1"
                >
                  <Dropdown.Item>
                    <List.Item
                      borderRadius={4}
                      paddingX={1.5}
                      paddingY={2}
                      disabled={disabled || values.length === 0}
                      onClick={onRemoveAll}
                      data-test-id="attribute-reference-remove-all"
                    >
                      <Text color="critical1">{intl.formatMessage(messages.removeAll)}</Text>
                    </List.Item>
                  </Dropdown.Item>
                </List>
              </Dropdown.Content>
            </Dropdown>
          </Box>
        </Box>
      </Box>
      <DndContext
        sensors={sensors}
        collisionDetection={view === "list" ? closestCenter : pointerWithin}
        modifiers={
          view === "list"
            ? [restrictToVerticalAxis, restrictToParentElement]
            : [restrictToFirstScrollableAncestor]
        }
        onDragStart={view === "packed" ? startPackedDrag : undefined}
        onDragOver={view === "packed" ? handleDragOver : undefined}
        onDragEnd={view === "packed" ? event => finishPackedDrag(event, true) : handleDragEnd}
        onDragCancel={view === "packed" ? event => finishPackedDrag(event, false) : undefined}
      >
        <SortableContext
          items={visibleValues.map(value => value.value)}
          strategy={view === "list" ? verticalListSortingStrategy : disableSortingStrategy}
        >
          {visibleValues.length === 0 ? (
            <Box paddingX={6} paddingY={4} data-test-id="product-reference-no-results">
              <Placeholder>
                {intl.formatMessage(messages.noResults, { query: query.trim() })}
              </Placeholder>
            </Box>
          ) : (
            <div
              className={view === "list" ? styles.scroll : styles.flow}
              data-test-id="product-reference-scroll"
            >
              {visibleValues.map(value => {
                const index = orderedValues.findIndex(item => item.value === value.value);
                const position =
                  savedReferencePosition({
                    id: value.value,
                    savedIds,
                    provisional: provisionalPositions.current,
                  }) ?? index + 1;
                const detail = resolved.get(value.value);

                if (view === "packed") {
                  return (
                    <ReferenceChip
                      key={value.value}
                      value={value}
                      entityType={entityType}
                      index={index}
                      count={orderedValues.length}
                      thumbnailUrl={detail?.thumbnailUrl}
                      disabled={disabled}
                      draggable={!normalizedQuery}
                      onRemove={id => onRemove([id])}
                      onReorder={onReorder}
                    />
                  );
                }

                return (
                  <ReferenceRow
                    key={value.value}
                    value={value}
                    entityType={entityType}
                    index={index}
                    position={position}
                    count={values.length}
                    subtitle={detail?.categoryName || detail?.productTypeName}
                    thumbnailUrl={detail?.thumbnailUrl}
                    checked={selectedSet.has(value.value)}
                    disabled={disabled}
                    draggable={!normalizedQuery}
                    onCheckedChange={toggle}
                    onRemove={id => onRemove([id])}
                    onReorder={onReorder}
                  />
                );
              })}
            </div>
          )}
        </SortableContext>
        {view === "packed"
          ? createPortal(
              <DragOverlay>
                {activeValue ? (
                  <div className={clsx(styles.chip, styles.chipLifted)}>
                    <ReferenceChipBody
                      value={activeValue}
                      entityType={entityType}
                      thumbnailUrl={activeDetail?.thumbnailUrl}
                    />
                  </div>
                ) : null}
              </DragOverlay>,
              document.body,
            )
          : null}
      </DndContext>
    </Box>
  );
};

ReferenceList.displayName = "ReferenceList";
