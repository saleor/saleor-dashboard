import { OutputData } from "@editorjs/editorjs";
import { ChannelData, ChannelPriceArgs } from "@saleor/channels/utils";
import { AttributeInput } from "@saleor/components/Attributes";
import { MetadataFormData } from "@saleor/components/Metadata";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { RichTextEditorChange } from "@saleor/components/RichTextEditor";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import useForm, { FormChange, SubmitPromise } from "@saleor/hooks/useForm";
import useFormset, {
  FormsetAtomicData,
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import { ProductDetails_product } from "@saleor/products/types/ProductDetails";
import {
  getAttributeInputFromProduct,
  getAttributesDisplayData,
  getProductUpdatePageFormData,
  getStockInputFromProduct
} from "@saleor/products/utils/data";
import {
  createAttributeChangeHandler,
  createAttributeFileChangeHandler,
  createAttributeMultiChangeHandler,
  createChannelsChangeHandler,
  createChannelsPriceChangeHandler
} from "@saleor/products/utils/handlers";
import {
  validateCostPrice,
  validatePrice
} from "@saleor/products/utils/validation";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import createMultiAutocompleteSelectHandler from "@saleor/utils/handlers/multiAutocompleteSelectChangeHandler";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import getMetadata from "@saleor/utils/metadata/getMetadata";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import useRichText from "@saleor/utils/richText/useRichText";
import { diff } from "fast-array-diff";
import React from "react";

import { ProductStockFormsetData, ProductStockInput } from "../ProductStocks";

export interface ProductUpdateFormData extends MetadataFormData {
  category: string | null;
  changeTaxCode: boolean;
  channelListings: ChannelData[];
  chargeTaxes: boolean;
  collections: string[];
  isAvailable: boolean;
  name: string;
  rating: number;
  slug: string;
  seoDescription: string;
  seoTitle: string;
  sku: string;
  taxCode: string;
  trackInventory: boolean;
  weight: string;
}
export interface FileAttributeInputData {
  attributeId: string;
  file: File;
}
export type FileAttributeInput = FormsetAtomicData<
  FileAttributeInputData,
  string[]
>;

export interface FileAttributesSubmitData {
  fileAttributes: FileAttributeInput[];
}
export interface ProductUpdateData extends ProductUpdateFormData {
  attributes: AttributeInput[];
  description: OutputData;
  stocks: ProductStockInput[];
}
export interface ProductUpdateSubmitData extends ProductUpdateFormData {
  attributes: AttributeInput[];
  attributesWithNewFileValue: FormsetData<null, File>;
  collections: string[];
  description: OutputData;
  addStocks: ProductStockInput[];
  updateStocks: ProductStockInput[];
  removeStocks: string[];
}

interface ProductUpdateHandlers
  extends Record<
      | "changeMetadata"
      | "selectCategory"
      | "selectCollection"
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
export interface UseProductUpdateFormResult {
  change: FormChange;

  data: ProductUpdateData;
  disabled: boolean;
  handlers: ProductUpdateHandlers;
  hasChanged: boolean;
  submit: () => Promise<boolean>;
}

export interface UseProductUpdateFormOpts
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
  warehouses: SearchWarehouses_search_edges_node[];
  currentChannels: ChannelData[];
  hasVariants: boolean;
}

export interface ProductUpdateFormProps extends UseProductUpdateFormOpts {
  children: (props: UseProductUpdateFormResult) => React.ReactNode;
  product: ProductDetails_product;
  onSubmit: (data: ProductUpdateSubmitData) => SubmitPromise;
}

const getStocksData = (
  product: ProductDetails_product,
  stocks: FormsetData<ProductStockFormsetData, string>
) => {
  if (product?.productType?.hasVariants) {
    return { addStocks: [], removeStocks: [], updateStocks: [] };
  }

  const dataStocks = stocks.map(stock => stock.id);
  const variantStocks =
    product?.variants[0]?.stocks.map(stock => stock.warehouse.id) || [];
  const stockDiff = diff(variantStocks, dataStocks);

  return {
    addStocks: stocks.filter(stock =>
      stockDiff.added.some(addedStock => addedStock === stock.id)
    ),
    removeStocks: stockDiff.removed,
    updateStocks: stocks.filter(
      stock => !stockDiff.added.some(addedStock => addedStock === stock.id)
    )
  };
};

function useProductUpdateForm(
  product: ProductDetails_product,
  onSubmit: (data: ProductUpdateSubmitData) => SubmitPromise,
  opts: UseProductUpdateFormOpts
): UseProductUpdateFormResult {
  const [changed, setChanged] = React.useState(false);
  const triggerChange = () => setChanged(true);

  const form = useForm(
    getProductUpdatePageFormData(
      product,
      product?.variants,
      opts.currentChannels
    )
  );
  const attributes = useFormset(getAttributeInputFromProduct(product));
  const attributesWithNewFileValue = useFormset<null, File>([]);
  const stocks = useFormset(getStockInputFromProduct(product));
  const [description, changeDescription] = useRichText({
    initial: product?.descriptionJson,
    triggerChange
  });

  const {
    isMetadataModified,
    isPrivateMetadataModified,
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

  const data: ProductUpdateData = {
    ...form.data,
    attributes: getAttributesDisplayData(
      attributes.data,
      attributesWithNewFileValue.data
    ),
    description: description.current,
    stocks: stocks.data
  };
  // Need to make it function to always have description.current up to date
  const getSubmitData = (): ProductUpdateSubmitData => ({
    ...data,
    ...getStocksData(product, stocks.data),
    ...getMetadata(data, isMetadataModified, isPrivateMetadataModified),
    addStocks: [],
    attributes: attributes.data,
    attributesWithNewFileValue: attributesWithNewFileValue.data,
    description: description.current
  });

  const handleSubmit = async (data: ProductUpdateSubmitData) => {
    const errors = await onSubmit(data);

    if (!errors?.length) {
      attributesWithNewFileValue.set([]);
    }

    return errors;
  };

  const submit = async () =>
    handleFormSubmit(getSubmitData(), handleSubmit, setChanged);

  const disabled =
    !opts.hasVariants &&
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
      selectTaxRate: handleTaxTypeSelect
    },
    hasChanged: changed,
    submit
  };
}

const ProductUpdateForm: React.FC<ProductUpdateFormProps> = ({
  children,
  product,
  onSubmit,
  ...rest
}) => {
  const props = useProductUpdateForm(product, onSubmit, rest);

  return <form onSubmit={props.submit}>{children(props)}</form>;
};

ProductUpdateForm.displayName = "ProductUpdateForm";
export default ProductUpdateForm;
