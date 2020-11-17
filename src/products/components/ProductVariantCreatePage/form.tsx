import { ChannelPriceData, IChannelPriceArgs } from "@saleor/channels/utils";
import { MetadataFormData } from "@saleor/components/Metadata";
import useForm, { FormChange } from "@saleor/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import { ProductVariantCreateData_product } from "@saleor/products/types/ProductVariantCreateData";
import { getVariantAttributeInputFromProduct } from "@saleor/products/utils/data";
import { getChannelsInput } from "@saleor/products/utils/handlers";
import {
  validateCostPrice,
  validatePrice
} from "@saleor/products/utils/validation";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React from "react";

import { ProductStockInput } from "../ProductStocks";
import { VariantAttributeInputData } from "../ProductVariantAttributes";

export interface ProductVariantCreateFormData extends MetadataFormData {
  sku: string;
  trackInventory: boolean;
  weight: string;
}
export interface ProductVariantCreateData extends ProductVariantCreateFormData {
  attributes: FormsetData<VariantAttributeInputData, string>;
  channelListings: FormsetData<ChannelPriceData, IChannelPriceArgs>;
  stocks: ProductStockInput[];
}

export interface UseProductVariantCreateFormOpts {
  warehouses: SearchWarehouses_search_edges_node[];
  currentChannels: ChannelPriceData[];
}

export interface UseProductVariantCreateFormResult {
  change: FormChange;
  data: ProductVariantCreateData;
  disabled: boolean;
  // TODO: type FormsetChange
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

export interface ProductVariantCreateFormProps
  extends UseProductVariantCreateFormOpts {
  children: (props: UseProductVariantCreateFormResult) => React.ReactNode;
  product: ProductVariantCreateData_product;
  onSubmit: (data: ProductVariantCreateData) => void;
}

const initial: ProductVariantCreateFormData = {
  metadata: [],
  privateMetadata: [],
  sku: "",
  trackInventory: true,
  weight: ""
};

function useProductVariantCreateForm(
  product: ProductVariantCreateData_product,
  onSubmit: (data: ProductVariantCreateData) => void,
  opts: UseProductVariantCreateFormOpts
): UseProductVariantCreateFormResult {
  const [changed, setChanged] = React.useState(false);
  const triggerChange = () => setChanged(true);

  const attributeInput = getVariantAttributeInputFromProduct(product);
  const channelsInput = getChannelsInput(opts.currentChannels);

  const form = useForm(initial);
  const attributes = useFormset(attributeInput);
  const stocks = useFormset<null, string>([]);
  const channels = useFormset(channelsInput);
  const {
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

  const disabled = channels?.data.some(
    channelData =>
      validatePrice(channelData.value.price) ||
      validateCostPrice(channelData.value.costPrice)
  );

  const data: ProductVariantCreateData = {
    ...form.data,
    attributes: attributes.data,
    channelListings: channels.data,
    stocks: stocks.data
  };

  const submit = () => onSubmit(data);

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

const ProductVariantCreateForm: React.FC<ProductVariantCreateFormProps> = ({
  children,
  product,
  onSubmit,
  ...rest
}) => {
  const props = useProductVariantCreateForm(product, onSubmit, rest);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

ProductVariantCreateForm.displayName = "ProductVariantCreateForm";
export default ProductVariantCreateForm;
