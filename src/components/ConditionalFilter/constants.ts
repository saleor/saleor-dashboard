import { ItemOption } from "./FilterElement/ConditionValue";
import { LeftOperand } from "./LeftOperandsProvider";

export const STATIC_CONDITIONS = {
  category: [
    { type: "combobox", label: "is", value: "input-1" },
    { type: "multiselect", label: "in", value: "input-2" },
  ],
  price: [
    { type: "number", label: "is", value: "input-1" },
    { type: "number", label: "lower", value: "input-2" },
    { type: "number", label: "greater", value: "input-3" },
    { type: "number.range", label: "between", value: "input-4" },
  ],
  collection: [{ type: "multiselect", label: "in", value: "input-4" }],
  channel: [{ type: "select", label: "is", value: "input-5" }],
  productType: [
    { type: "combobox", label: "is", value: "input-1" },
    { type: "multiselect", label: "in", value: "input-2" }
  ],
  isAvailable: [{ type: "select", label: "is", value: "input-1" }],
  isPublished: [{ type: "select", label: "is", value: "input-1" }],
  isVisibleInListing: [{ type: "select", label: "is", value: "input-1" }],
  hasCategory: [{ type: "select", label: "is", value: "input-1" }],
  giftCard: [{ type: "select", label: "is", value: "input-1" }],
};

export const STATIC_OPTIONS: LeftOperand[] = [
  { value: "price", label: "Price", type: "price", slug: "price" },
  { value: "category", label: "Category", type: "category", slug: "category" },
  {
    value: "collection",
    label: "Collection",
    type: "collection",
    slug: "collection",
  },
  { value: "channel", label: "Channel", type: "channel", slug: "channel" },
  { value: "productType", label: "Product Type", type: "productType", slug: "productType" },
  { value: "isAvailable", label: "Is available", type: "isAvailable", slug: "isAvailable" },
  { value: "isPublished", label: "Is published", type: "isPublished", slug: "isPublished" },
  { value: "isVisibleInListing", label: "Visible in listing", type: "isVisibleInListing", slug: "isVisibleInListing" },
  { value: "hasCategory", label: "Has category", type: "hasCategory", slug: "hasCategory" },
  { value: "giftCard", label: "Has giftcard", type: "giftCard", slug: "giftCard" },
];

export const ATTRIBUTE_INPUT_TYPE_CONDITIONS = {
  DROPDOWN: [{ type: "multiselect", label: "in", value: "input-2" }],
  MULTISELECT: [{ type: "multiselect", label: "in", value: "input-2" }],
  BOOLEAN: [{ type: "select", label: "is", value: "input-5" }],
  NUMERIC: [
    { type: "number", label: "is", value: "input-1" },
    { type: "number", label: "lower", value: "input-2" },
    { type: "number", label: "greater", value: "input-3" },
    { type: "number.range", label: "between", value: "input-4" },
  ],
  DATE_TIME: [{ type: "date", label: "is", value: "input-1" }],
  DATE: [{ type: "date", label: "is", value: "input-1" }],
  SWATCH: [{ type: "multiselect", label: "in", value: "input-2" }],
};


export type RowType = keyof typeof STATIC_CONDITIONS | "attribute"

export const createBooleanOptions = (): ItemOption[] => [
  {
    label: "Yes",
    value: "true",
    slug: "true"
  },
  {
    label: "No",
    value: "false",
    slug: "false"
  }
]