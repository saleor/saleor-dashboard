import React from "react";
import { useIntl } from "react-intl";

import { WindowTitle } from "@saleor/components/WindowTitle";
import useNavigator from "@saleor/hooks/useNavigator";
import useNotifier from "@saleor/hooks/useNotifier";
import useShop from "@saleor/hooks/useShop";
import NotFoundPage from "@saleor/components/NotFoundPage";
import { commonMessages } from "@saleor/intl";
import createDialogActionHandlers from "@saleor/utils/handlers/dialogActionHandlers";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import { DEFAULT_INITIAL_SEARCH_DATA } from "@saleor/config";
import useWarehouseSearch from "@saleor/searches/useWarehouseSearch";
import { decimal } from "../../misc";
import ProductVariantCreatePage, {
  ProductVariantCreatePageSubmitData
} from "../components/ProductVariantCreatePage";
import { TypedVariantCreateMutation } from "../mutations";
import { TypedProductVariantCreateQuery } from "../queries";
import { VariantCreate } from "../types/VariantCreate";
import {
  productUrl,
  productVariantEditUrl,
  productListUrl,
  productVariantAddUrl,
  ProductVariantAddUrlDialog,
  ProductVariantAddUrlQueryParams
} from "../urls";
import ProductWarehousesDialog from "../components/ProductWarehousesDialog";

interface ProductVariantCreateProps {
  params: ProductVariantAddUrlQueryParams;
  productId: string;
}

export const ProductVariant: React.FC<ProductVariantCreateProps> = ({
  params,
  productId
}) => {
  const navigate = useNavigator();
  const notify = useNotifier();
  const shop = useShop();
  const intl = useIntl();
  const { result: searchWarehousesOpts } = useWarehouseSearch({
    variables: {
      ...DEFAULT_INITIAL_SEARCH_DATA,
      first: 20
    }
  });
  const [warehouses, setWarehouses] = React.useState<
    SearchWarehouses_search_edges_node[]
  >([]);

  const [openModal, closeModal] = createDialogActionHandlers<
    ProductVariantAddUrlDialog,
    ProductVariantAddUrlQueryParams
  >(navigate, params => productVariantAddUrl(productId, params), params);

  return (
    <TypedProductVariantCreateQuery displayLoader variables={{ id: productId }}>
      {({ data, loading: productLoading }) => {
        const product = data?.product;

        if (product === null) {
          return <NotFoundPage onBack={() => navigate(productListUrl())} />;
        }

        const handleCreateSuccess = (data: VariantCreate) => {
          if (data.productVariantCreate.errors.length === 0) {
            notify({
              text: intl.formatMessage(commonMessages.savedChanges)
            });
            navigate(
              productVariantEditUrl(
                productId,
                data.productVariantCreate.productVariant.id
              )
            );
          }
        };

        return (
          <TypedVariantCreateMutation onCompleted={handleCreateSuccess}>
            {(variantCreate, variantCreateResult) => {
              const handleBack = () => navigate(productUrl(productId));
              const handleSubmit = (
                formData: ProductVariantCreatePageSubmitData
              ) =>
                variantCreate({
                  variables: {
                    input: {
                      attributes: formData.attributes
                        .filter(attribute => attribute.value !== "")
                        .map(attribute => ({
                          id: attribute.id,
                          values: [attribute.value]
                        })),
                      costPrice: decimal(formData.costPrice),
                      priceOverride: decimal(formData.priceOverride),
                      product: productId,
                      sku: formData.sku,
                      stocks: formData.stocks.map(stock => ({
                        quantity: parseInt(stock.value, 0),
                        warehouse: stock.id
                      })),
                      trackInventory: true
                    }
                  }
                });
              const handleVariantClick = (id: string) =>
                navigate(productVariantEditUrl(productId, id));

              const disableForm = productLoading || variantCreateResult.loading;

              return (
                <>
                  <WindowTitle
                    title={intl.formatMessage({
                      defaultMessage: "Create variant",
                      description: "window title"
                    })}
                  />
                  <ProductVariantCreatePage
                    currencySymbol={shop?.defaultCurrency}
                    disabled={disableForm}
                    errors={
                      variantCreateResult.data?.productVariantCreate.errors ||
                      []
                    }
                    header={intl.formatMessage({
                      defaultMessage: "Create Variant",
                      description: "header"
                    })}
                    product={data?.product}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                    onVariantClick={handleVariantClick}
                    saveButtonBarState={variantCreateResult.status}
                    warehouses={warehouses}
                    onWarehouseEdit={() => openModal("edit-stocks")}
                  />
                  <ProductWarehousesDialog
                    confirmButtonState="default"
                    disabled={false}
                    errors={[]}
                    onClose={closeModal}
                    open={params.action === "edit-stocks"}
                    warehouses={searchWarehousesOpts.data?.search.edges.map(
                      edge => edge.node
                    )}
                    warehousesWithStocks={warehouses.map(
                      warehouse => warehouse.id
                    )}
                    onConfirm={data => {
                      setWarehouses(
                        [
                          ...warehouses,
                          ...data.added.map(
                            addedId =>
                              searchWarehousesOpts.data.search.edges.find(
                                edge => edge.node.id === addedId
                              ).node
                          )
                        ].filter(
                          warehouse => !data.removed.includes(warehouse.id)
                        )
                      );
                      closeModal();
                    }}
                  />
                </>
              );
            }}
          </TypedVariantCreateMutation>
        );
      }}
    </TypedProductVariantCreateQuery>
  );
};
export default ProductVariant;
