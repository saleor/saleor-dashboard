import {
  getAttributeValuesFromReferences,
  mergeAttributeValues,
} from "@saleor/attributes/utils/data";
import AssignAttributeValueDialog from "@saleor/components/AssignAttributeValueDialog";
import Attributes, {
  AttributeInput,
  VariantAttributeScope,
} from "@saleor/components/Attributes";
import { Backlink } from "@saleor/components/Backlink";
import CardSpacer from "@saleor/components/CardSpacer";
import Container from "@saleor/components/Container";
import Grid from "@saleor/components/Grid";
import Metadata from "@saleor/components/Metadata";
import PageHeader from "@saleor/components/PageHeader";
import Savebar from "@saleor/components/Savebar";
import {
  ProductErrorWithAttributesFragment,
  ProductVariantCreateDataQuery,
  SearchAttributeValuesQuery,
  SearchPagesQuery,
  SearchProductsQuery,
  SearchWarehousesQuery,
} from "@saleor/graphql";
import useNavigator from "@saleor/hooks/useNavigator";
import { ConfirmButtonTransitionState } from "@saleor/macaw-ui";
import { ProductDetailsChannelsAvailabilityCard } from "@saleor/products/components/ProductVariantChannels/ChannelsAvailabilityCard";
import { productUrl } from "@saleor/products/urls";
import { FetchMoreProps, RelayToFlat, ReorderAction } from "@saleor/types";
import React from "react";
import { defineMessages, useIntl } from "react-intl";

import ProductShipping from "../ProductShipping/ProductShipping";
import ProductStocks from "../ProductStocks";
import { useManageChannels } from "../ProductVariantChannels/useManageChannels";
import { VariantChannelsDialog } from "../ProductVariantChannels/VariantChannelsDialog";
import ProductVariantCheckoutSettings from "../ProductVariantCheckoutSettings/ProductVariantCheckoutSettings";
import ProductVariantNavigation from "../ProductVariantNavigation";
import ProductVariantPrice from "../ProductVariantPrice";
import ProductVariantCreateForm, {
  ProductVariantCreateData,
  ProductVariantCreateHandlers,
} from "./form";

const messages = defineMessages({
  attributesHeader: {
    id: "f3B4tc",
    defaultMessage: "Variant Attributes",
    description: "attributes, section header",
  },
  attributesSelectionHeader: {
    id: "o6260f",
    defaultMessage: "Variant Selection Attributes",
    description: "attributes, section header",
  },
  deleteVariant: {
    id: "7hNjaI",
    defaultMessage: "Delete Variant",
    description: "button",
  },
  saveVariant: {
    id: "U9CIo7",
    defaultMessage: "Save variant",
    description: "button",
  },
  pricingCardSubtitle: {
    id: "sw8Wl2",
    defaultMessage:
      "There is no channel to define prices for. You need to first add variant to channels to define prices.",
    description: "variant pricing section subtitle",
  },
});

interface ProductVariantCreatePageProps {
  productId: string;
  defaultVariantId?: string;
  disabled: boolean;
  errors: ProductErrorWithAttributesFragment[];
  header: string;
  product: ProductVariantCreateDataQuery["product"];
  saveButtonBarState: ConfirmButtonTransitionState;
  warehouses: RelayToFlat<SearchWarehousesQuery["search"]>;
  weightUnit: string;
  referencePages?: RelayToFlat<SearchPagesQuery["search"]>;
  referenceProducts?: RelayToFlat<SearchProductsQuery["search"]>;
  attributeValues: RelayToFlat<
    SearchAttributeValuesQuery["attribute"]["choices"]
  >;
  onSubmit: (data: ProductVariantCreateData) => void;
  onVariantClick: (variantId: string) => void;
  onVariantReorder: ReorderAction;
  onWarehouseConfigure: () => void;
  assignReferencesAttributeId?: string;
  onAssignReferencesClick: (attribute: AttributeInput) => void;
  fetchReferencePages?: (data: string) => void;
  fetchReferenceProducts?: (data: string) => void;
  fetchAttributeValues: (query: string, attributeId: string) => void;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchMoreReferenceProducts?: FetchMoreProps;
  fetchMoreAttributeValues?: FetchMoreProps;
  onCloseDialog: () => void;
  onAttributeSelectBlur: () => void;
}

