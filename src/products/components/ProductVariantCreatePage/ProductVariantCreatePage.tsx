import { ChannelPriceData } from "@saleor/channels/utils";
import AppHeader from "@saleor/components/AppHeader";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Form from "@saleor/components/Form";
import Grid from "@saleor/components/Grid";
import Metadata, { MetadataFormData } from "@saleor/components/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ProductChannelListingErrorFragment } from "@saleor/fragments/types/ProductChannelListingErrorFragment";
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import { getVariantAttributeInputFromProduct } from "@saleor/products/utils/data";
import { createVariantChannelsChangeHandler } from "@saleor/products/utils/handlers";
import {
  validateCostPrice,
  validatePrice
} from "@saleor/products/utils/validation";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import { ReorderAction } from "@saleor/types";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React from "react";
import { useIntl } from "react-intl";

import { maybe } from "../../../misc";
import { ProductVariantCreateData_product } from "../../types/ProductVariantCreateData";
import ProductShipping from "../ProductShipping/ProductShipping";
import ProductStocks, { ProductStockInput } from "../ProductStocks";
import ProductVariantAttributes, {
  VariantAttributeInputData
} from "../ProductVariantAttributes";
import ProductVariantNavigation from "../ProductVariantNavigation";
import ProductVariantPrice from "../ProductVariantPrice";

interface ProductVariantCreatePageFormData extends MetadataFormData {
  channelListing: ChannelPriceData[];
  images: string[];
  quantity: string;
  sku: string;
  trackInventory: boolean;
  weight: string;
}

export interface ProductVariantCreatePageSubmitData
  extends ProductVariantCreatePageFormData {
  attributes: FormsetData<VariantAttributeInputData>;
  stocks: ProductStockInput[];
}

interface ProductVariantCreatePageProps {
  channels: ChannelPriceData[];
  channelErrors: ProductChannelListingErrorFragment[] | undefined;
  disabled: boolean;
  errors: ProductErrorWithAttributesFragment[];
  header: string;
  product: ProductVariantCreateData_product;
  saveButtonBarState: ConfirmButtonTransitionState;
  warehouses: SearchWarehouses_search_edges_node[];
  weightUnit: string;
  onBack: () => void;
  onSubmit: (data: ProductVariantCreatePageSubmitData) => void;
  onVariantClick: (variantId: string) => void;
  onVariantReorder: ReorderAction;
  onWarehouseConfigure: () => void;
}

const ProductVariantCreatePage: React.FC<ProductVariantCreatePageProps> = ({
  channels,
  channelErrors = [],
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
  const attributeInput = React.useMemo(
    () => getVariantAttributeInputFromProduct(product),
    [product]
  );
  const { change: changeAttributeData, data: attributes } = useFormset(
    attributeInput
  );
  const {
    add: addStock,
    change: changeStockData,
    data: stocks,
    remove: removeStock
  } = useFormset<null, string>([]);
  const {
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const initialForm: ProductVariantCreatePageFormData = {
    channelListing: channels,
    images: product?.images.map(image => image.id),
    metadata: [],
    privateMetadata: [],
    quantity: "0",
    sku: "",
    trackInventory: true,
    weight: ""
  };

  const handleSubmit = (data: ProductVariantCreatePageFormData) =>
    onSubmit({
      ...data,
      attributes,
      stocks
    });

  return (
    <Form initial={initialForm} onSubmit={handleSubmit}>
      {({ change, data, hasChanged, set, submit, triggerChange }) => {
        const handleAttributeChange: FormsetChange = (id, value) => {
          changeAttributeData(id, value);
          triggerChange();
        };
        const changeMetadata = makeMetadataChangeHandler(change);

        const handleChannelChange = createVariantChannelsChangeHandler(
          data,
          set,
          triggerChange
        );
        const formDisabled = data.channelListing?.some(
          channel =>
            validatePrice(channel.price) || validateCostPrice(channel.costPrice)
        );

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
                  onReorder={onVariantReorder}
                />
              </div>
              <div>
                <ProductVariantAttributes
                  attributes={attributes}
                  disabled={disabled}
                  errors={errors}
                  onChange={handleAttributeChange}
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
                <ProductVariantPrice
                  ProductVariantChannelListings={data.channelListing}
                  errors={channelErrors}
                  loading={disabled}
                  onChange={handleChannelChange}
                />
                <CardSpacer />
                <ProductStocks
                  data={data}
                  disabled={disabled}
                  hasVariants={true}
                  onFormDataChange={change}
                  errors={errors}
                  stocks={stocks}
                  warehouses={warehouses}
                  onChange={(id, value) => {
                    triggerChange();
                    changeStockData(id, value);
                  }}
                  onWarehouseStockAdd={id => {
                    triggerChange();
                    addStock({
                      data: null,
                      id,
                      label: warehouses.find(warehouse => warehouse.id === id)
                        .name,
                      value: "0"
                    });
                  }}
                  onWarehouseStockDelete={id => {
                    triggerChange();
                    removeStock(id);
                  }}
                  onWarehouseConfigure={onWarehouseConfigure}
                />
                <CardSpacer />
                <Metadata data={data} onChange={changeMetadata} />
              </div>
            </Grid>
            <SaveButtonBar
              disabled={disabled || formDisabled || !onSubmit || !hasChanged}
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
