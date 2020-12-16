import { ChannelPriceData } from "@saleor/channels/utils";
import AppHeader from "@saleor/components/AppHeader";
import Attributes, {
  AttributeInput,
  VariantAttributeScope
} from "@saleor/components/Attributes";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import { MetadataFormData } from "@saleor/components/Metadata";
import Metadata from "@saleor/components/Metadata/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ProductChannelListingErrorFragment } from "@saleor/fragments/types/ProductChannelListingErrorFragment";
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import { ProductVariant } from "@saleor/fragments/types/ProductVariant";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import { VariantUpdate_productVariantUpdate_errors } from "@saleor/products/types/VariantUpdate";
import { ReorderAction } from "@saleor/types";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { maybe } from "../../../misc";
import ProductShipping from "../ProductShipping/ProductShipping";
import ProductStocks, { ProductStockInput } from "../ProductStocks";
import ProductVariantImages from "../ProductVariantImages";
import ProductVariantImageSelectDialog from "../ProductVariantImageSelectDialog";
import ProductVariantNavigation from "../ProductVariantNavigation";
import ProductVariantPrice from "../ProductVariantPrice";
import ProductVariantSetDefault from "../ProductVariantSetDefault";
import ProductVariantUpdateForm, {
  ProductVariantUpdateSubmitData
} from "./form";

const messages = defineMessages({
  nonSelectionAttributes: {
    defaultMessage: "Variant Attributes",
    description: "attributes, section header"
  },
  selectionAttributesHeader: {
    defaultMessage: "Variant Selection Attributes",
    description: "attributes, section header"
  }
});

export interface ProductVariantPageFormData extends MetadataFormData {
  costPrice: string;
  price: string;
  sku: string;
  trackInventory: boolean;
  weight: string;
}

export interface ProductVariantPageSubmitData
  extends ProductVariantPageFormData {
  attributes: AttributeInput[];
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
  channels: ChannelPriceData[];
  channelErrors: ProductChannelListingErrorFragment[];
  loading?: boolean;
  placeholderImage?: string;
  saveButtonBarState: ConfirmButtonTransitionState;
  variant?: ProductVariant;
  warehouses: WarehouseFragment[];
  onVariantReorder: ReorderAction;
  onAdd();
  onBack();
  onDelete();
  onSubmit(data: ProductVariantUpdateSubmitData);
  onImageSelect(id: string);
  onVariantClick(variantId: string);
  onSetDefaultVariant();
  onWarehouseConfigure();
}

const ProductVariantPage: React.FC<ProductVariantPageProps> = ({
  channels,
  channelErrors,
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
  const intl = useIntl();

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
        <AppHeader onBack={onBack}>{variant?.product?.name}</AppHeader>
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
          currentChannels={channels}
        >
          {({
            change,
            data,
            disabled: formDisabled,
            handlers,
            hasChanged,
            submit
          }) => (
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
                  <Attributes
                    title={intl.formatMessage(messages.nonSelectionAttributes)}
                    attributes={data.attributes.filter(
                      attribute =>
                        attribute.data.variantAttributeScope ===
                        VariantAttributeScope.NOT_VARIANT_SELECTION
                    )}
                    loading={loading}
                    disabled={loading}
                    errors={errors}
                    onChange={handlers.selectAttribute}
                    onMultiChange={handlers.selectAttributeMultiple}
                    onFileChange={handlers.selectAttributeFile}
                  />
                  <CardSpacer />
                  <Attributes
                    title={intl.formatMessage(
                      messages.selectionAttributesHeader
                    )}
                    attributes={data.attributes.filter(
                      attribute =>
                        attribute.data.variantAttributeScope ===
                        VariantAttributeScope.VARIANT_SELECTION
                    )}
                    loading={loading}
                    disabled={loading}
                    errors={errors}
                    onChange={handlers.selectAttribute}
                    onMultiChange={handlers.selectAttributeMultiple}
                    onFileChange={handlers.selectAttributeFile}
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
                    ProductVariantChannelListings={data.channelListings.map(
                      channel => ({
                        ...channel.data,
                        ...channel.value
                      })
                    )}
                    errors={channelErrors}
                    loading={loading}
                    onChange={handlers.changeChannels}
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
                disabled={loading || formDisabled || !hasChanged}
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
