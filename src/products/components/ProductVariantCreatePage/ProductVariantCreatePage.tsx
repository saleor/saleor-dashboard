import React from "react";
import { useIntl } from "react-intl";

import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import { VariantCreate_productVariantCreate_productErrors } from "@saleor/products/types/VariantCreate";
import { getVariantAttributeInputFromProduct } from "@saleor/products/utils/data";
import { maybe } from "../../../misc";
import { ProductVariantCreateData_product } from "../../types/ProductVariantCreateData";
import ProductVariantAttributes, {
  VariantAttributeInputData
} from "../ProductVariantAttributes";
import ProductVariantNavigation from "../ProductVariantNavigation";
import ProductVariantPrice from "../ProductVariantPrice";
import ProductVariantStock from "../ProductVariantStock";

interface ProductVariantCreatePageFormData {
  costPrice: string;
  images: string[];
  priceOverride: string;
  quantity: string;
  sku: string;
}

export interface ProductVariantCreatePageSubmitData
  extends ProductVariantCreatePageFormData {
  attributes: FormsetData<VariantAttributeInputData>;
}

interface ProductVariantCreatePageProps {
  currencySymbol: string;
  errors: VariantCreate_productVariantCreate_productErrors[];
  header: string;
  loading: boolean;
  product: ProductVariantCreateData_product;
  saveButtonBarState: ConfirmButtonTransitionState;
  onBack: () => void;
  onSubmit: (data: ProductVariantCreatePageSubmitData) => void;
  onVariantClick: (variantId: string) => void;
}

const ProductVariantCreatePage: React.FC<ProductVariantCreatePageProps> = ({
  currencySymbol,
  errors,
  loading,
  header,
  product,
  saveButtonBarState,
  onBack,
  onSubmit,
  onVariantClick
}) => {
  const intl = useIntl();
  const attributeInput = React.useMemo(
    () => getVariantAttributeInputFromProduct(product),
    [product]
  );
  const { change: changeAttributeData, data: attributes } = useFormset(
    attributeInput
  );

  const initialForm = {
    attributes: maybe(
      () =>
        product.productType.variantAttributes.map(attribute => ({
          name: attribute.name,
          slug: attribute.slug,
          values: [""]
        })),
      []
    ),
    costPrice: "",
    images: maybe(() => product.images.map(image => image.id)),
    priceOverride: "",
    quantity: "0",
    sku: ""
  };

  const handleSubmit = (data: ProductVariantCreatePageFormData) =>
    onSubmit({
      ...data,
      attributes
    });

  return (
    <Form initial={initialForm} onSubmit={handleSubmit}>
      {({ change, data, hasChanged, submit, triggerChange }) => {
        const handleAttributeChange: FormsetChange = (id, value) => {
          changeAttributeData(id, value);
          triggerChange();
        };

        return (
          <Container>
            <AppHeader onBack={onBack}>{maybe(() => product.name)}</AppHeader>
            <PageHeader title={header} />
            <Grid variant="inverted">
              <div>
                <ProductVariantNavigation
                  fallbackThumbnail={maybe(() => product.thumbnail.url)}
                  variants={maybe(() => product.variants)}
                  onRowClick={(variantId: string) => {
                    if (product && product.variants) {
                      return onVariantClick(variantId);
                    }
                  }}
                />
              </div>
              <div>
                <ProductVariantAttributes
                  attributes={attributes}
                  disabled={loading}
                  errors={errors}
                  onChange={handleAttributeChange}
                />
                <CardSpacer />
                <ProductVariantPrice
                  errors={errors}
                  priceOverride={data.priceOverride}
                  currencySymbol={currencySymbol}
                  costPrice={data.costPrice}
                  loading={loading}
                  onChange={change}
                />
                <CardSpacer />
                <ProductVariantStock
                  errors={errors}
                  sku={data.sku}
                  quantity={data.quantity}
                  loading={loading}
                  onChange={change}
                />
              </div>
            </Grid>
            <SaveButtonBar
              disabled={loading || !onSubmit || !hasChanged}
              labels={{
                delete: intl.formatMessage({
                  defaultMessage: "Delete Variant",
                  description: "button"
                }),
                save: intl.formatMessage({
                  defaultMessage: "Save variant",
                  description: "button"
                })
              }}
              state={saveButtonBarState}
              onCancel={onBack}
              onSave={submit}
            />
          </Container>
        );
      }}
    </Form>
  );
};
ProductVariantCreatePage.displayName = "ProductVariantCreatePage";
export default ProductVariantCreatePage;
