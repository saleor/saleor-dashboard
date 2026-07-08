import {
  AttributeEntityTypeEnum,
  AttributeInputTypeEnum,
  type CategoryFilterInput,
  type PageWhereInput,
  type ProductWhereInput,
  type SearchCategoriesQuery,
  type SearchCollectionsQuery,
  type SearchPagesQuery,
} from "@dashboard/graphql";
import { type RelayToFlat } from "@dashboard/types";
import { useMemo } from "react";
import { useIntl } from "react-intl";

import AssignCategoryDialog from "../AssignCategoryDialog";
import AssignCollectionDialog, {
  type AssignCollectionFilterChangeHandler,
} from "../AssignCollectionDialog";
import AssignModelDialog from "../AssignModelDialog";
import AssignProductDialog, { type AssignProductDialogProps } from "../AssignProductDialog";
import AssignVariantDialog from "../AssignVariantDialog";
import { type AttributeInput } from "../Attributes";
import { type InitialPageConstraints } from "../ModalFilters/entityConfigs/ModalPageFilterProvider";
import { type InitialConstraints } from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
import {
  filterProductsByReferenceTypeConstraints,
  getReferencePickerLoadingState,
} from "./mergeReferenceTypeWhereConstraints";
import { messages } from "./messages";
import {
  filterCategoriesByAttributeValues,
  filterCollectionsByAttributeValues,
  filterPagesByAttributeValues,
  filterProductsByAttributeValues,
} from "./utils";

export type ProductFilterChangeHandler = (
  filterVariables: ProductWhereInput,
  channel: string | undefined,
  query: string,
) => void;

export type PageFilterChangeHandler = (filterVariables: PageWhereInput, query: string) => void;

export type CategoryFilterChangeHandler = (
  filterVariables: CategoryFilterInput,
  query: string,
) => void;

export type AssignAttributeValueDialogFilterChangeMap = {
  [AttributeEntityTypeEnum.PRODUCT]: ProductFilterChangeHandler;
  [AttributeEntityTypeEnum.PRODUCT_VARIANT]: ProductFilterChangeHandler;
  [AttributeEntityTypeEnum.PAGE]: PageFilterChangeHandler;
  [AttributeEntityTypeEnum.CATEGORY]: CategoryFilterChangeHandler;
  [AttributeEntityTypeEnum.COLLECTION]: AssignCollectionFilterChangeHandler;
};

type AssignAttributeValueDialogProps = Omit<AssignProductDialogProps, "onFilterChange"> & {
  entityType: AttributeEntityTypeEnum;
  attribute: AttributeInput;
  pages: RelayToFlat<SearchPagesQuery["search"]>;
  collections: RelayToFlat<SearchCollectionsQuery["search"]>;
  categories: RelayToFlat<SearchCategoriesQuery["search"]>;
  initialConstraints?: InitialConstraints & InitialPageConstraints;
  // onFetch is required for non-product dialogs (containers, variants, collections, categories)
  onFetch: (value: string) => void;
  // Generic filter callback map by entity type.
  onFilterChange?: AssignAttributeValueDialogFilterChangeMap;
};

const getSingleOrMultipleDialogProps = (attribute: AttributeInput) => {
  const isSingle = attribute.data.inputType === AttributeInputTypeEnum.SINGLE_REFERENCE;

  if (!isSingle) {
    return { selectionMode: "multiple" as const };
  }

  const selectedId = attribute.value?.length > 0 ? attribute.value[0] : undefined;

  return { selectedId, selectionMode: "single" as const };
};

const AssignAttributeValueDialog = (props: AssignAttributeValueDialogProps) => {
  const intl = useIntl();
  const {
    entityType,
    pages,
    products,
    collections,
    categories,
    attribute,
    initialConstraints,
    onFilterChange,
    labels,
    loading,
    ...rest
  } = props;
  const filteredProducts = filterProductsByAttributeValues(products, attribute);
  const constrainedProducts = useMemo(
    () => filterProductsByReferenceTypeConstraints(filteredProducts, initialConstraints),
    [filteredProducts, initialConstraints],
  );
  const referencePickerLoading = getReferencePickerLoadingState(
    loading,
    initialConstraints,
    filteredProducts,
  );
  const filteredPages = filterPagesByAttributeValues(pages, attribute);
  const filteredCollections = filterCollectionsByAttributeValues(collections, attribute);
  const filteredCategories = filterCategoriesByAttributeValues(categories, attribute);
  const productFilterChange = onFilterChange?.[AttributeEntityTypeEnum.PRODUCT];
  const variantFilterChange =
    onFilterChange?.[AttributeEntityTypeEnum.PRODUCT_VARIANT] ??
    onFilterChange?.[AttributeEntityTypeEnum.PRODUCT];
  const pageFilterChange = onFilterChange?.[AttributeEntityTypeEnum.PAGE];
  const categoryFilterChange = onFilterChange?.[AttributeEntityTypeEnum.CATEGORY];
  const collectionFilterChange = onFilterChange?.[AttributeEntityTypeEnum.COLLECTION];
  const dialogLabels = useMemo(
    () => ({
      ...labels,
      confirmBtn: intl.formatMessage(messages.assignReferencesButton),
    }),
    [intl, labels],
  );

  switch (entityType) {
    case AttributeEntityTypeEnum.PAGE:
      return (
        <AssignModelDialog
          pages={filteredPages ?? []}
          initialConstraints={initialConstraints}
          onFilterChange={pageFilterChange}
          labels={dialogLabels}
          loading={loading}
          {...getSingleOrMultipleDialogProps(attribute)}
          {...rest}
        />
      );
    case AttributeEntityTypeEnum.PRODUCT:
      return (
        <AssignProductDialog
          products={constrainedProducts ?? []}
          initialConstraints={initialConstraints}
          onFilterChange={productFilterChange}
          labels={dialogLabels}
          loading={referencePickerLoading}
          {...getSingleOrMultipleDialogProps(attribute)}
          {...rest}
        />
      );
    case AttributeEntityTypeEnum.PRODUCT_VARIANT:
      return (
        <AssignVariantDialog
          products={constrainedProducts}
          initialConstraints={initialConstraints}
          onFilterChange={variantFilterChange}
          labels={dialogLabels}
          loading={referencePickerLoading}
          {...getSingleOrMultipleDialogProps(attribute)}
          {...rest}
        />
      );
    case AttributeEntityTypeEnum.COLLECTION:
      return (
        <AssignCollectionDialog
          collections={filteredCollections}
          onFilterChange={collectionFilterChange}
          labels={dialogLabels}
          loading={loading}
          {...getSingleOrMultipleDialogProps(attribute)}
          {...rest}
        />
      );
    case AttributeEntityTypeEnum.CATEGORY:
      return (
        <AssignCategoryDialog
          categories={filteredCategories}
          onFilterChange={categoryFilterChange}
          labels={dialogLabels}
          loading={loading}
          {...getSingleOrMultipleDialogProps(attribute)}
          {...rest}
        />
      );
  }
};

AssignAttributeValueDialog.displayName = "AssignAttributeValueDialog";
export default AssignAttributeValueDialog;
