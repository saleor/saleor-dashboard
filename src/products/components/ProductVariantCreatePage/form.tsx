import { getAttributesDisplayData } from "@saleor/attributes/utils/data";
import {
  createAttributeChangeHandler,
  createAttributeFileChangeHandler,
  createAttributeMultiChangeHandler,
  createAttributeReferenceChangeHandler,
  createAttributeValueReorderHandler,
  createFetchMoreReferencesHandler,
  createFetchReferencesHandler
} from "@saleor/attributes/utils/handlers";
import { ChannelPriceData } from "@saleor/channels/utils";
import { AttributeInput } from "@saleor/components/Attributes";
import { ExitFormDialogContext } from "@saleor/components/Form/ExitFormDialogProvider";
import { MetadataFormData } from "@saleor/components/Metadata";
import useForm, {
  CommonUseFormResultWithHandlers,
  FormChange
} from "@saleor/hooks/useForm";
import useFormset, {
  FormsetChange,
  FormsetData
} from "@saleor/hooks/useFormset";
import { ProductVariantCreateData_product } from "@saleor/products/types/ProductVariantCreateData";
import { getVariantAttributeInputFromProduct } from "@saleor/products/utils/data";
import { SearchPages_search_edges_node } from "@saleor/searches/types/SearchPages";
import { SearchProducts_search_edges_node } from "@saleor/searches/types/SearchProducts";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import { FetchMoreProps, ReorderEvent } from "@saleor/types";
import handleFormSubmit from "@saleor/utils/handlers/handleFormSubmit";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import React, { useContext, useEffect } from "react";

import { ProductStockFormsetData, ProductStockInput } from "../ProductStocks";

export interface ProductVariantCreateFormData extends MetadataFormData {
  sku: string;
  trackInventory: boolean;
  weight: string;
}
export interface ProductVariantCreateData extends ProductVariantCreateFormData {
  attributes: AttributeInput[];
  attributesWithNewFileValue: FormsetData<null, File>;
  stocks: ProductStockInput[];
}

export interface UseProductVariantCreateFormOpts {
  warehouses: SearchWarehouses_search_edges_node[];
  currentChannels: ChannelPriceData[];
  referencePages: SearchPages_search_edges_node[];
  referenceProducts: SearchProducts_search_edges_node[];
  fetchReferencePages?: (data: string) => void;
  fetchMoreReferencePages?: FetchMoreProps;
  fetchReferenceProducts?: (data: string) => void;
  fetchMoreReferenceProducts?: FetchMoreProps;
  assignReferencesAttributeId?: string;
}

export interface ProductVariantCreateHandlers
  extends Record<
      "changeStock" | "selectAttribute" | "selectAttributeMultiple",
      FormsetChange
    >,
    Record<"selectAttributeReference", FormsetChange<string[]>>,
    Record<"selectAttributeFile", FormsetChange<File>>,
    Record<"reorderAttributeValue", FormsetChange<ReorderEvent>>,
    Record<"addStock" | "deleteStock", (id: string) => void> {
  changeMetadata: FormChange;
  fetchReferences: (value: string) => void;
  fetchMoreReferences: FetchMoreProps;
}

export interface UseProductVariantCreateFormResult
  extends CommonUseFormResultWithHandlers<
    ProductVariantCreateData,
    ProductVariantCreateHandlers
  > {
  disabled: boolean;
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
  const attributeInput = getVariantAttributeInputFromProduct(product);

  const {
    setChanged,
    triggerChange,
    handleChange,
    hasChanged,
    data: formData
  } = useForm(initial, undefined, { confirmLeave: true });
  const attributes = useFormset(attributeInput);
  const attributesWithNewFileValue = useFormset<null, File>([]);
  const stocks = useFormset<ProductStockFormsetData, string>([]);

  const { setExitDialogSubmitRef, setEnableExitDialog } = useContext(
    ExitFormDialogContext
  );

  const {
    makeChangeHandler: makeMetadataChangeHandler
  } = useMetadataChangeTrigger();

  const changeMetadata = makeMetadataChangeHandler(handleChange);
  const handleAttributeChange = createAttributeChangeHandler(
    attributes.change,
    triggerChange
  );
  const handleAttributeMultiChange = createAttributeMultiChangeHandler(
    attributes.change,
    attributes.data,
    triggerChange
  );
  const handleAttributeReferenceChange = createAttributeReferenceChangeHandler(
    attributes.change,
    triggerChange
  );
  const handleFetchReferences = createFetchReferencesHandler(
    attributes.data,
    opts.assignReferencesAttributeId,
    opts.fetchReferencePages,
    opts.fetchReferenceProducts
  );
  const handleFetchMoreReferences = createFetchMoreReferencesHandler(
    attributes.data,
    opts.assignReferencesAttributeId,
    opts.fetchMoreReferencePages,
    opts.fetchMoreReferenceProducts
  );
  const handleAttributeFileChange = createAttributeFileChangeHandler(
    attributes.change,
    attributesWithNewFileValue.data,
    attributesWithNewFileValue.add,
    attributesWithNewFileValue.change,
    triggerChange
  );
  const handleAttributeValueReorder = createAttributeValueReorderHandler(
    attributes.change,
    attributes.data,
    triggerChange
  );
  const handleStockAdd = (id: string) => {
    triggerChange();
    stocks.add({
      data: {
        quantityAllocated: 0
      },
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

  const data: ProductVariantCreateData = {
    ...formData,
    attributes: getAttributesDisplayData(
      attributes.data,
      attributesWithNewFileValue.data,
      opts.referencePages,
      opts.referenceProducts
    ),
    attributesWithNewFileValue: attributesWithNewFileValue.data,
    stocks: stocks.data
  };

  const submit = () =>
    handleFormSubmit(data, onSubmit, setChanged, setEnableExitDialog);

  useEffect(() => setExitDialogSubmitRef(submit), [submit]);

  return {
    change: handleChange,
    data,
    disabled: false,
    handlers: {
      addStock: handleStockAdd,
      changeMetadata,
      changeStock: handleStockChange,
      deleteStock: handleStockDelete,
      fetchMoreReferences: handleFetchMoreReferences,
      fetchReferences: handleFetchReferences,
      reorderAttributeValue: handleAttributeValueReorder,
      selectAttribute: handleAttributeChange,
      selectAttributeFile: handleAttributeFileChange,
      selectAttributeMultiple: handleAttributeMultiChange,
      selectAttributeReference: handleAttributeReferenceChange
    },
    hasChanged,
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
