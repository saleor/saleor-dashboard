import {
  AttributeEntityTypeEnum,
  AttributeInputTypeEnum,
  PageWhereInput,
  ProductWhereInput,
  SearchCategoriesQuery,
  SearchCollectionsQuery,
  SearchPagesQuery,
} from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { defineMessages, useIntl } from "react-intl";

import AssignCategoryDialog from "../AssignCategoryDialog";
import AssignCollectionDialog from "../AssignCollectionDialog";
import AssignModelDialog from "../AssignModelDialog";
import AssignProductDialog, { AssignProductDialogProps } from "../AssignProductDialog";
import AssignVariantDialog from "../AssignVariantDialog";
import { AttributeInput } from "../Attributes";
import { InitialConstraints } from "../ModalFilters/entityConfigs/ModalProductFilterProvider";
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

export type AssignAttributeValueDialogFilterChangeMap = {
  [AttributeEntityTypeEnum.PRODUCT]?: ProductFilterChangeHandler;
  [AttributeEntityTypeEnum.PRODUCT_VARIANT]?: ProductFilterChangeHandler;
  [AttributeEntityTypeEnum.PAGE]?: PageFilterChangeHandler;
};

const pagesMessages = defineMessages({
  confirmBtn: {
    id: "ch96Wv",
    defaultMessage: "Assign and save",
    description: "assign reference to a model, button",
  },
  header: {
    id: "Z+m5hG",
    defaultMessage: "Assign model",
    description: "dialog header",
  },
  searchLabel: {
    id: "kTt3D2",
    defaultMessage: "Search models",
    description: "label",
  },
  searchPlaceholder: {
    id: "Z768vg",
    defaultMessage: "Search by model name, etc...",
    description: "placeholder",
  },
  noPagesFound: {
    id: "BOYzu+",
    defaultMessage: "No models found",
    description: "search results",
  },
});

type AssignAttributeValueDialogProps = Omit<AssignProductDialogProps, "onFilterChange"> & {
  entityType: AttributeEntityTypeEnum;
  attribute: AttributeInput;
  pages: RelayToFlat<SearchPagesQuery["search"]>;
  collections: RelayToFlat<SearchCollectionsQuery["search"]>;
  categories: RelayToFlat<SearchCategoriesQuery["search"]>;
  initialConstraints?: InitialConstraints;
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
  const {
    entityType,
    pages,
    products,
    collections,
    categories,
    attribute,
    labels,
    initialConstraints,
    onFilterChange,
    ...rest
  } = props;
  const intl = useIntl();
  const filteredProducts = filterProductsByAttributeValues(products, attribute);
  const filteredPages = filterPagesByAttributeValues(pages, attribute);
  const filteredCollections = filterCollectionsByAttributeValues(collections, attribute);
  const filteredCategories = filterCategoriesByAttributeValues(categories, attribute);
  const productFilterChange = onFilterChange?.[AttributeEntityTypeEnum.PRODUCT];
  const variantFilterChange =
    onFilterChange?.[AttributeEntityTypeEnum.PRODUCT_VARIANT] ??
    onFilterChange?.[AttributeEntityTypeEnum.PRODUCT];
  const pageFilterChange = onFilterChange?.[AttributeEntityTypeEnum.PAGE];

  switch (entityType) {
    case AttributeEntityTypeEnum.PAGE:
      return (
        <AssignModelDialog
          pages={filteredPages ?? []}
          onFilterChange={pageFilterChange}
          labels={{
            confirmBtn: intl.formatMessage(pagesMessages.confirmBtn),
            label: intl.formatMessage(pagesMessages.searchLabel),
            placeholder: intl.formatMessage(pagesMessages.searchPlaceholder),
            title: intl.formatMessage(pagesMessages.header),
            ...labels,
          }}
          {...getSingleOrMultipleDialogProps(attribute)}
          {...rest}
        />
      );
    case AttributeEntityTypeEnum.PRODUCT:
      return (
        <AssignProductDialog
          products={filteredProducts ?? []}
          initialConstraints={initialConstraints}
          onFilterChange={productFilterChange}
          {...getSingleOrMultipleDialogProps(attribute)}
          {...rest}
        />
      );
    case AttributeEntityTypeEnum.PRODUCT_VARIANT:
      return (
        <AssignVariantDialog
          products={filteredProducts}
          initialConstraints={initialConstraints}
          onFilterChange={variantFilterChange}
          {...getSingleOrMultipleDialogProps(attribute)}
          {...rest}
        />
      );
    case AttributeEntityTypeEnum.COLLECTION:
      return (
        <AssignCollectionDialog
          collections={filteredCollections}
          {...getSingleOrMultipleDialogProps(attribute)}
          {...rest}
        />
      );
    case AttributeEntityTypeEnum.CATEGORY:
      return (
        <AssignCategoryDialog
          categories={filteredCategories}
          {...getSingleOrMultipleDialogProps(attribute)}
          {...rest}
        />
      );
  }
};

AssignAttributeValueDialog.displayName = "AssignAttributeValueDialog";
export default AssignAttributeValueDialog;
