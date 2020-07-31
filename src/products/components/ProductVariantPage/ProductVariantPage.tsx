import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ProductVariant } from "@saleor/fragments/types/ProductVariant";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import { fakeListings } from "@saleor/products/fixtures";
import { VariantUpdate_productVariantUpdate_errors } from "@saleor/products/types/VariantUpdate";
import {
  getAttributeInputFromVariant,
  getStockInputFromVariant
} from "@saleor/products/utils/data";
import { ProductVariantChannelListingInput } from "@saleor/types/globalTypes";
import { diff } from "fast-array-diff";
import React from "react";

import ProductStocks, { ProductStockInput } from "../ProductStocks";
import ProductVariantAttributes, {
  VariantAttributeInputData
} from "../ProductVariantAttributes";
import ProductVariantImages from "../ProductVariantImages";
import ProductVariantImageSelectDialog from "../ProductVariantImageSelectDialog";
import ProductVariantNavigation from "../ProductVariantNavigation";
import ProductVariantPrice from "../ProductVariantPrice";

export interface ProductVariantPageFormData {
  costPrice: string;
  price: string;
  sku: string;
  trackInventory: boolean;
}

export interface ProductVariantPageSubmitData
  extends ProductVariantPageFormData {
  attributes: FormsetData<VariantAttributeInputData, string>;
  addStocks: ProductStockInput[];
  updateStocks: ProductStockInput[];
  removeStocks: string[];
}
export interface ProductVariantPagePricingFormData {
  variantPricings: ProductVariantChannelListingInput[];
}

interface ProductVariantPageProps {
  variant?: ProductVariant;
  errors: VariantUpdate_productVariantUpdate_errors[];
  saveButtonBarState: ConfirmButtonTransitionState;
  loading?: boolean;
  placeholderImage?: string;
  header: string;
  warehouses: WarehouseFragment[];
  onAdd();
  onBack();
  onDelete();
  onSubmit(data: ProductVariantPageSubmitData);
  onImageSelect(id: string);
  onVariantClick(variantId: string);
}

const ProductVariantPage: React.FC<ProductVariantPageProps> = ({
  errors,
  loading,
  header,
  placeholderImage,
  saveButtonBarState,
  variant,
  warehouses,
  onAdd,
  onBack,
  onDelete,
  onImageSelect,
  onSubmit,
  onVariantClick
}) => {
  const attributeInput = React.useMemo(
    () => getAttributeInputFromVariant(variant),
    [variant]
  );
  const stockInput = React.useMemo(() => getStockInputFromVariant(variant), [
    variant
  ]);
  const { change: changeAttributeData, data: attributes } = useFormset(
    attributeInput
  );
  const {
    add: addStock,
    change: changeStockData,
    data: stocks,
    remove: removeStock
  } = useFormset(stockInput);

  const [isModalOpened, setModalStatus] = React.useState(false);
  const toggleModal = () => setModalStatus(!isModalOpened);

  const variantImages = variant?.images.map(image => image.id) || [];
  const productImages =
    variant?.product.images.sort((prev, next) =>
      prev.sortOrder > next.sortOrder ? 1 : -1
    ) || [];
  const images = productImages
    .filter(image => variantImages.indexOf(image.id) !== -1)
    .sort((prev, next) => (prev.sortOrder > next.sortOrder ? 1 : -1));

  const initialForm: ProductVariantPageFormData = {
    costPrice: variant?.costPrice.amount.toString() || "",
    price: variant?.price.amount.toString() || "",
    sku: variant?.sku || "",
    trackInventory: variant?.trackInventory
  };

  const initialPricingForm: ProductVariantPagePricingFormData = {
    variantPricings:
      variant?.channelListing.map(l => ({
        channelId: l.channel.id,
        price: l.price
      })) || []
  };

  const handleSubmit = (data: ProductVariantPageFormData) => {
    const dataStocks = stocks.map(stock => stock.id);
    const variantStocks = variant.stocks.map(stock => stock.warehouse.id);
    const stockDiff = diff(variantStocks, dataStocks);

    onSubmit({
      ...data,
      addStocks: stocks.filter(stock =>
        stockDiff.added.some(addedStock => addedStock === stock.id)
      ),
      attributes,
      removeStocks: stockDiff.removed,
      updateStocks: stocks.filter(
        stock => !stockDiff.added.some(addedStock => addedStock === stock.id)
      )
    });
  };

  return (
    <>
      <Container>
        <AppHeader onBack={onBack}>{variant?.product.name}</AppHeader>
        <PageHeader title={header} />
        <Form initial={initialForm} onSubmit={handleSubmit} confirmLeave>
          {({ change, data, hasChanged, submit, triggerChange }) => {
            const handleAttributeChange: FormsetChange = (id, value) => {
              changeAttributeData(id, value);
              triggerChange();
            };

            return (
              <>
                <Grid variant="inverted">
                  <div>
                    <ProductVariantNavigation
                      current={variant ? variant.id : undefined}
                      fallbackThumbnail={variant?.product.thumbnail.url}
                      variants={variant?.product.variants}
                      onAdd={onAdd}
                      onRowClick={(variantId: string) => {
                        if (variant) {
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
                    <ProductVariantImages
                      disabled={loading}
                      images={images}
                      placeholderImage={placeholderImage}
                      onImageAdd={toggleModal}
                    />
                    <CardSpacer />
                    <ProductVariantPrice
                      data={pricingData}
                      errors={errors}
                      ProductVariantChannelListings={fakeListings}
                      loading={loading}
                      onChange={change}
                    />
                    <CardSpacer />
                    <ProductStocks
                      data={data}
                      disabled={loading}
                      errors={errors}
                      stocks={stocks}
                      warehouses={warehouses}
                      onChange={(id, value) => {
                        triggerChange();
                        changeStockData(id, value);
                      }}
                      onFormDataChange={change}
                      onWarehouseStockAdd={id => {
                        triggerChange();
                        addStock({
                          data: null,
                          id,
                          label: warehouses.find(
                            warehouse => warehouse.id === id
                          ).name,
                          value: "0"
                        });
                      }}
                      onWarehouseStockDelete={id => {
                        triggerChange();
                        removeStock(id);
                      }}
                    />
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
            );
          }}
        </Form>
      </Container>
      {variant && (
        <ProductVariantImageSelectDialog
          onClose={toggleModal}
          onImageSelect={onImageSelect}
          open={isModalOpened}
          images={productImages}
          selectedImages={variant?.images.map(image => image.id)}
        />
      )}
    </>
  );
};
ProductVariantPage.displayName = "ProductVariantPage";
export default ProductVariantPage;
