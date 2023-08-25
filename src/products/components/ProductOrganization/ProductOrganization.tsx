// @ts-strict-ignore
import { DashboardCard } from "@dashboard/components/Card";
import Link from "@dashboard/components/Link";
import {
  ProductChannelListingErrorFragment,
  ProductErrorCode,
  ProductErrorFragment,
} from "@dashboard/graphql";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { productTypeUrl } from "@dashboard/productTypes/urls";
import { FetchMoreProps } from "@dashboard/types";
import { getFormErrors, getProductErrorMessage } from "@dashboard/utils/errors";
import {
  Box,
  DynamicCombobox,
  DynamicMultiselect,
  Option,
  Text,
} from "@saleor/macaw-ui/next";
import debounce from "lodash/debounce";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";

interface ProductType {
  hasVariants: boolean;
  id: string;
  name: string;
}

interface ProductOrganizationProps {
  canChangeType: boolean;
  categories?: Option[];
  categoryInputDisplayValue: string;
  collections?: Option[];
  collectionsInputDisplayValue: Option[];
  data: {
    category: string;
    collections: string[];
    productType?: ProductType;
  };
  disabled: boolean;
  errors: Array<ProductErrorFragment | ProductChannelListingErrorFragment>;
  productType?: ProductType;
  productTypeInputDisplayValue?: string;
  productTypes?: Option[];
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
    // collectionsInputDisplayValue,
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

  const debouncedFetchProductTypes = debounce((value: string) => {
    fetchProductTypes(value);
  }, 500);

  const debouncedFetchCategories = debounce((value: string) => {
    fetchCategories(value);
  }, 500);

  const debouncedFetchCollections = debounce((value: string) => {
    fetchCollections(value);
  }, 500);

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
          <DynamicCombobox
            data-test-id="product-type"
            disabled={disabled}
            options={productTypes}
            value={
              data.productType?.id
                ? {
                    label: productTypeInputDisplayValue,
                    value: data.productType?.id,
                  }
                : null
            }
            error={!!formErrors.productType}
            helperText={getProductErrorMessage(formErrors.productType, intl)}
            name="productType"
            label={intl.formatMessage({
              id: "anK7jD",
              defaultMessage: "Product Type",
            })}
            onChange={value =>
              onProductTypeChange({
                target: { value: value?.value ?? null, name: "productType" },
              })
            }
            onInputValueChange={debouncedFetchProductTypes}
            onFocus={() => {
              fetchProductTypes("");
            }}
            loading={fetchMoreProductTypes.loading}
            locale={{
              loadingText: "Loading...",
            }}
          />
        ) : (
          <Box display="flex" flexDirection="column" gap={3}>
            <Box display="flex" flexDirection="column">
              <Text variant="bodyEmp">
                <FormattedMessage id="anK7jD" defaultMessage="Product Type" />
              </Text>
              <Text variant="caption">
                <Link
                  href={productTypeUrl(productType?.id) ?? ""}
                  disabled={!productType?.id}
                >
                  {productType?.name ?? "..."}
                </Link>
              </Text>
            </Box>
          </Box>
        )}
        <DynamicCombobox
          data-test-id="category"
          disabled={disabled}
          options={disabled ? [] : categories}
          value={
            data.category
              ? {
                  label: categoryInputDisplayValue,
                  value: data.category,
                }
              : null
          }
          error={!!(formErrors.category || noCategoryError)}
          helperText={getProductErrorMessage(
            formErrors.category || noCategoryError,
            intl,
          )}
          name="category"
          label={intl.formatMessage({
            id: "ccXLVi",
            defaultMessage: "Category",
          })}
          onChange={value =>
            onCategoryChange({
              target: { value: value?.value ?? null, name: "category" },
            })
          }
          onInputValueChange={debouncedFetchCategories}
          onFocus={() => {
            fetchCategories("");
          }}
          loading={fetchMoreCategories.loading}
          locale={{
            loadingText: "Loading...",
          }}
        />
        <DynamicMultiselect
          data-test-id="collections"
          disabled={disabled}
          options={disabled ? [] : collections}
          value={data.collections.map(collection => ({
            label: "test",
            value: collection,
          }))}
          error={!!formErrors.collections}
          helperText={
            getProductErrorMessage(formErrors.collections, intl) ||
            intl.formatMessage({
              id: "v+Pkm+",
              defaultMessage:
                "*Optional. Adding product to collection helps users find it.",
              description: "field is optional",
            })
          }
          name="collections"
          label={intl.formatMessage({
            id: "ccXLVi",
            defaultMessage: "Category",
          })}
          onChange={value => {
            onCollectionChange({
              target: {
                value: value?.map(({ value }) => value) ?? null,
                name: "collections",
              },
            });
          }}
          onInputValueChange={debouncedFetchCollections}
          onFocus={() => {
            fetchCollections("");
          }}
          loading={fetchMoreCollections.loading}
          locale={{
            loadingText: "Loading...",
          }}
        />
      </DashboardCard.Content>
    </DashboardCard>
  );
};
