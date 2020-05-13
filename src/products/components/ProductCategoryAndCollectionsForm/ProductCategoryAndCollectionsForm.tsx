import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import FormSpacer from "@saleor/components/FormSpacer";
import MultiSelectField from "@saleor/components/MultiSelectField";
import PageHeader from "@saleor/components/PageHeader";
import SingleSelectField from "@saleor/components/SingleSelectField";
import React from "react";
import { useIntl } from "react-intl";

interface ProductCategoryAndCollectionsFormProps {
  categories?: Array<{ value: string; label: string }>;
  collections?: Array<{ value: string; label: string }>;
  errors: { [key: string]: string };
  productCollections?: string[];
  category?: string;
  loading?: boolean;
  onChange: (event: React.ChangeEvent<any>) => void;
}

const ProductCategoryAndCollectionsForm = ({
  categories,
  collections,
  errors,
  productCollections,
  category,
  loading,
  onChange
}: ProductCategoryAndCollectionsFormProps) => {
  const intl = useIntl();

  return (
    <Card>
      <PageHeader
        title={intl.formatMessage({
          defaultMessage: "Organization",
          description: "product organization, header"
        })}
      />
      <CardContent>
        <SingleSelectField
          disabled={loading}
          error={!!errors.category}
          hint={errors.category}
          label={intl.formatMessage({
            defaultMessage: "Category"
          })}
          choices={loading ? [] : categories}
          name="category"
          value={category}
          onChange={onChange}
        />
        <FormSpacer />
        <MultiSelectField
          disabled={loading}
          error={!!errors.collections}
          hint={errors.collections}
          label={intl.formatMessage({
            defaultMessage: "Collections"
          })}
          choices={loading ? [] : collections}
          name="collections"
          value={productCollections}
          onChange={onChange}
        />
      </CardContent>
    </Card>
  );
};
ProductCategoryAndCollectionsForm.displayName =
  "ProductCategoryAndCollectionsForm";
export default ProductCategoryAndCollectionsForm;
