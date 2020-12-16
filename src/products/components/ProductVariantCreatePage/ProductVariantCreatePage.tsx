import { ChannelPriceData } from "@saleor/channels/utils";
import AppHeader from "@saleor/components/AppHeader";
import Attributes, {
  VariantAttributeScope
} from "@saleor/components/Attributes";
import CardSpacer from "@saleor/components/CardSpacer";
import { ConfirmButtonTransitionState } from "@saleor/components/ConfirmButton";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import SaveButtonBar from "@saleor/components/SaveButtonBar";
import { ProductChannelListingErrorFragment } from "@saleor/fragments/types/ProductChannelListingErrorFragment";
import { ProductErrorWithAttributesFragment } from "@saleor/fragments/types/ProductErrorWithAttributesFragment";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import { ReorderAction } from "@saleor/types";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import { ProductVariantCreateData_product } from "../../types/ProductVariantCreateData";
import ProductShipping from "../ProductShipping/ProductShipping";
import ProductStocks from "../ProductStocks";
import ProductVariantNavigation from "../ProductVariantNavigation";
import ProductVariantPrice from "../ProductVariantPrice";
import ProductVariantCreateForm, { ProductVariantCreateData } from "./form";

const messages = defineMessages({
  attributesHeader: {
    defaultMessage: "Variant Attributes",
    description: "attributes, section header"
  },
  attributesSelectionHeader: {
    defaultMessage: "Variant Selection Attributes",
    description: "attributes, section header"
  },
  deleteVariant: {
    defaultMessage: "Delete Variant",
    description: "button"
  },
  saveVariant: {
    defaultMessage: "Save variant",
    description: "button"
  }
});

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
  onSubmit: (data: ProductVariantCreateData) => void;
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

  return (
    <ProductVariantCreateForm
      product={product}
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
              <Attributes
                title={intl.formatMessage(messages.attributesHeader)}
                attributes={data.attributes.filter(
                  attribute =>
                    attribute.data.variantAttributeScope ===
                    VariantAttributeScope.NOT_VARIANT_SELECTION
                )}
                loading={disabled}
                disabled={disabled}
                errors={errors}
                onChange={handlers.selectAttribute}
                onMultiChange={handlers.selectAttributeMultiple}
                onFileChange={handlers.selectAttributeFile}
              />
              <CardSpacer />
              <Attributes
                title={intl.formatMessage(messages.attributesSelectionHeader)}
                attributes={data.attributes.filter(
                  attribute =>
                    attribute.data.variantAttributeScope ===
                    VariantAttributeScope.VARIANT_SELECTION
                )}
                loading={disabled}
                disabled={disabled}
                errors={errors}
                onChange={handlers.selectAttribute}
                onMultiChange={handlers.selectAttributeMultiple}
                onFileChange={handlers.selectAttributeFile}
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
                ProductVariantChannelListings={data.channelListings.map(
                  channel => ({
                    ...channel.data,
                    ...channel.value
                  })
                )}
                errors={channelErrors}
                loading={disabled}
                onChange={handlers.changeChannels}
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
            disabled={disabled || formDisabled || !onSubmit || !hasChanged}
            labels={{
              delete: intl.formatMessage(messages.deleteVariant),
              save: intl.formatMessage(messages.saveVariant)
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
