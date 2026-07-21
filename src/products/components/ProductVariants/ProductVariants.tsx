import { type ChannelData } from "@dashboard/channels/utils";
import BackButton from "@dashboard/components/BackButton";
import { ConfirmButton } from "@dashboard/components/ConfirmButton";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import {
  Datagrid,
  type DatagridRenderHeaderProps,
  type GetCellContentOpts,
} from "@dashboard/components/Datagrid/Datagrid";
import {
  type DatagridChangeOpts,
  DatagridChangeStateContext,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import { DashboardModal } from "@dashboard/components/Modal";
import { PRODUCT_VARIANTS_PAGINATE_BY } from "@dashboard/config";
import {
  type ProductDetailsVariantFragment,
  type ProductFragment,
  type ProductVariantBulkCreateInput,
  type RefreshLimitsQuery,
  useWarehouseListQuery,
  type VariantAttributeFragment,
} from "@dashboard/graphql";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { buttonMessages } from "@dashboard/intl";
import { type ProductVariantListError } from "@dashboard/products/views/ProductUpdate/handlers/errors";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { CompactSelection, type GridSelection, type Item } from "@glideapps/glide-data-grid";
import { type Option } from "@saleor/macaw-ui-next";
import { Pencil } from "lucide-react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";

import { ProductVariantGenerator } from "../ProductVariantGenerator/ProductVariantGenerator";
import {
  type BulkCreateResult,
  getUnsupportedRequiredAttributes,
} from "../ProductVariantGenerator/types";
import { ProductVariantsHeader } from "./components/ProductVariantsHeader";
import {
  isVariantDatagridSupportedAttribute,
  useAttributesAdapter,
  useChannelAdapter,
  useChannelAvailabilityAdapter,
  useWarehouseAdapter,
  variantsStaticColumnsAdapter,
} from "./datagrid";
import messages from "./messages";
import { getData, getError } from "./utils";

interface ProductVariantsProps {
  channels: ChannelData[];
  errors: ProductVariantListError[];
  limits: RefreshLimitsQuery["shop"]["limits"];
  variantAttributes: ProductFragment["productType"]["variantAttributes"];
  /** Attributes that can be used for variant selection (DROPDOWN, BOOLEAN, SWATCH, NUMERIC types with variantSelection enabled) */
  selectionVariantAttributes: ProductFragment["productType"]["selectionVariantAttributes"];
  /** Attributes that are NOT used for variant selection but may still be required on variants */
  nonSelectionVariantAttributes: ProductFragment["productType"]["nonSelectionVariantAttributes"];
  variants: ProductDetailsVariantFragment[];
  variantsSearch?: string;
  onVariantsSearchChange?: (query: string) => void;
  variantsPageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  } | null;
  onVariantsNextPage?: () => void;
  onVariantsPreviousPage?: () => void;
  variantsRangeLabel?: string | null;
  variantsTotalCount?: number | null;
  variantsLoading?: boolean;
  pendingVariantDeleteCount?: number;
  productName: string;
  productId: string;
  productTypeId: string;
  /** Whether the product type supports multiple variants with attributes */
  hasVariants: boolean;
  onAttributeValuesSearch: (id: string, query: string) => Promise<Option[]>;
  onChange: (data: DatagridChangeOpts) => void;
  onStageVariantRemovals?: (ids: string[]) => void;
  onRowClick: (id: string) => void;
  onBulkCreate?: (inputs: ProductVariantBulkCreateInput[]) => Promise<BulkCreateResult>;
}

