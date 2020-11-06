import { ChannelPriceData, IChannelPriceArgs } from "@saleor/channels/utils";
import { MetadataFormData } from "@saleor/components/Metadata";
import { ProductVariant } from "@saleor/fragments/types/ProductVariant";
import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import {
  getAttributeInputFromVariant,
  getStockInputFromVariant
} from "@saleor/products/utils/data";
import { getChannelsInput } from "@saleor/products/utils/handlers";
import {
  validateCostPrice,
  validatePrice
} from "@saleor/products/utils/validation";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import { mapMetadataItemToInput } from "@saleor/utils/maps";
import getMetadata from "@saleor/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import { diff } from "fast-array-diff";
import React from "react";

import handleFormSubmit from "../../../utils/handlers/handleFormSubmit";
import { ProductStockInput } from "../ProductStocks";
import { VariantAttributeInputData } from "../ProductVariantAttributes";

export interface ProductVariantUpdateFormData extends MetadataFormData {
  sku: string;
  trackInventory: boolean;
  weight: string;
}
export interface ProductVariantUpdateData extends ProductVariantUpdateFormData {
  attributes: FormsetData<VariantAttributeInputData, string>;
  channelListings: FormsetData<ChannelPriceData, IChannelPriceArgs>;
  stocks: ProductStockInput[];
}
export interface ProductVariantUpdateSubmitData
  extends ProductVariantUpdateFormData {
  attributes: FormsetData<VariantAttributeInputData, string>;
  addStocks: ProductStockInput[];
  channelListings: FormsetData<ChannelPriceData, IChannelPriceArgs>;
  updateStocks: ProductStockInput[];
  removeStocks: string[];
}

export interface UseProductVariantUpdateFormOpts {
  warehouses: SearchWarehouses_search_edges_node[];
  currentChannels: ChannelPriceData[];
}

export interface UseProductVariantUpdateFormResult {
  change: FormChange;
  data: ProductVariantUpdateData;
  disabled: boolean;
  handlers: Record<
    "changeStock" | "selectAttribute" | "changeChannels",
    FormsetChange
  > &
    Record<"addStock" | "deleteStock", (id: string) => void> & {
      changeMetadata: FormChange;
    };
  hasChanged: boolean;
  submit: () => void;
}

export interface ProductVariantUpdateFormProps
  extends UseProductVariantUpdateFormOpts {
  children: (props: UseProductVariantUpdateFormResult) => React.ReactNode;
  variant: ProductVariant;
  onSubmit: (data: ProductVariantUpdateSubmitData) => SubmitPromise;
}

function useProductVariantUpdateForm(
  variant: ProductVariant,
  onSubmit: (data: ProductVariantUpdateSubmitData) => SubmitPromise,
  opts: UseProductVariantUpdateFormOpts
): UseProductVariantUpdateFormResult {
  const [changed, setChanged] = React.useState(false);
  const triggerChange = () => setChanged(true);

  const attributeInput = getAttributeInputFromVariant(variant);
  const stockInput = getStockInputFromVariant(variant);
  const channelsInput = getChannelsInput(opts.currentChannels);

  const initial: ProductVariantUpdateFormData = {
    metadata: variant?.metadata?.map(mapMetadataItemToInput),
    privateMetadata: variant?.privateMetadata?.map(mapMetadataItemToInput),
    sku: variant?.sku || "",
    trackInventory: variant?.trackInventory,
    weight: variant?.weight?.value.toString() || ""
  };

  const form = useForm(initial);
  const attributes = useFormset(attributeInput);
  const stocks = useFormset(stockInput);
  const channels = useFormset(channelsInput);
  const {
    isMetadataModified,
    isPrivateMetadataModified,
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const handleChange: FormChange = (event, cb) => {
    form.change(event, cb);
    triggerChange();
  };
  const changeMetadata = makeMetadataChangeHandler(handleChange);
  const handleAttributeChange: FormsetChange = (id, value) => {
    attributes.change(id, value);
    triggerChange();
  };
  const handleStockAdd = (id: string) => {
    triggerChange();
    stocks.add({
      data: null,
      id,
      label: opts.warehouses.find(warehouse => warehouse.id === id).name,
      value: "0"
    });
  };
  const handleStockChange = (id: string, value: string) => {
    triggerChange();
    stocks.change(id, value);
  };
  const handleStockDelete = (id: string) => {
    triggerChange();
    stocks.remove(id);
  };
  const handleChannelChange: FormsetChange = (id, value) => {
    channels.change(id, value);
    triggerChange();
  };

  const dataStocks = stocks.data.map(stock => stock.id);
  const variantStocks = variant?.stocks.map(stock => stock.warehouse.id) || [];
  const stockDiff = diff(variantStocks, dataStocks);

  const addStocks = stocks.data.filter(stock =>
    stockDiff.added.some(addedStock => addedStock === stock.id)
  );
  const updateStocks = stocks.data.filter(
    stock => !stockDiff.added.some(addedStock => addedStock === stock.id)
  );

  const disabled = channels?.data.some(
    channelData =>
      validatePrice(channelData.value.price) ||
      validateCostPrice(channelData.value.costPrice)
  );
  const data: ProductVariantUpdateData = {
    ...form.data,
    attributes: attributes.data,
    channelListings: channels.data,
    stocks: stocks.data
  };
  const submitData: ProductVariantUpdateSubmitData = {
    ...form.data,
    ...getMetadata(form.data, isMetadataModified, isPrivateMetadataModified),
    addStocks,
    attributes: attributes.data,
    channelListings: channels.data,
    removeStocks: stockDiff.removed,
    updateStocks
  };

  const submit = () => handleFormSubmit(submitData, onSubmit, setChanged);

  return {
    change: handleChange,
    data,
    disabled,
    handlers: {
      addStock: handleStockAdd,
      changeChannels: handleChannelChange,
      changeMetadata,
      changeStock: handleStockChange,
      deleteStock: handleStockDelete,
      selectAttribute: handleAttributeChange
    },
    hasChanged: changed,
    submit
  };
}

const ProductVariantUpdateForm: React.FC<ProductVariantUpdateFormProps> = ({
  children,
  variant,
  onSubmit,
  ...rest
}) => {
  const props = useProductVariantUpdateForm(variant, onSubmit, rest);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

ProductVariantUpdateForm.displayName = "ProductVariantUpdateForm";
export default ProductVariantUpdateForm;
