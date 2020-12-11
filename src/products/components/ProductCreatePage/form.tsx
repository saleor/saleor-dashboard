import { OutputData } from "@editorjs/editorjs";
import { ChannelData, ChannelPriceArgs } from "@saleor/channels/utils";
import {
  AttributeInput,
  AttributeInputData
} from "@saleor/components/Attributes";
import { MetadataFormData } from "@saleor/components/Metadata";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { RichTextEditorChange } from "@saleor/components/RichTextEditor";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import useForm, { FormChange } from "@saleor/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import {
  getAttributeInputFromProductType,
  getAttributesDisplayData,
  ProductType
} from "@saleor/products/utils/data";
import {
  createAttributeChangeHandler,
  createAttributeFileChangeHandler,
  createAttributeMultiChangeHandler,
  createChannelsChangeHandler,
  createChannelsPriceChangeHandler,
  createProductTypeSelectHandler
} from "@saleor/products/utils/handlers";
import {
  validateCostPrice,
  validatePrice
} from "@saleor/products/utils/validation";
import { SearchProductTypes_search_edges_node } from "@saleor/searches/types/SearchProductTypes";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import createMultiAutocompleteSelectHandler from "@saleor/utils/handlers/multiAutocompleteSelectChangeHandler";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import useRichText from "@saleor/utils/richText/useRichText";
import React from "react";

import { ProductStockInput } from "../ProductStocks";

export interface ProductCreateFormData extends MetadataFormData {
  category: string;
  changeTaxCode: boolean;
  channelListings: ChannelData[];
  chargeTaxes: boolean;
  collections: string[];
  description: OutputData;
  isAvailable: boolean;
  name: string;
  productType: ProductType;
  rating: number;
  seoDescription: string;
  seoTitle: string;
  sku: string;
  slug: string;
  stockQuantity: number;
  taxCode: string;
  trackInventory: boolean;
  weight: string;
}
export interface ProductCreateData extends ProductCreateFormData {
  attributes: AttributeInput[];
  attributesWithNewFileValue: FormsetData<null, File>;
  stocks: ProductStockInput[];
}

interface ProductCreateHandlers
  extends Record<
      | "changeMetadata"
      | "selectCategory"
      | "selectCollection"
      | "selectProductType"
      | "selectTaxRate",
      FormChange
    >,
    Record<
      "changeStock" | "selectAttribute" | "selectAttributeMultiple",
      FormsetChange<string>
    >,
    Record<"changeChannelPrice", (id: string, data: ChannelPriceArgs) => void>,
    Record<
      "changeChannels",
      (
        id: string,
        data: Omit<ChannelData, "name" | "price" | "currency" | "id">
      ) => void
    >,
    Record<"selectAttributeFile", FormsetChange<File>>,
    Record<"addStock" | "deleteStock", (id: string) => void> {
  changeDescription: RichTextEditorChange;
}
export interface UseProductCreateFormResult {
  change: FormChange;
  data: ProductCreateData;
  disabled: boolean;
  handlers: ProductCreateHandlers;
  hasChanged: boolean;
  submit: () => Promise<boolean>;
}

export interface UseProductCreateFormOpts
  extends Record<
    "categories" | "collections" | "taxTypes",
    SingleAutocompleteChoiceType[]
  > {
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  setSelectedCollections: React.Dispatch<
    React.SetStateAction<MultiAutocompleteChoiceType[]>
  >;
  setSelectedTaxType: React.Dispatch<React.SetStateAction<string>>;
  setChannels: (channels: ChannelData[]) => void;
  selectedCollections: MultiAutocompleteChoiceType[];
  productTypes: SearchProductTypes_search_edges_node[];
  warehouses: SearchWarehouses_search_edges_node[];
  currentChannels: ChannelData[];
  productTypeChoiceList: SearchProductTypes_search_edges_node[];
}

export interface ProductCreateFormProps extends UseProductCreateFormOpts {
  children: (props: UseProductCreateFormResult) => React.ReactNode;
  initial?: Partial<ProductCreateFormData>;
  onSubmit: (data: ProductCreateData) => Promise<boolean>;
}

