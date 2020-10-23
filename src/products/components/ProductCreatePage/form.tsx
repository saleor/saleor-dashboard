import { MetadataFormData } from "@saleor/components/Metadata";
import { MultiAutocompleteChoiceType } from "@saleor/components/MultiAutocompleteSelectField";
import { SingleAutocompleteChoiceType } from "@saleor/components/SingleAutocompleteSelectField";
import useForm, { FormChange } from "@saleor/hooks/useForm";
import useFormset, { FormsetChange } from "@saleor/hooks/useFormset";
import useStateFromProps from "@saleor/hooks/useStateFromProps";
import {
  getAttributeInputFromProductType,
  ProductType
} from "@saleor/products/utils/data";
import {
  createAttributeChangeHandler,
  createAttributeMultiChangeHandler,
  createProductTypeSelectHandler
} from "@saleor/products/utils/handlers";
import { SearchWarehouses_search_edges_node } from "@saleor/searches/types/SearchWarehouses";
import createMultiAutocompleteSelectHandler from "@saleor/utils/handlers/multiAutocompleteSelectChangeHandler";
import createSingleAutocompleteSelectHandler from "@saleor/utils/handlers/singleAutocompleteSelectChangeHandler";
import useMetadataChangeTrigger from "@saleor/utils/metadata/useMetadataChangeTrigger";
import { RawDraftContentState } from "draft-js";
import React from "react";

import { SearchProductTypes_search_edges_node } from "../../../searches/types/SearchProductTypes";
import {
  ProductAttributeInput,
  ProductAttributeInputData
} from "../ProductAttributes";
import { ProductStockInput } from "../ProductStocks";

export interface ProductCreateFormData extends MetadataFormData {
  availableForPurchase: string;
  basePrice: number;
  category: string;
  changeTaxCode: boolean;
  chargeTaxes: boolean;
  collections: string[];
  description: RawDraftContentState;
  isAvailable: boolean;
  isAvailableForPurchase: boolean;
  isPublished: boolean;
  name: string;
  productType: ProductType;
  publicationDate: string;
  seoDescription: string;
  seoTitle: string;
  sku: string;
  slug: string;
  stockQuantity: number;
  taxCode: string;
  trackInventory: boolean;
  visibleInListings: boolean;
  weight: string;
}
export interface ProductCreateData extends ProductCreateFormData {
  attributes: ProductAttributeInput[];
  stocks: ProductStockInput[];
}

type ProductCreateHandlers = Record<
  | "changeMetadata"
  | "selectCategory"
  | "selectCollection"
  | "selectProductType"
  | "selectTaxRate",
  FormChange
> &
  Record<
    "changeStock" | "selectAttribute" | "selectAttributeMultiple",
    FormsetChange<string>
  > &
  Record<"addStock" | "deleteStock", (id: string) => void>;
export interface UseProductCreateFormResult {
  change: FormChange;
  data: ProductCreateData;
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
  selectedCollections: MultiAutocompleteChoiceType[];
  productTypes: SearchProductTypes_search_edges_node[];
  warehouses: SearchWarehouses_search_edges_node[];
}

export interface ProductCreateFormProps extends UseProductCreateFormOpts {
  children: (props: UseProductCreateFormResult) => React.ReactNode;
  initial?: Partial<ProductCreateFormData>;
  onSubmit: (data: ProductCreateData) => Promise<boolean>;
}

const defaultInitialFormData: ProductCreateFormData &
  Record<"productType", string> = {
  availableForPurchase: "",
  basePrice: 0,
  category: "",
  changeTaxCode: false,
  chargeTaxes: false,
  collections: [],
  description: {} as any,
  isAvailable: false,
  isAvailableForPurchase: false,
  isPublished: false,
  metadata: [],
  name: "",
  privateMetadata: [],
  productType: null,
  publicationDate: "",
  seoDescription: "",
  seoTitle: "",
  sku: null,
  slug: "",
  stockQuantity: null,
  taxCode: null,
  trackInventory: false,
  visibleInListings: false,
  weight: ""
};

function useProductCreateForm(
  initial: Partial<ProductCreateFormData>,
  onSubmit: (data: ProductCreateData) => Promise<boolean>,
  opts: UseProductCreateFormOpts
): UseProductCreateFormResult {
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
  const attributes = useFormset<ProductAttributeInputData>(
    initial?.productType
      ? getAttributeInputFromProductType(initialProductType)
      : []
  );
  const stocks = useFormset<null, string>([]);
  const [productType, setProductType] = useStateFromProps<ProductType>(
    initialProductType || null
  );

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

  const data: ProductCreateData = {
    ...form.data,
    attributes: attributes.data,
    productType,
    stocks: stocks.data
  };
  const submit = () => onSubmit(data);

  return {
    change: handleChange,
    data,
    handlers: {
      addStock: handleStockAdd,
      changeMetadata,
      changeStock: handleStockChange,
      deleteStock: handleStockDelete,
      selectAttribute: handleAttributeChange,
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