export const ProductVariants = ({
  channels,
  errors,
  variants,
  variantsSearch = "",
  onVariantsSearchChange,
  variantsPageInfo,
  onVariantsNextPage,
  onVariantsPreviousPage,
  variantsRangeLabel,
  variantsLoading = false,
  pendingVariantDeleteCount = 0,
  variantAttributes,
  selectionVariantAttributes,
  nonSelectionVariantAttributes,
  productName,
  productId,
  productTypeId,
  hasVariants,
  onAttributeValuesSearch,
  onChange,
  onStageVariantRemovals,
  onRowClick,
  onBulkCreate,
}: ProductVariantsProps) => {
  const intl = useIntl();
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);
  /** Existing variants selected across pages (by id). */
  const [selectedVariantIds, setSelectedVariantIds] = useState<Set<string>>(() => new Set());
  /** Newly added rows are page-local — track by visual row index. */
  const [selectedAddedVisualRows, setSelectedAddedVisualRows] = useState<number[]>([]);
  /**
   * Glide needs `current` (focused cell / edit target) and `columns` mirrored back when
   * selection is controlled. Row checkboxes are ID-keyed separately for cross-page select.
   */
  const [selectionCurrent, setSelectionCurrent] = useState<GridSelection["current"]>();
  const [selectionColumns, setSelectionColumns] = useState(() => CompactSelection.empty());
  const variantsPageKey = useMemo(() => variants.map(variant => variant.id).join("\0"), [variants]);

  useEffect(
    function clearPageLocalSelectionOnPageChange() {
      setSelectedAddedVisualRows([]);
      setSelectionCurrent(undefined);
      setSelectionColumns(CompactSelection.empty());
    },
    [variantsPageKey],
  );

  // Access datagrid state to check for unsaved changes
  const datagridState = useContext(DatagridChangeStateContext);
  const removedRowIndexes = datagridState?.removed ?? [];
  const visibleExistingVariants = useMemo(
    () => variants.filter((_, index) => !removedRowIndexes.includes(index)),
    [removedRowIndexes, variants],
  );

  const gridSelection = useMemo((): GridSelection | undefined => {
    let rows = CompactSelection.empty();

    visibleExistingVariants.forEach((variant, visualRow) => {
      if (selectedVariantIds.has(variant.id)) {
        rows = rows.add(visualRow);
      }
    });
    selectedAddedVisualRows.forEach(visualRow => {
      rows = rows.add(visualRow);
    });

    if (rows.length === 0 && !selectionCurrent && selectionColumns.length === 0) {
      return undefined;
    }

    return {
      current: selectionCurrent,
      columns: selectionColumns,
      rows,
    };
  }, [
    selectedAddedVisualRows,
    selectedVariantIds,
    selectionColumns,
    selectionCurrent,
    visibleExistingVariants,
  ]);

  const handleGridSelectionChange = useCallback(
    (selection: GridSelection | undefined) => {
      setSelectionCurrent(selection?.current);
      setSelectionColumns(selection?.columns ?? CompactSelection.empty());

      const selectedVisualRows = selection?.rows.toArray() ?? [];

      setSelectedVariantIds(previousIds => {
        const nextIds = new Set(previousIds);

        visibleExistingVariants.forEach(variant => {
          nextIds.delete(variant.id);
        });
        selectedVisualRows.forEach(visualRow => {
          if (visualRow < visibleExistingVariants.length) {
            nextIds.add(visibleExistingVariants[visualRow].id);
          }
        });

        return nextIds;
      });
      setSelectedAddedVisualRows(
        selectedVisualRows.filter(visualRow => visualRow >= visibleExistingVariants.length),
      );
    },
    [visibleExistingVariants],
  );

  const selectedCount = selectedVariantIds.size + selectedAddedVisualRows.length;

  const handleBulkDeleteSelected = useCallback(() => {
    // Remove newly added rows first (page-local indexes are still valid).
    if (datagridState && selectedAddedVisualRows.length > 0) {
      const { added, removed, changes, setAdded } = datagridState;
      const rowsToRemove = selectedAddedVisualRows;
      const getRowOffset = (row: number) => rowsToRemove.filter(r => r < row).length;
      const newAdded = added
        .filter(row => !rowsToRemove.includes(row))
        .map(row => row - getRowOffset(row));

      changes.current = changes.current
        .filter(change => !rowsToRemove.includes(change.row))
        .map(change => ({
          ...change,
          row: change.row - getRowOffset(change.row),
        }));
      setAdded(newAdded);
      onChange({
        updates: changes.current,
        added: newAdded,
        removed,
      });
    }

    if (selectedVariantIds.size > 0) {
      onStageVariantRemovals?.([...selectedVariantIds]);
    }

    setSelectedVariantIds(new Set());
    setSelectedAddedVisualRows([]);
    setSelectionCurrent(undefined);
    setSelectionColumns(CompactSelection.empty());
  }, [
    datagridState,
    onChange,
    onStageVariantRemovals,
    selectedAddedVisualRows,
    selectedVariantIds,
  ]);

  const hasAddedRows = Boolean(datagridState && datagridState.added.length > 0);
  const hasUnsavedChanges =
    datagridState &&
    (datagridState.removed.length > 0 ||
      datagridState.added.length > 0 ||
      datagridState.changes.current.length > 0);

  // Pagination/search can keep ID-keyed updates/removes; only brand-new rows are page-local.
  const guardAddedRowsThen = useCallback(
    (action: () => void) => {
      if (hasAddedRows) {
        setShowUnsavedWarning(true);

        return;
      }

      action();
    },
    [hasAddedRows],
  );

  // https://github.com/saleor/saleor-dashboard/issues/4165
  const { data: warehousesData } = useWarehouseListQuery({
    variables: {
      first: 50,
    },
  });
  const warehouses = mapEdgesToItems(warehousesData?.warehouses);

  const handleOpenGenerator = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowUnsavedWarning(true);
    } else {
      setGeneratorOpen(true);
    }
  }, [hasUnsavedChanges]);

  const handleCloseGenerator = useCallback(() => {
    setGeneratorOpen(false);
  }, []);

  const handleCloseUnsavedWarning = useCallback(() => {
    setShowUnsavedWarning(false);
  }, []);

  const handleGenerateVariants = useCallback(
    async (inputs: ProductVariantBulkCreateInput[]): Promise<BulkCreateResult> => {
      if (onBulkCreate) {
        const result = await onBulkCreate(inputs);

        // Only close if successful (no attribute errors)
        if (result.success && result.attributeErrors.length === 0) {
          setGeneratorOpen(false);
        }

        return result;
      }

      // Fallback if no handler
      return {
        success: false,
        successCount: 0,
        failedCount: inputs.length,
        attributeErrors: [],
        otherErrors: [],
      };
    },
    [onBulkCreate],
  );

  const hasSelectionVariantAttributes = (selectionVariantAttributes?.length ?? 0) > 0;

  // Check for required non-selection attributes with unsupported types
  // These block the generator entirely
  const unsupportedRequiredAttributes = useMemo(
    () => getUnsupportedRequiredAttributes(nonSelectionVariantAttributes),
    [nonSelectionVariantAttributes],
  );

  // Normally this should be in LS handled by useListSettings hook
  // https://github.com/saleor/saleor-dashboard/issues/4164

  const initialSettings = useMemo(
    () =>
      channels && warehouses && variantAttributes
        ? [
            "name",
            "sku",
            ...channels.flatMap(channel => [
              `availableInChannel:${channel.id}`,
              `channel:${channel.id}`,
            ]),
            ...warehouses.map(warehouse => `warehouse:${warehouse.id}`),
            ...(variantAttributes
              ?.filter(attribute => isVariantDatagridSupportedAttribute(attribute.inputType))
              .map(attribute => `attribute:${attribute.id}`) ?? []),
          ]
        : undefined,
    [channels, variantAttributes, warehouses],
  );
  const [columnSettings, setColumnSettings] = useStateFromProps<string[] | undefined>(
    initialSettings,
  );

  useEffect(() => {
    if (columnSettings) {
      handlers.onResetDynamicToInitial();
    }
  }, [columnSettings]);

  const handleColumnChange = useCallback(
    (picked: string[]) => {
      setColumnSettings(picked);
    },
    [setColumnSettings],
  );

  // const limitReached = isLimitReached(limits, "productVariants");

  const channelCategory = useChannelAdapter({
    intl,
    listings: channels,
    selectedColumns: columnSettings,
  });
  const availabilityCategory = useChannelAvailabilityAdapter({
    intl,
    listings: channels,
    selectedColumns: columnSettings,
  });
  const attributeCategory = useAttributesAdapter({
    intl,
    selectedColumns: columnSettings,
    attributes: variantAttributes,
  });
  const warehouseCategory = useWarehouseAdapter({
    selectedColumns: columnSettings,
    intl,
    warehouses,
  });
  const memoizedStaticColumns = useMemo(() => variantsStaticColumnsAdapter(intl), [intl]);
  const {
    handlers,
    columnCategories,
    visibleColumns,
    staticColumns,
    dynamicColumns,
    selectedColumns,
    recentlyAddedColumn,
  } = useColumns({
    gridName: "variants",
    staticColumns: memoizedStaticColumns,
    columnCategories: [channelCategory, availabilityCategory, attributeCategory, warehouseCategory],
    selectedColumns: columnSettings ?? [],
    onSave: handleColumnChange,
  });
  const getCellContent = useCallback(
    ([column, row]: Item, opts: GetCellContentOpts) =>
      getData({
        availableColumns: visibleColumns,
        column,
        row,
        channels,
        variants,
        variantAttributes,
        searchAttributeValues: onAttributeValuesSearch,
        loading: variantsLoading,
        ...opts,
      }),
    [
      channels,
      visibleColumns,
      onAttributeValuesSearch,
      variantAttributes,
      variants,
      variantsLoading,
    ],
  );
  const getCellError = useCallback(
    ([column, row]: Item, opts: GetCellContentOpts) =>
      getError(errors, {
        availableColumns: visibleColumns,
        column,
        row,
        channels,
        variants,
        searchAttributeValues: onAttributeValuesSearch,
        ...opts,
      }),
    [errors, visibleColumns, channels, variants, onAttributeValuesSearch],
  );

  const renderHeader = useCallback(
    (props: DatagridRenderHeaderProps) => (
      <ProductVariantsHeader
        {...props}
        productId={productId}
        productTypeId={productTypeId}
        productName={productName}
        hasVariants={hasVariants}
        hasVariantAttributes={hasSelectionVariantAttributes}
        unsupportedRequiredAttributes={unsupportedRequiredAttributes}
        onGenerateVariants={handleOpenGenerator}
        variantsSearch={variantsSearch}
        onVariantsSearchChange={onVariantsSearchChange}
        variantsPageInfo={variantsPageInfo}
        onVariantsNextPage={onVariantsNextPage}
        onVariantsPreviousPage={onVariantsPreviousPage}
        variantsRangeLabel={variantsRangeLabel}
        onGuardUnsavedAction={guardAddedRowsThen}
        selectedCount={selectedCount}
        onDeleteSelected={handleBulkDeleteSelected}
        deleteDisabled={variantsLoading}
        pendingVariantDeleteCount={pendingVariantDeleteCount}
      />
    ),
    [
      productId,
      productTypeId,
      productName,
      hasVariants,
      hasSelectionVariantAttributes,
      unsupportedRequiredAttributes,
      handleOpenGenerator,
      variantsSearch,
      onVariantsSearchChange,
      variantsPageInfo,
      onVariantsNextPage,
      onVariantsPreviousPage,
      variantsRangeLabel,
      guardAddedRowsThen,
      selectedCount,
      handleBulkDeleteSelected,
      variantsLoading,
      pendingVariantDeleteCount,
    ],
  );

  const editVariantIcon = useMemo(
    () => <Pencil size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
    [],
  );

  const menuItems = useCallback(
    (index: number) => [
      {
        label: "Edit Variant",
        onSelect: () => onRowClick(variants[index].id),
        Icon: editVariantIcon,
      },
    ],
    [editVariantIcon, onRowClick, variants],
  );

  return (
    <>
      <Datagrid
        fillHandle={true}
        renderHeader={renderHeader}
        availableColumns={visibleColumns}
        emptyText={
          variantsSearch.trim()
            ? intl.formatMessage(messages.emptySearch, { query: variantsSearch.trim() })
            : intl.formatMessage(messages.empty)
        }
        getCellContent={getCellContent}
        getCellError={getCellError}
        menuItems={menuItems}
        rows={
          variantsLoading
            ? variants.length > 0
              ? variants.length
              : PRODUCT_VARIANTS_PAGINATE_BY
            : (variants?.length ?? 0)
        }
        selectionActions={() => null}
        onColumnResize={handlers.onResize}
        onColumnMoved={handlers.onMove}
        renderColumnPicker={() => (
          <ColumnPicker
            staticColumns={staticColumns}
            dynamicColumns={dynamicColumns}
            selectedColumns={selectedColumns}
            columnCategories={columnCategories}
            onToggle={handlers.onToggle}
            side="left"
          />
        )}
        onChange={onChange}
        recentlyAddedColumn={recentlyAddedColumn}
        controlledSelection={gridSelection}
        onControlledSelectionChange={handleGridSelectionChange}
        rowSelectionBlending="mixed"
      />
      {hasVariants && hasSelectionVariantAttributes && onBulkCreate && (
        <ProductVariantGenerator
          open={generatorOpen}
          onClose={handleCloseGenerator}
          productId={productId}
          productName={productName}
          variantAttributes={selectionVariantAttributes as VariantAttributeFragment[]}
          nonSelectionVariantAttributes={
            nonSelectionVariantAttributes as VariantAttributeFragment[]
          }
          onAttributeValuesSearch={onAttributeValuesSearch}
          onSubmit={handleGenerateVariants}
        />
      )}

      {/* Warning dialog when trying to open generator with unsaved changes */}
      <DashboardModal onChange={handleCloseUnsavedWarning} open={showUnsavedWarning}>
        <DashboardModal.Content size="xs">
          <DashboardModal.Header subtitle={intl.formatMessage(messages.unsavedChangesDescription)}>
            {intl.formatMessage(messages.unsavedChangesTitle)}
          </DashboardModal.Header>

          <DashboardModal.Actions>
            <BackButton onClick={handleCloseUnsavedWarning} />
            <ConfirmButton
              data-test-id="submit"
              onClick={handleCloseUnsavedWarning}
              transitionState="default"
            >
              {intl.formatMessage(buttonMessages.ok)}
            </ConfirmButton>
          </DashboardModal.Actions>
        </DashboardModal.Content>
      </DashboardModal>
    </>
  );
};
