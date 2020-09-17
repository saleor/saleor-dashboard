import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
// import { ProductVariant_channelListing } from "@saleor/fragments/types/ProductVariant";
import { ProductVariant } from "@saleor/fragments/types/ProductVariant";
import { WarehouseFragment } from "@saleor/fragments/types/WarehouseFragment";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import { ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_productChannelListingErrors } from "@saleor/products/types/ProductVariantChannelListingUpdate";
import { VariantUpdate_productVariantUpdate_errors } from "@saleor/products/types/VariantUpdate";
import {
  getAttributeInputFromVariant,
  getStockInputFromVariant
} from "@saleor/products/utils/data";
import { createVariantChannelsChangeHandler } from "@saleor/products/utils/handlers";
import { diff } from "fast-array-diff";
import React from "react";

import { maybe } from "../../../misc";
import ProductStocks, { ProductStockInput } from "../ProductStocks";
import ProductVariantAttributes, {
  VariantAttributeInputData
} from "../ProductVariantAttributes";
import ProductVariantImages from "../ProductVariantImages";
import ProductVariantImageSelectDialog from "../ProductVariantImageSelectDialog";
import ProductVariantNavigation from "../ProductVariantNavigation";
import ProductVariantPrice from "../ProductVariantPrice";

export interface ProductVariantChannelData {
  id: string;
  currency: string;
  name: string;
  price: number;
}
export interface ProductVariantPageFormData {
  channelListing: ProductVariantChannelData[];
  costPrice: string;
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

interface ProductVariantPageProps {
  variant?: ProductVariant;
  channelErrors: ProductVariantChannelListingUpdate_productVariantChannelListingUpdate_productChannelListingErrors[];
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
  channelErrors,
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

  const variantImages = maybe(() => variant.images.map(image => image.id), []);
  const productImages = maybe(() =>
    variant.product.images.sort((prev, next) =>
      prev.sortOrder > next.sortOrder ? 1 : -1
    )
  );
  const images = maybe(() =>
    productImages
      .filter(image => variantImages.indexOf(image.id) !== -1)
      .sort((prev, next) => (prev.sortOrder > next.sortOrder ? 1 : -1))
  );

  const initialForm: ProductVariantPageFormData = {
    channelListing: variant?.channelListing?.map(listing => ({
      currency: listing.price.currency,
      id: listing.channel.id,
      name: listing.channel.name,
      price: listing.price.amount
    })),
    costPrice: variant?.costPrice?.amount?.toString() || "",
    sku: variant?.sku || "",
    trackInventory: variant?.trackInventory
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
        <AppHeader onBack={onBack}>{variant?.product?.name}</AppHeader>
        <PageHeader title={header} />
        <Form initial={initialForm} onSubmit={handleSubmit} confirmLeave>
          {({ change, data, hasChanged, set, submit, triggerChange }) => {
            const handleAttributeChange: FormsetChange = (id, value) => {
              changeAttributeData(id, value);
              triggerChange();
            };
            const handleChannelChange = createVariantChannelsChangeHandler(
              data,
              set,
              triggerChange
            );
            return (
              <>
                <Grid variant="inverted">
                  <div>
                    <ProductVariantNavigation
                      current={variant ? variant.id : undefined}
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
                      ProductVariantChannelListings={data.channelListing}
                      errors={channelErrors}
                      loading={loading}
                      onChange={handleChannelChange}
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
          selectedImages={maybe(() => variant.images.map(image => image.id))}
        />
      )}
    </>
  );
};
ProductVariantPage.displayName = "ProductVariantPage";
export default ProductVariantPage;
