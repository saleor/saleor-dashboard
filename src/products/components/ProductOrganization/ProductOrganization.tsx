import CardSpacer from '@dashboard/components/CardSpacer';
import CardTitle from '@dashboard/components/CardTitle';
import { FormSpacer } from '@dashboard/components/FormSpacer';
import Hr from '@dashboard/components/Hr';
import Link from '@dashboard/components/Link';
import MultiAutocompleteSelectField, {
  MultiAutocompleteChoiceType,
} from '@dashboard/components/MultiAutocompleteSelectField';
import SingleAutocompleteSelectField, {
  SingleAutocompleteChoiceType,
} from '@dashboard/components/SingleAutocompleteSelectField';
import { ProductChannelListingErrorFragment, ProductErrorCode, ProductErrorFragment } from '@dashboard/graphql';
import { ChangeEvent } from '@dashboard/hooks/useForm';
import { commonMessages } from '@dashboard/intl';
import { maybe } from '@dashboard/misc';
import { productTypeUrl } from '@dashboard/productTypes/urls';
import { FetchMoreProps } from '@dashboard/types';
import { getFormErrors, getProductErrorMessage } from '@dashboard/utils/errors';
import { Card, CardContent, Typography } from '@material-ui/core';
import { makeStyles } from '@saleor/macaw-ui';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

interface ProductType {
  hasVariants: boolean;
  id: string;
  name: string;
}

const useStyles = makeStyles(
  theme => ({
    card: {
      overflow: 'visible',
    },
    cardSubtitle: {
      fontSize: theme.typography.body1.fontSize,
      marginBottom: theme.spacing(0.5),
    },
    label: {
      marginBottom: theme.spacing(0.5),
    },
  }),
  { name: 'ProductOrganization' },
);

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

const ProductOrganization: React.FC<ProductOrganizationProps> = props => {
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

  const classes = useStyles(props);
  const intl = useIntl();

  const formErrors = getFormErrors(['productType', 'category', 'collections', 'isPublished'], errors);
  const noCategoryError =
    formErrors.isPublished?.code === ProductErrorCode.PRODUCT_WITHOUT_CATEGORY ? formErrors.isPublished : null;

  return (
    <Card className={classes.card}>
      <CardTitle
        title={intl.formatMessage({
          id: 'JjeZEG',
          defaultMessage: 'Organize Product',
          description: 'section header',
        })}
      />
      <CardContent>
        {canChangeType ? (
          <SingleAutocompleteSelectField
            displayValue={productTypeInputDisplayValue}
            error={!!formErrors.productType}
            helperText={getProductErrorMessage(formErrors.productType, intl)}
            name="productType"
            disabled={disabled}
            label={intl.formatMessage({
              id: 'anK7jD',
              defaultMessage: 'Product Type',
            })}
            choices={productTypes}
            value={data.productType?.id}
            onChange={onProductTypeChange}
            fetchChoices={fetchProductTypes}
            data-test-id="product-type"
            {...fetchMoreProductTypes}
          />
        ) : (
          <>
            <Typography className={classes.label} variant="caption">
              <FormattedMessage id="anK7jD" defaultMessage="Product Type" />
            </Typography>
            <Typography>
              <Link href={productTypeUrl(productType?.id) ?? ''} disabled={!productType?.id}>
                {productType?.name ?? '...'}
              </Link>
            </Typography>
            <CardSpacer />
            <Typography className={classes.label} variant="caption">
              <FormattedMessage id="Be+J13" defaultMessage="Configurable" />
            </Typography>
            <Typography>
              {maybe(
                () =>
                  productType.hasVariants
                    ? intl.formatMessage(commonMessages.yes)
                    : intl.formatMessage(commonMessages.no),
                '...',
              )}
            </Typography>
          </>
        )}
        <FormSpacer />
        <Hr />
        <FormSpacer />
        <SingleAutocompleteSelectField
          displayValue={categoryInputDisplayValue}
          error={!!(formErrors.category || noCategoryError)}
          helperText={getProductErrorMessage(formErrors.category || noCategoryError, intl)}
          disabled={disabled}
          label={intl.formatMessage({
            id: 'ccXLVi',
            defaultMessage: 'Category',
          })}
          choices={disabled ? [] : categories}
          name="category"
          value={data.category}
          onChange={onCategoryChange}
          fetchChoices={fetchCategories}
          data-test-id="category"
          {...fetchMoreCategories}
        />
        <FormSpacer />
        <Hr />
        <FormSpacer />
        <MultiAutocompleteSelectField
          displayValues={collectionsInputDisplayValue}
          error={!!formErrors.collections}
          label={intl.formatMessage({
            id: 'ulh3kf',
            defaultMessage: 'Collections',
          })}
          choices={disabled ? [] : collections}
          name="collections"
          value={data.collections}
          helperText={
            getProductErrorMessage(formErrors.collections, intl) ||
            intl.formatMessage({
              id: 'v+Pkm+',
              defaultMessage: '*Optional. Adding product to collection helps users find it.',
              description: 'field is optional',
            })
          }
          onChange={onCollectionChange}
          fetchChoices={fetchCollections}
          data-test-id="collections"
          testId="collection"
          {...fetchMoreCollections}
        />
      </CardContent>
    </Card>
  );
};
ProductOrganization.displayName = 'ProductOrganization';
export default ProductOrganization;
