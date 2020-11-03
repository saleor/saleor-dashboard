import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import { ReorderAction } from "@saleor/types";
import React from "react";
import { useIntl } from "react-intl";

import { ProductVariantCreateData_product } from "../../types/ProductVariantCreateData";
import ProductShipping from "../ProductShipping/ProductShipping";
import ProductStocks from "../ProductStocks";
import ProductVariantAttributes from "../ProductVariantAttributes";
import ProductVariantNavigation from "../ProductVariantNavigation";
import ProductVariantPrice from "../ProductVariantPrice";
import ProductVariantCreateForm, { ProductVariantCreateData } from "./form";

interface ProductVariantCreatePageProps {
  currencySymbol: string;
  disabled: boolean;
  errors: ProductErrorWithAttributesFragment[];
  header: string;
  product: ProductVariantCreateData_product;
  saveButtonBarState: ConfirmButtonTransitionState;
  warehouses: SearchWarehouses_search_edges_node[];
  weightUnit: string;
  onBack: () => void;
  onSubmit: (data: ProductVariantCreateData) => void;
  onVariantClick: (variantId: string) => void;
  onVariantReorder: ReorderAction;
  onWarehouseConfigure: () => void;
}

const ProductVariantCreatePage: React.FC<ProductVariantCreatePageProps> = ({
  currencySymbol,
  disabled,
  errors,
  header,
  product,
  saveButtonBarState,
  warehouses,
  weightUnit,
  onBack,
  onSubmit,
  onVariantClick,
  onVariantReorder,
  onWarehouseConfigure
}) => {
  const intl = useIntl();

  return (
    <ProductVariantCreateForm
      product={product}
      onSubmit={onSubmit}
      warehouses={warehouses}
    >
      {({ change, data, handlers, hasChanged, submit }) => (
        <Container>
          <AppHeader onBack={onBack}>{product?.name}</AppHeader>
          <PageHeader title={header} />
          <Grid variant="inverted">
            <div>
              <ProductVariantNavigation
                fallbackThumbnail={product?.thumbnail?.url}
                variants={product?.variants}
                onRowClick={(variantId: string) => {
                  if (product && product.variants) {
                    return onVariantClick(variantId);
                  }
                }}
                onReorder={onVariantReorder}
              />
            </div>
            <div>
              <ProductVariantAttributes
                attributes={data.attributes}
                disabled={disabled}
                errors={errors}
                onChange={handlers.selectAttribute}
              />
              <CardSpacer />
              <ProductVariantPrice
                data={data}
                errors={errors}
                currencySymbol={currencySymbol}
                loading={disabled}
                onChange={change}
              />
              <CardSpacer />
              <ProductShipping
                data={data}
                disabled={disabled}
                errors={errors}
                weightUnit={weightUnit}
                onChange={change}
              />
              <CardSpacer />
              <ProductStocks
                data={data}
                disabled={disabled}
                hasVariants={true}
                onFormDataChange={change}
                errors={errors}
                stocks={data.stocks}
                warehouses={warehouses}
                onChange={handlers.changeStock}
                onWarehouseStockAdd={handlers.addStock}
                onWarehouseStockDelete={handlers.deleteStock}
                onWarehouseConfigure={onWarehouseConfigure}
              />
              <CardSpacer />
              <Metadata data={data} onChange={handlers.changeMetadata} />
            </div>
          </Grid>
          <SaveButtonBar
            disabled={disabled || !onSubmit || !hasChanged}
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
      )}
    </ProductVariantCreateForm>
  );
};
ProductVariantCreatePage.displayName = "ProductVariantCreatePage";
export default ProductVariantCreatePage;