const ProductVariantCreatePage: React.FC<ProductVariantCreatePageProps> = ({
  productId,
  defaultVariantId,
  disabled,
  errors,
  header,
  product,
  saveButtonBarState,
  warehouses,
  weightUnit,
  referencePages = [],
  referenceProducts = [],
  attributeValues,
  onSubmit,
  onVariantReorder,
  onWarehouseConfigure,
  assignReferencesAttributeId,
  onAssignReferencesClick,
  fetchReferencePages,
  fetchReferenceProducts,
  fetchAttributeValues,
  fetchMoreReferencePages,
  fetchMoreReferenceProducts,
  fetchMoreAttributeValues,
  onCloseDialog,
  onAttributeSelectBlur,
}) => {
  const intl = useIntl();
  const navigate = useNavigator();
  const {
    isOpen: isManageChannelsModalOpen,
    toggle: toggleManageChannels,
  } = useManageChannels();
  const canOpenAssignReferencesAttributeDialog = !!assignReferencesAttributeId;

  const handleAssignReferenceAttribute = (
    attributeValues: string[],
    data: ProductVariantCreateData,
    handlers: ProductVariantCreateHandlers,
  ) => {
    handlers.selectAttributeReference(
      assignReferencesAttributeId,
      mergeAttributeValues(
        assignReferencesAttributeId,
        attributeValues,
        data.attributes,
      ),
    );
    onCloseDialog();
  };

  return (
    <ProductVariantCreateForm
      product={product}
      onSubmit={onSubmit}
      warehouses={warehouses}
      referencePages={referencePages}
      referenceProducts={referenceProducts}
      fetchReferencePages={fetchReferencePages}
      fetchMoreReferencePages={fetchMoreReferencePages}
      fetchReferenceProducts={fetchReferenceProducts}
      fetchMoreReferenceProducts={fetchMoreReferenceProducts}
      assignReferencesAttributeId={assignReferencesAttributeId}
      disabled={disabled}
    >
      {({
        change,
        data,
        formErrors,
        handlers,
        submit,
        isSaveDisabled,
        attributeRichTextGetters,
      }) => (
        <Container>
          <Backlink href={productUrl(productId)}>{product?.name}</Backlink>
          <PageHeader title={header} />
          <Grid variant="inverted">
            <div>
              <ProductVariantNavigation
                fallbackThumbnail={product?.thumbnail?.url}
                variants={product?.variants}
                productId={productId}
                defaultVariantId={defaultVariantId}
                onReorder={onVariantReorder}
                isCreate={true}
              />
            </div>
            <div>
              <ProductDetailsChannelsAvailabilityCard
                product={product}
                onManageClick={toggleManageChannels}
              />
              <Attributes
                title={intl.formatMessage(messages.attributesHeader)}
                attributes={data.attributes.filter(
                  attribute =>
                    attribute.data.variantAttributeScope ===
                    VariantAttributeScope.NOT_VARIANT_SELECTION,
                )}
                attributeValues={attributeValues}
                loading={disabled}
                disabled={disabled}
                errors={errors}
                onChange={handlers.selectAttribute}
                onMultiChange={handlers.selectAttributeMultiple}
                onFileChange={handlers.selectAttributeFile}
                onReferencesRemove={handlers.selectAttributeReference}
                onReferencesAddClick={onAssignReferencesClick}
                onReferencesReorder={handlers.reorderAttributeValue}
                fetchAttributeValues={fetchAttributeValues}
                fetchMoreAttributeValues={fetchMoreAttributeValues}
                onAttributeSelectBlur={onAttributeSelectBlur}
                richTextGetters={attributeRichTextGetters}
              />
              <CardSpacer />
              <Attributes
                title={intl.formatMessage(messages.attributesSelectionHeader)}
                attributes={data.attributes.filter(
                  attribute =>
                    attribute.data.variantAttributeScope ===
                    VariantAttributeScope.VARIANT_SELECTION,
                )}
                attributeValues={attributeValues}
                loading={disabled}
                disabled={disabled}
                errors={errors}
                onChange={handlers.selectAttribute}
                onMultiChange={handlers.selectAttributeMultiple}
                onFileChange={handlers.selectAttributeFile}
                onReferencesRemove={handlers.selectAttributeReference}
                onReferencesAddClick={onAssignReferencesClick}
                onReferencesReorder={handlers.reorderAttributeValue}
                fetchAttributeValues={fetchAttributeValues}
                fetchMoreAttributeValues={fetchMoreAttributeValues}
                onAttributeSelectBlur={onAttributeSelectBlur}
                richTextGetters={attributeRichTextGetters}
              />
              <CardSpacer />
              <ProductVariantCheckoutSettings
                data={data}
                disabled={disabled}
                errors={errors}
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
              <ProductVariantPrice
                disabled={!product}
                ProductVariantChannelListings={data.channelListings.map(
                  channel => ({
                    ...channel.data,
                    ...channel.value,
                  }),
                )}
                errors={[]}
                loading={!product}
                onChange={handlers.changeChannels}
              />
              <CardSpacer />
              <ProductStocks
                data={data}
                disabled={disabled}
                hasVariants={true}
                onFormDataChange={change}
                formErrors={formErrors}
                errors={errors}
                stocks={data.stocks}
                warehouses={warehouses}
                onChange={handlers.changeStock}
                onChangePreorderEndDate={handlers.changePreorderEndDate}
                onWarehouseStockAdd={handlers.addStock}
                onWarehouseStockDelete={handlers.deleteStock}
                onWarehouseConfigure={onWarehouseConfigure}
              />
              <CardSpacer />
              <Metadata data={data} onChange={handlers.changeMetadata} />
            </div>
          </Grid>
          <Savebar
            disabled={isSaveDisabled}
            labels={{
              confirm: intl.formatMessage(messages.saveVariant),
              delete: intl.formatMessage(messages.deleteVariant),
            }}
            state={saveButtonBarState}
            onCancel={() => navigate(productUrl(productId))}
            onSubmit={submit}
          />
          {canOpenAssignReferencesAttributeDialog && (
            <AssignAttributeValueDialog
              attributeValues={getAttributeValuesFromReferences(
                assignReferencesAttributeId,
                data.attributes,
                referencePages,
                referenceProducts,
              )}
              hasMore={handlers.fetchMoreReferences?.hasMore}
              open={canOpenAssignReferencesAttributeDialog}
              onFetch={handlers.fetchReferences}
              onFetchMore={handlers.fetchMoreReferences?.onFetchMore}
              loading={handlers.fetchMoreReferences?.loading}
              onClose={onCloseDialog}
              onSubmit={attributeValues =>
                handleAssignReferenceAttribute(attributeValues, data, handlers)
              }
            />
          )}
          {product && (
            <VariantChannelsDialog
              channelListings={product.channelListings}
              selectedChannelListings={data.channelListings}
              open={isManageChannelsModalOpen}
              onClose={toggleManageChannels}
              onConfirm={handlers.updateChannels}
            />
          )}
        </Container>
      )}
    </ProductVariantCreateForm>
  );
};
ProductVariantCreatePage.displayName = "ProductVariantCreatePage";
export default ProductVariantCreatePage;