function useProductCreateForm(
  initial: Partial<ProductCreateFormData>,
  onSubmit: (data: ProductCreateData) => Promise<boolean>,
  opts: UseProductCreateFormOpts
): UseProductCreateFormResult {
  const defaultInitialFormData: ProductCreateFormData &
    Record<"productType", string> = {
    category: "",
    changeTaxCode: false,
    channelListings: opts.currentChannels,
    chargeTaxes: false,
    collections: [],
    description: null,
    isAvailable: false,
    metadata: [],
    name: "",
    privateMetadata: [],
    productType: null,
    rating: 0,
    seoDescription: "",
    seoTitle: "",
    sku: "",
    slug: "",
    stockQuantity: null,
    taxCode: null,
    trackInventory: false,
    weight: ""
  };

  const initialProductType =
    opts.productTypes?.find(
      productType => initial?.productType?.id === productType.id
    ) || null;

  const [changed, setChanged] = React.useState(false);
  const triggerChange = () => setChanged(true);

  const form = useForm({
    ...initial,
    ...defaultInitialFormData
  });
  const attributes = useFormset<AttributeInputData>(
    initial?.productType
      ? getAttributeInputFromProductType(initialProductType)
      : []
  );
  const attributesWithNewFileValue = useFormset<null, File>([]);
  const stocks = useFormset<null, string>([]);
  const [productType, setProductType] = useStateFromProps<ProductType>(
    initialProductType || null
  );
  const [description, changeDescription] = useRichText({
    initial: null,
    triggerChange
  });

  const {
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const handleChange: FormChange = (event, cb) => {
    form.change(event, cb);
    triggerChange();
  };
  const handleCollectionSelect = createMultiAutocompleteSelectHandler(
    form.toggleValue,
    opts.setSelectedCollections,
    opts.selectedCollections,
    opts.collections
  );
  const handleCategorySelect = createSingleAutocompleteSelectHandler(
    handleChange,
    opts.setSelectedCategory,
    opts.categories
  );
  const handleAttributeChange = createAttributeChangeHandler(
    attributes.change,
    triggerChange
  );
  const handleAttributeMultiChange = createAttributeMultiChangeHandler(
    attributes.change,
    attributes.data,
    triggerChange
  );
  const handleAttributeFileChange = createAttributeFileChangeHandler(
    attributes.change,
    attributesWithNewFileValue.data,
    attributesWithNewFileValue.add,
    attributesWithNewFileValue.change,
    triggerChange
  );
  const handleProductTypeSelect = createProductTypeSelectHandler(
    attributes.set,
    setProductType,
    opts.productTypes,
    triggerChange
  );
  const handleStockChange: FormsetChange<string> = (id, value) => {
    triggerChange();
    stocks.change(id, value);
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
  const handleStockDelete = (id: string) => {
    triggerChange();
    stocks.remove(id);
  };
  const handleTaxTypeSelect = createSingleAutocompleteSelectHandler(
    handleChange,
    opts.setSelectedTaxType,
    opts.taxTypes
  );
  const changeMetadata = makeMetadataChangeHandler(handleChange);
  const handleChannelsChange = createChannelsChangeHandler(
    opts.currentChannels,
    opts.setChannels,
    triggerChange
  );
  const handleChannelPriceChange = createChannelsPriceChangeHandler(
    opts.currentChannels,
    opts.setChannels,
    triggerChange
  );

  const getData = (): ProductCreateData => ({
    ...form.data,
    attributes: getAttributesDisplayData(
      attributes.data,
      attributesWithNewFileValue.data
    ),
    attributesWithNewFileValue: attributesWithNewFileValue.data,
    description: description.current,
    productType,
    stocks: stocks.data
  });
  const data = getData();
  const submit = () => onSubmit(data);

  const productTypeChoice = opts.productTypeChoiceList?.find(
    choice => choice.id === data.productType?.id
  );

  const disabled =
    !productTypeChoice?.hasVariants &&
    (!data.sku ||
      data.channelListings.some(
        channel =>
          validatePrice(channel.price) || validateCostPrice(channel.costPrice)
      ));

  return {
    change: handleChange,
    data,
    disabled,
    handlers: {
      addStock: handleStockAdd,
      changeChannelPrice: handleChannelPriceChange,
      changeChannels: handleChannelsChange,
      changeDescription,
      changeMetadata,
      changeStock: handleStockChange,
      deleteStock: handleStockDelete,
      selectAttribute: handleAttributeChange,
      selectAttributeFile: handleAttributeFileChange,
      selectAttributeMultiple: handleAttributeMultiChange,
      selectCategory: handleCategorySelect,
      selectCollection: handleCollectionSelect,
      selectProductType: handleProductTypeSelect,
      selectTaxRate: handleTaxTypeSelect
    },
    hasChanged: changed,
    submit
  };
}

const ProductCreateForm: React.FC<ProductCreateFormProps> = ({
  children,
  initial,
  onSubmit,
  ...rest
}) => {
  const props = useProductCreateForm(initial || {}, onSubmit, rest);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

ProductCreateForm.displayName = "ProductCreateForm";
export default ProductCreateForm;
