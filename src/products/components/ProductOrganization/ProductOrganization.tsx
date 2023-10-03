// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import Link from "@dashboard/components/Link";
import MultiAutocompleteSelectField, {
  MultiAutocompleteChoiceType,
} from "@dashboard/components/MultiAutocompleteSelectField";
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType,
} from "@dashboard/components/SingleAutocompleteSelectField";
import {
  ProductChannelListingErrorFragment,
  ProductErrorCode,
  ProductErrorFragment,
} from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { productTypeUrl } from "@dashboard/productTypes/urls";
import { FetchMoreProps } from "@dashboard/types";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import { Box, Text } from "@saleor/macaw-ui/next";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface ProductType {
  hasVariants: boolean;
  id: string;
  name: string;
}

interface ProductOrganizationProps {
  canChangeType: boolean;
  categories?: SingleAutocompleteChoiceType[];
  categoryInputDisplayValue: string;
  collections?: MultiAutocompleteChoiceType[];
  collectionsInputDisplayValue: MultiAutocompleteChoiceType[];
  data: {
    category: string;
    collections: string[];
    productType?: ProductType;
  };
  disabled: boolean;
  errors: Array<ProductErrorFragment | ProductChannelListingErrorFragment>;
  productType?: ProductType;
  productTypeInputDisplayValue?: string;
  productTypes?: SingleAutocompleteChoiceType[];
  fetchCategories: (query: string) => void;
  fetchCollections: (query: string) => void;
  fetchMoreCategories: FetchMoreProps;
  fetchMoreCollections: FetchMoreProps;
  fetchMoreProductTypes?: FetchMoreProps;
  fetchProductTypes?: (data: string) => void;
  onCategoryChange: (event: ChangeEvent) => void;
  onCollectionChange: (event: ChangeEvent) => void;
  onProductTypeChange?: (event: ChangeEvent) => void;
}

export const ProductOrganization: React.FC<
  ProductOrganizationProps
> = props => {
  const {
    canChangeType,
    categories,
    categoryInputDisplayValue,
    collections,
    collectionsInputDisplayValue,
    data,
    disabled,
    errors,
    fetchCategories,
    fetchCollections,
    fetchMoreCategories,
    fetchMoreCollections,
    fetchMoreProductTypes,
    fetchProductTypes,
    productType,
    productTypeInputDisplayValue,
    productTypes,
    onCategoryChange,
    onCollectionChange,
    onProductTypeChange,
  } = props;

  const intl = useIntl();

  const formErrors = getFormErrors(
    ["productType", "category", "collections", "isPublished"],
    errors,
  );
  const noCategoryError =
    formErrors.isPublished?.code === ProductErrorCode.PRODUCT_WITHOUT_CATEGORY
      ? formErrors.isPublished
      : null;

  return (
    <DashboardCard>
      <DashboardCard.Title>
        {intl.formatMessage({
          id: "JjeZEG",
          defaultMessage: "Organize Product",
          description: "section header",
        })}
      </DashboardCard.Title>
      <DashboardCard.Content gap={5} display="flex" flexDirection="column">
        {canChangeType ? (
          <SingleAutocompleteSelectField
            displayValue={productTypeInputDisplayValue}
            error={!!formErrors.productType}
            helperText={getProductErrorMessage(formErrors.productType, intl)}
            name="productType"
            disabled={disabled}
            label={intl.formatMessage({
              id: "anK7jD",
              defaultMessage: "Product Type",
            })}
            choices={productTypes}
            value={data.productType?.id}
            onChange={onProductTypeChange}
            fetchChoices={fetchProductTypes}
            data-test-id="product-type"
            {...fetchMoreProductTypes}
          />
        ) : (
          <Box display="flex" flexDirection="column" gap={3}>
            <Box display="flex" flexDirection="column">
              <Text variant="bodyEmp">
                <FormattedMessage id="anK7jD" defaultMessage="Product Type" />
              </Text>
              {productType?.id ? (
                <Text variant="caption">
                  <Link href={productTypeUrl(productType?.id) ?? ""}>
                    {productType?.name ?? "..."}
                  </Link>
                </Text>
              ) : (
                <Text variant="caption">{productType?.name ?? "..."}</Text>
              )}
            </Box>
          </Box>
        )}
        <SingleAutocompleteSelectField
          displayValue={categoryInputDisplayValue}
          error={!!(formErrors.category || noCategoryError)}
          helperText={getProductErrorMessage(
            formErrors.category || noCategoryError,
            intl,
          )}
          disabled={disabled}
          label={intl.formatMessage({
            id: "ccXLVi",
            defaultMessage: "Category",
          })}
          choices={disabled ? [] : categories}
          name="category"
          value={data.category}
          onChange={onCategoryChange}
          fetchChoices={fetchCategories}
          data-test-id="category"
          {...fetchMoreCategories}
        />
        <MultiAutocompleteSelectField
          displayValues={collectionsInputDisplayValue}
          error={!!formErrors.collections}
          label={intl.formatMessage({
            id: "ulh3kf",
            defaultMessage: "Collections",
          })}
          choices={disabled ? [] : collections}
          name="collections"
          value={data.collections}
          helperText={
            getProductErrorMessage(formErrors.collections, intl) ||
            intl.formatMessage({
              id: "v+Pkm+",
              defaultMessage:
                "*Optional. Adding product to collection helps users find it.",
              description: "field is optional",
            })
          }
          onChange={onCollectionChange}
          fetchChoices={fetchCollections}
          data-test-id="collections"
          testId="collection"
          {...fetchMoreCollections}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
