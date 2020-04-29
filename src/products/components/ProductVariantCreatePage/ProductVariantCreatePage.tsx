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
import { getVariantAttributeInputFromProduct } from "@saleor/products/utils/data";
import { ProductErrorFragment } from "@saleor/attributes/types/ProductErrorFragment";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import { maybe } from "../../../misc";
import { ProductVariantCreateData_product } from "../../types/ProductVariantCreateData";
import ProductVariantAttributes, {
  VariantAttributeInputData
} from "../ProductVariantAttributes";
import ProductVariantNavigation from "../ProductVariantNavigation";
import ProductVariantPrice from "../ProductVariantPrice";
import ProductStocks, { ProductStockInput } from "../ProductStocks";

interface ProductVariantCreatePageFormData {
  costPrice: string;
  images: string[];
  priceOverride: string;
  quantity: string;
  sku: string;
  trackInventory: boolean;
}

export interface ProductVariantCreatePageSubmitData
  extends ProductVariantCreatePageFormData {
  attributes: FormsetData<VariantAttributeInputData>;
  stocks: ProductStockInput[];
}

interface ProductVariantCreatePageProps {
  currencySymbol: string;
  disabled: boolean;
  errors: ProductErrorFragment[];
  header: string;
  product: ProductVariantCreateData_product;
  saveButtonBarState: ConfirmButtonTransitionState;
  warehouses: SearchWarehouses_search_edges_node[];
  onBack: () => void;
  onSubmit: (data: ProductVariantCreatePageSubmitData) => void;
  onVariantClick: (variantId: string) => void;
  onWarehouseEdit: () => void;
}

const ProductVariantCreatePage: React.FC<ProductVariantCreatePageProps> = ({
  currencySymbol,
  disabled,
  errors,
  header,
  product,
  saveButtonBarState,
  warehouses,
  onBack,
  onSubmit,
  onVariantClick,
  onWarehouseEdit
}) => {
  const intl = useIntl();
  const attributeInput = React.useMemo(
    () => getVariantAttributeInputFromProduct(product),
    [product]
  );
  const { change: changeAttributeData, data: attributes } = useFormset(
    attributeInput
  );
  const { change: changeStockData, data: stocks, set: setStocks } = useFormset<
    null
  >([]);
  React.useEffect(() => {
    const newStocks = warehouses.map(warehouse => ({
      data: null,
      id: warehouse.id,
      label: warehouse.name,
      value: stocks.find(stock => stock.id === warehouse.id)?.value || 0
    }));
    setStocks(newStocks);
  }, [JSON.stringify(warehouses)]);

  const initialForm: ProductVariantCreatePageFormData = {
    costPrice: "",
    images: maybe(() => product.images.map(image => image.id)),
    priceOverride: "",
    quantity: "0",
    sku: "",
    trackInventory: true
  };

  const handleSubmit = (data: ProductVariantCreatePageFormData) =>
    onSubmit({
      ...data,
      attributes,
      stocks
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
                  disabled={disabled}
                  errors={errors}
                  onChange={handleAttributeChange}
                />
                <CardSpacer />
                <ProductVariantPrice
                  errors={errors}
                  priceOverride={data.priceOverride}
                  currencySymbol={currencySymbol}
                  costPrice={data.costPrice}
                  loading={disabled}
                  onChange={change}
                />
                <CardSpacer />
                <ProductStocks
                  data={data}
                  disabled={disabled}
                  onChange={changeStockData}
                  onFormDataChange={change}
                  errors={errors}
                  stocks={stocks}
                  onWarehousesEdit={onWarehouseEdit}
                />
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
        );
      }}
    </Form>
  );
};
ProductVariantCreatePage.displayName = "ProductVariantCreatePage";
export default ProductVariantCreatePage;
