import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import { MetadataFormData } from "@saleor/components/Metadata";
import Metadata from "@saleor/components/Metadata/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import { ProductVariant } from "@saleor/fragments/types/ProductVariant";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import { FormsetData } from "@saleor/hooks/useFormset";
import { VariantUpdate_productVariantUpdate_errors } from "@saleor/products/types/VariantUpdate";
import { ReorderAction } from "@saleor/types";
import React from "react";

import { maybe } from "../../../misc";
import ProductShipping from "../ProductShipping/ProductShipping";
import ProductStocks, { ProductStockInput } from "../ProductStocks";
import ProductVariantAttributes, {
  VariantAttributeInputData
} from "../ProductVariantAttributes";
import ProductVariantImages from "../ProductVariantImages";
import ProductVariantImageSelectDialog from "../ProductVariantImageSelectDialog";
import ProductVariantNavigation from "../ProductVariantNavigation";
import ProductVariantPrice from "../ProductVariantPrice";
import ProductVariantSetDefault from "../ProductVariantSetDefault";
import ProductVariantUpdateForm from "./form";

export interface ProductVariantPageFormData extends MetadataFormData {
  costPrice: string;
  price: string;
  sku: string;
  trackInventory: boolean;
  weight: string;
}

export interface ProductVariantPageSubmitData
  extends ProductVariantPageFormData {
  attributes: FormsetData<VariantAttributeInputData, string>;
  addStocks: ProductStockInput[];
  updateStocks: ProductStockInput[];
  removeStocks: string[];
}

interface ProductVariantPageProps {
  defaultVariantId?: string;
  defaultWeightUnit: string;
  errors:
    | ProductErrorWithAttributesFragment[]
    | VariantUpdate_productVariantUpdate_errors[];
  header: string;
  loading?: boolean;
  placeholderImage?: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  variant?: ProductVariant;
  warehouses: WarehouseFragment[];
  onVariantReorder: ReorderAction;
  onAdd();
  onBack();
  onDelete();
  onSubmit(data: ProductVariantPageSubmitData);
  onImageSelect(id: string);
  onVariantClick(variantId: string);
  onSetDefaultVariant();
  onWarehouseConfigure();
}

const ProductVariantPage: React.FC<ProductVariantPageProps> = ({
  defaultVariantId,
  defaultWeightUnit,
  errors,
  header,
  loading,
  placeholderImage,
  saveButtonBarState,
  variant,
  warehouses,
  onAdd,
  onBack,
  onDelete,
  onImageSelect,
  onSubmit,
  onVariantClick,
  onVariantReorder,
  onSetDefaultVariant,
  onWarehouseConfigure
}) => {
  const [isModalOpened, setModalStatus] = React.useState(false);
  const toggleModal = () => setModalStatus(!isModalOpened);

  const variantImages = variant?.images?.map(image => image.id);
  const productImages = variant?.product?.images?.sort((prev, next) =>
    prev.sortOrder > next.sortOrder ? 1 : -1
  );
  const images = productImages
    ?.filter(image => variantImages.indexOf(image.id) !== -1)
    .sort((prev, next) => (prev.sortOrder > next.sortOrder ? 1 : -1));

  return (
    <>
      <Container>
        <AppHeader onBack={onBack}>
          {maybe(() => variant.product.name)}
        </AppHeader>
        <PageHeader title={header}>
          {variant?.product?.defaultVariant?.id !== variant?.id && (
            <ProductVariantSetDefault
              onSetDefaultVariant={onSetDefaultVariant}
            />
          )}
        </PageHeader>
        <ProductVariantUpdateForm
          variant={variant}
          onSubmit={onSubmit}
          warehouses={warehouses}
        >
          {({ change, data, handlers, hasChanged, submit }) => (
            <>
              <Grid variant="inverted">
                <div>
                  <ProductVariantNavigation
                    current={variant ? variant.id : undefined}
                    defaultVariantId={defaultVariantId}
                    fallbackThumbnail={maybe(
                      () => variant.product.thumbnail.url
                    )}
                    variants={maybe(() => variant.product.variants)}
                    onAdd={onAdd}
                    onRowClick={(variantId: string) => {
                      if (variant) {
                        return onVariantClick(variantId);
                      }
                    }}
                    onReorder={onVariantReorder}
                  />
                </div>
                <div>
                  <ProductVariantAttributes
                    attributes={data.attributes}
                    disabled={loading}
                    errors={errors}
                    onChange={handlers.selectAttribute}
                  />
                  <CardSpacer />
                  <ProductVariantImages
                    disabled={loading}
                    images={images}
                    placeholderImage={placeholderImage}
                    onImageAdd={toggleModal}
                  />
                  <CardSpacer />
                  <ProductVariantPrice
                    data={data}
                    errors={errors}
                    currencySymbol={
                      variant && variant.price
                        ? variant.price.currency
                        : variant && variant.costPrice
                        ? variant.costPrice.currency
                        : ""
                    }
                    loading={loading}
                    onChange={change}
                  />
                  <CardSpacer />
                  <ProductShipping
                    data={data}
                    disabled={loading}
                    errors={errors}
                    weightUnit={variant?.weight?.unit || defaultWeightUnit}
                    onChange={change}
                  />
                  <CardSpacer />
                  <ProductStocks
                    data={data}
                    disabled={loading}
                    hasVariants={true}
                    errors={errors}
                    stocks={data.stocks}
                    warehouses={warehouses}
                    onChange={handlers.changeStock}
                    onFormDataChange={change}
                    onWarehouseStockAdd={handlers.addStock}
                    onWarehouseStockDelete={handlers.deleteStock}
                    onWarehouseConfigure={onWarehouseConfigure}
                  />
                  <CardSpacer />
                  <Metadata data={data} onChange={handlers.changeMetadata} />
                </div>
              </Grid>
              <SaveButtonBar
                disabled={loading || !hasChanged}
                state={saveButtonBarState}
                onCancel={onBack}
                onDelete={onDelete}
                onSave={submit}
              />
            </>
          )}
        </ProductVariantUpdateForm>
      </Container>
      {variant && (
        <ProductVariantImageSelectDialog
          onClose={toggleModal}
          onImageSelect={onImageSelect}
          open={isModalOpened}
          images={productImages}
          selectedImages={maybe(() => variant.images.map(image => image.id))}
        />
      )}
    </>
  );
};
ProductVariantPage.displayName = "ProductVariantPage";
export default ProductVariantPage;
