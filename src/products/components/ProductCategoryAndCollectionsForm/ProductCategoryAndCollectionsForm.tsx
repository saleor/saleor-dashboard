// @ts-strict-ignore
import { TopNav } from "@dashboard/components/AppLayout/TopNav";
import { Multiselect } from "@dashboard/components/Combobox";
import FormSpacer from "@dashboard/components/FormSpacer";
import { ChangeEvent } from "@dashboard/hooks/useForm";
import { Card, CardContent } from "@material-ui/core";
import { Option, Select } from "@saleor/macaw-ui-next";
import React from "react";
import { useIntl } from "react-intl";

interface ProductCategoryAndCollectionsFormProps {
  categories?: Array<{ value: string; label: string }>;
  collections?: Array<{ value: string; label: string }>;
  errors: Record<string, string>;
  productCollections?: Option[];
  category?: string;
  loading?: boolean;
  onChange: (event: ChangeEvent) => void;
}

const ProductCategoryAndCollectionsForm = ({
  categories,
  collections,
  errors,
  productCollections,
  category,
  loading,
  onChange,
}: ProductCategoryAndCollectionsFormProps) => {
  const intl = useIntl();

  return (
    <>
      <Card>
        <TopNav
          title={intl.formatMessage({
            id: "fyE8BN",
            defaultMessage: "Organization",
            description: "product organization, header",
          })}
        />
        <CardContent>
          <Select
            disabled={loading}
            error={!!errors.category}
            helperText={errors.category}
            label={intl.formatMessage({
              id: "ccXLVi",
              defaultMessage: "Category",
            })}
            options={loading ? [] : categories}
            name="category"
            value={category}
            onChange={value => onChange({ target: { name: "category", value } })}
          />
          <FormSpacer />
          <Multiselect
            disabled={loading}
            error={!!errors.collections}
            helperText={errors.collections}
            label={intl.formatMessage({
              id: "ulh3kf",
              defaultMessage: "Collections",
            })}
            fetchOptions={() => undefined}
            options={loading ? [] : collections}
            name="collections"
            value={productCollections}
            onChange={onChange}
          />
        </CardContent>
      </Card>
    </>
  );
};

ProductCategoryAndCollectionsForm.displayName = "ProductCategoryAndCollectionsForm";
export default ProductCategoryAndCollectionsForm;
