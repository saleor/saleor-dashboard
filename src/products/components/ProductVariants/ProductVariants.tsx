import { ChannelData } from "@dashboard/channels/utils";
import ActionDialog from "@dashboard/components/ActionDialog";
import { ColumnPicker } from "@dashboard/components/Datagrid/ColumnPicker/ColumnPicker";
import { useColumns } from "@dashboard/components/Datagrid/ColumnPicker/useColumns";
import Datagrid, { GetCellContentOpts } from "@dashboard/components/Datagrid/Datagrid";
import {
  DatagridChangeOpts,
  DatagridChangeStateContext,
} from "@dashboard/components/Datagrid/hooks/useDatagridChange";
import { iconSize, iconStrokeWidthBySize } from "@dashboard/components/icons";
import {
  AttributeInputTypeEnum,
  ProductDetailsVariantFragment,
  ProductFragment,
  ProductVariantBulkCreateInput,
  RefreshLimitsQuery,
  useWarehouseListQuery,
  VariantAttributeFragment,
} from "@dashboard/graphql";
import useStateFromProps from "@dashboard/hooks/useStateFromProps";
import { buttonMessages } from "@dashboard/intl";
import { ProductVariantListError } from "@dashboard/products/views/ProductUpdate/handlers/errors";
import { mapEdgesToItems } from "@dashboard/utils/maps";
import { Item } from "@glideapps/glide-data-grid";
import { Button } from "@saleor/macaw-ui";
import { Option, Text } from "@saleor/macaw-ui-next";
import { Pencil } from "lucide-react";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";

import { ProductVariantGenerator } from "../ProductVariantGenerator/ProductVariantGenerator";
import {
  BulkCreateResult,
  getUnsupportedRequiredAttributes,
} from "../ProductVariantGenerator/types";
import { ProductVariantsHeader } from "./components/ProductVariantsHeader";
import {
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
  productName: string;
  productId: string;
  productTypeId: string;
  /** Whether the product type supports multiple variants with attributes */
  hasVariants: boolean;
  onAttributeValuesSearch: (id: string, query: string) => Promise<Option[]>;
  onChange: (data: DatagridChangeOpts) => void;
  onRowClick: (id: string) => void;
  onBulkCreate?: (inputs: ProductVariantBulkCreateInput[]) => Promise<BulkCreateResult>;
}

export const ProductVariants = ({
  channels,
  errors,
  variants,
  variantAttributes,
  selectionVariantAttributes,
  nonSelectionVariantAttributes,
  productName,
  productId,
  productTypeId,
  hasVariants,
  onAttributeValuesSearch,
  onChange,
  onRowClick,
  onBulkCreate,
}: ProductVariantsProps) => {
  const intl = useIntl();
  const [generatorOpen, setGeneratorOpen] = useState(false);
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  // Access datagrid state to check for unsaved changes
  const datagridState = useContext(DatagridChangeStateContext);
  const hasUnsavedChanges =
    datagridState && (datagridState.removed.length > 0 || datagridState.added.length > 0);

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

  // Transform variants for the generator (only SELECTION attributes matter for uniqueness)
  // Non-selection attributes don't determine variant uniqueness in Saleor
  const selectionAttributeIds = useMemo(
    () => new Set((selectionVariantAttributes ?? []).map(attr => attr.id)),
    [selectionVariantAttributes],
  );

  const existingVariantsForGenerator = useMemo(
    () =>
      (variants ?? []).map(variant => ({
        attributes: variant.attributes
          .filter(attr => selectionAttributeIds.has(attr.attribute.id))
          .map(attr => ({
            attribute: { id: attr.attribute.id },
            values: attr.values.map(v => ({ slug: v.slug })),
          })),
      })),
    [variants, selectionAttributeIds],
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
              ?.filter(
                attribute =>
                  attribute.inputType === AttributeInputTypeEnum.DROPDOWN ||
                  attribute.inputType === AttributeInputTypeEnum.PLAIN_TEXT,
              )
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
        searchAttributeValues: onAttributeValuesSearch,
        ...opts,
      }),
    [channels, visibleColumns, onAttributeValuesSearch, variants],
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

  return (
    <>
      <Datagrid
        fillHandle={true}
        renderHeader={props => (
          <ProductVariantsHeader
            {...props}
            productId={productId}
            productTypeId={productTypeId}
            productName={productName}
            hasVariants={hasVariants}
            hasVariantAttributes={hasSelectionVariantAttributes}
            unsupportedRequiredAttributes={unsupportedRequiredAttributes}
            onGenerateVariants={handleOpenGenerator}
          />
        )}
        availableColumns={visibleColumns}
        emptyText={intl.formatMessage(messages.empty)}
        getCellContent={getCellContent}
        getCellError={getCellError}
        menuItems={index => [
          {
            label: "Edit Variant",
            onSelect: () => onRowClick(variants[index].id),
            Icon: <Pencil size={iconSize.small} strokeWidth={iconStrokeWidthBySize.small} />,
          },
        ]}
        rows={variants?.length ?? 0}
        selectionActions={(indexes, { removeRows }) => (
          <Button
            data-test-id="bulk-delete-button"
            variant="tertiary"
            onClick={() => removeRows(indexes)}
          >
            <FormattedMessage {...buttonMessages.delete} />
          </Button>
        )}
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
      />
      {hasVariants && hasSelectionVariantAttributes && onBulkCreate && (
        <ProductVariantGenerator
          open={generatorOpen}
          onClose={handleCloseGenerator}
          productName={productName}
          variantAttributes={selectionVariantAttributes as VariantAttributeFragment[]}
          nonSelectionVariantAttributes={
            nonSelectionVariantAttributes as VariantAttributeFragment[]
          }
          existingVariants={existingVariantsForGenerator}
          onAttributeValuesSearch={onAttributeValuesSearch}
          onSubmit={handleGenerateVariants}
        />
      )}

      {/* Warning dialog when trying to open generator with unsaved changes */}
      <ActionDialog
        open={showUnsavedWarning}
        onClose={handleCloseUnsavedWarning}
        onConfirm={handleCloseUnsavedWarning}
        title={intl.formatMessage(messages.unsavedChangesTitle)}
        confirmButtonLabel={intl.formatMessage(buttonMessages.ok)}
        confirmButtonState="default"
        variant="default"
      >
        <Text>{intl.formatMessage(messages.unsavedChangesDescription)}</Text>
      </ActionDialog>
    </>
  );
};
