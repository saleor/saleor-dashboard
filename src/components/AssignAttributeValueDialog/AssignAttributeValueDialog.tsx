import {
  AttributeEntityTypeEnum,
  AttributeInputTypeEnum,
  SearchCategoriesQuery,
  SearchCollectionsQuery,
  SearchPagesQuery,
} from "@dashboard/graphql";
import { RelayToFlat } from "@dashboard/types";
import { defineMessages, useIntl } from "react-intl";

import AssignCategoryDialog from "../AssignCategoryDialog";
import AssignCollectionDialog from "../AssignCollectionDialog";
import AssignContainerDialog from "../AssignContainerDialog";
import AssignProductDialog, { AssignProductDialogProps } from "../AssignProductDialog";
import { InitialConstraints } from "../AssignProductDialog/ModalProductFilterProvider";
import AssignVariantDialog from "../AssignVariantDialog";
import { AttributeInput } from "../Attributes";
import {
  filterCategoriesByAttributeValues,
  filterCollectionsByAttributeValues,
  filterPagesByAttributeValues,
  filterProductsByAttributeValues,
} from "./utils";

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

type AssignAttributeValueDialogProps = AssignProductDialogProps & {
  entityType: AttributeEntityTypeEnum;
  attribute: AttributeInput;
  pages: RelayToFlat<SearchPagesQuery["search"]>;
  collections: RelayToFlat<SearchCollectionsQuery["search"]>;
  categories: RelayToFlat<SearchCategoriesQuery["search"]>;
  initialConstraints?: InitialConstraints;
  // onFetch is required for non-product dialogs (containers, variants, collections, categories)
  onFetch: (value: string) => void;
};

const getSingleOrMultipleDialogProps = (attribute: AttributeInput) => {
  const isSingle = attribute.data.inputType === AttributeInputTypeEnum.SINGLE_REFERENCE;

  if (!isSingle) {
    return { selectionMode: "multiple" as const };
  }

  const selectedId = attribute.value?.length > 0 ? attribute.value[0] : undefined;

  return { selectedId, selectionMode: "single" as const };
};

const AssignAttributeValueDialog = ({
  entityType,
  pages,
  products,
  collections,
  categories,
  attribute,
  labels,
  initialConstraints,
  ...rest
}: AssignAttributeValueDialogProps) => {
  const intl = useIntl();
  const filteredProducts = filterProductsByAttributeValues(products, attribute);
  const filteredPages = filterPagesByAttributeValues(pages, attribute);
  const filteredCollections = filterCollectionsByAttributeValues(collections, attribute);
  const filteredCategories = filterCategoriesByAttributeValues(categories, attribute);

  switch (entityType) {
    case AttributeEntityTypeEnum.PAGE:
      return (
        <AssignContainerDialog
          containers={
            filteredPages?.map(page => ({
              id: page.id,
              name: page.title,
            })) ?? []
          }
          emptyMessage={intl.formatMessage(pagesMessages.noPagesFound)}
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
          {...getSingleOrMultipleDialogProps(attribute)}
          {...rest}
        />
      );
    case AttributeEntityTypeEnum.PRODUCT_VARIANT:
      return (
        <AssignVariantDialog
          products={filteredProducts}
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
