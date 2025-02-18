import { ConditionItem } from "./FilterElement/ConditionOptions";
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
  timesUsed: [
    { type: "number", label: "is", value: "input-1" },
    { type: "number.range", label: "between", value: "input-2" },
  ],
  currentBalance: [
    { type: "number", label: "lower", value: "input-1" },
    { type: "number", label: "greater", value: "input-2" },
    { type: "number.range", label: "between", value: "input-3" },
  ],
  initialBalance: [
    { type: "number", label: "lower", value: "input-1" },
    { type: "number", label: "greater", value: "input-2" },
    { type: "number.range", label: "between", value: "input-3" },
  ],
  collection: [{ type: "multiselect", label: "in", value: "input-4" }],
  channel: [{ type: "select", label: "is", value: "input-5" }],
  channels: [{ type: "multiselect", label: "in", value: "input-1" }],
  productType: [
    { type: "combobox", label: "is", value: "input-1" },
    { type: "multiselect", label: "in", value: "input-2" },
  ],
  discountType: [
    { type: "select", label: "is", value: "input-1" },
    { type: "multiselect", label: "in", value: "input-2" },
  ],
  isActive: [{ type: "select", label: "is", value: "input-1" }],
  isAvailable: [{ type: "select", label: "is", value: "input-1" }],
  isPublished: [{ type: "select", label: "is", value: "input-1" }],
  isVisibleInListing: [{ type: "select", label: "is", value: "input-1" }],
  isVariantOnly: [{ type: "select", label: "is", value: "input-1" }],
  valueRequired: [{ type: "select", label: "is", value: "input-1" }],
  visibleInStorefront: [{ type: "select", label: "is", value: "input-1" }],
  filterableInStorefront: [{ type: "select", label: "is", value: "input-1" }],
  attributeType: [{ type: "select", label: "is", value: "input-1" }],
  hasCategory: [{ type: "select", label: "is", value: "input-1" }],
  giftCard: [{ type: "select", label: "is", value: "input-1" }],
  startDate: [
    { type: "datetime", label: "lower", value: "input-1" },
    { type: "datetime", label: "greater", value: "input-2" },
    { type: "datetime.range", label: "between", value: "input-3" },
  ],
  endDate: [
    { type: "datetime", label: "lower", value: "input-1" },
    { type: "datetime", label: "greater", value: "input-2" },
    { type: "datetime.range", label: "between", value: "input-3" },
  ],
  isClickAndCollect: [{ type: "select", label: "is", value: "input-1" }],
  isPreorder: [{ type: "select", label: "is", value: "input-1" }],
  giftCardUsed: [{ type: "select", label: "is", value: "input-1" }],
  giftCardBought: [{ type: "select", label: "is", value: "input-1" }],
  paymentStatus: [
    {
      type: "combobox",
      label: "is",
      value: "input-1",
    },
    {
      type: "multiselect",
      label: "in",
      value: "input-2",
    },
  ],
  status: [
    {
      type: "combobox",
      label: "is",
      value: "input-1",
    },
    {
      type: "multiselect",
      label: "in",
      value: "input-2",
    },
  ],
  voucherStatus: [
    {
      type: "combobox",
      label: "is",
      value: "input-1",
    },
    {
      type: "multiselect",
      label: "in",
      value: "input-2",
    },
  ],
  created: [
    { type: "date", label: "lower", value: "input-1" },
    { type: "date", label: "greater", value: "input-2" },
    { type: "date.range", label: "between", value: "input-3" },
  ],
  dateJoined: [
    { type: "date", label: "lower", value: "input-1" },
    { type: "date", label: "greater", value: "input-2" },
    { type: "date.range", label: "between", value: "input-3" },
  ],
  numberOfOrders: [
    { type: "number", label: "is", value: "input-1" },
    { type: "number", label: "lower", value: "input-1" },
    { type: "number", label: "greater", value: "input-2" },
    { type: "number.range", label: "between", value: "input-2" },
  ],
  started: [
    { type: "datetime", label: "lower", value: "input-1" },
    { type: "datetime", label: "greater", value: "input-2" },
    { type: "datetime.range", label: "between", value: "input-3" },
  ],
  authorizeStatus: [
    {
      type: "combobox",
      label: "is",
      value: "input-1",
    },
    {
      type: "multiselect",
      label: "in",
      value: "input-2",
    },
  ],
  chargeStatus: [
    {
      type: "combobox",
      label: "is",
      value: "input-1",
    },
    {
      type: "multiselect",
      label: "in",
      value: "input-2",
    },
  ],
  updatedAt: [
    { type: "datetime", label: "lower", value: "input-1" },
    { type: "datetime", label: "greater", value: "input-2" },
    { type: "datetime.range", label: "between", value: "input-3" },
  ],
  customer: [
    {
      type: "text",
      label: "is",
      value: "input-1",
    },
  ],
  ids: [
    {
      type: "bulkselect",
      label: "in",
      value: "input-1",
    },
  ],
  metadata: [
    {
      type: "text.double",
      label: "is",
      value: "input-1",
    },
  ],
  pageTypes: [
    {
      type: "multiselect",
      label: "in",
      value: "input-1",
    },
  ],
  currency: [
    {
      type: "select",
      label: "is",
      value: "input-1",
    },
  ],
  products: [{ type: "multiselect", label: "in", value: "input-1" }],
  tags: [{ type: "multiselect", label: "in", value: "input-1" }],
  usedBy: [{ type: "multiselect", label: "in", value: "input-1" }],
  published: [
    {
      type: "select",
      label: "is",
      value: "input-1",
    },
  ],
  slugs: [
    {
      type: "bulkselect",
      label: "in",
      value: "input-1",
    },
  ],
  typeOfProduct: [
    {
      type: "select",
      label: "is",
      value: "input-1",
    },
  ],
  configurable: [
    {
      type: "select",
      label: "is",
      value: "input-1",
    },
  ],
  staffMemberStatus: [{ type: "select", label: "is", value: "input-1" }],
};

export const CONSTRAINTS = {
  channel: {
    dependsOn: ["price", "isVisibleInListing", "isAvailable", "isPublished", "published"],
    removable: false,
    disabled: ["left", "condition"],
  },
  currency: {
    dependsOn: ["currentBalance", "initialBalance"],
    removable: false,
    disabled: ["left", "condition"],
  },
};

export const STATIC_PRODUCT_OPTIONS: LeftOperand[] = [
  { value: "price", label: "Price", type: "price", slug: "price" },
  { value: "category", label: "Category", type: "category", slug: "category" },
  {
    value: "collection",
    label: "Collection",
    type: "collection",
    slug: "collection",
  },
  { value: "channel", label: "Channel", type: "channel", slug: "channel" },
  {
    value: "productType",
    label: "ProductType",
    type: "productType",
    slug: "productType",
  },
  {
    value: "isAvailable",
    label: "IsAvailable",
    type: "isAvailable",
    slug: "isAvailable",
  },
  {
    value: "isPublished",
    label: "IsPublished",
    type: "isPublished",
    slug: "isPublished",
  },
  {
    value: "isVisibleInListing",
    label: "VisibleInListing",
    type: "isVisibleInListing",
    slug: "isVisibleInListing",
  },
  {
    value: "hasCategory",
    label: "HasCategory",
    type: "hasCategory",
    slug: "hasCategory",
  },
  {
    value: "giftCard",
    label: "IsGiftcard",
    type: "giftCard",
    slug: "giftCard",
  },
];

export const STATIC_DISCOUNT_OPTIONS: LeftOperand[] = [
  {
    value: "startDate",
    label: "Start date",
    type: "startDate",
    slug: "startDate",
  },
  {
    value: "endDate",
    label: "End date",
    type: "endDate",
    slug: "endDate",
  },
];

export const STATIC_ORDER_OPTIONS: LeftOperand[] = [
  {
    value: "ids",
    label: "IDs",
    type: "ids",
    slug: "ids",
  },
  { value: "channels", label: "Channels", type: "channels", slug: "channels" },
  {
    value: "paymentStatus",
    label: "Payment status",
    type: "paymentStatus",
    slug: "paymentStatus",
  },
  {
    value: "status",
    label: "Fulfillment Status",
    type: "status",
    slug: "status",
  },
  {
    value: "created",
    label: "Creation date",
    type: "created",
    slug: "created",
  },
  {
    value: "authorizeStatus",
    label: "Authorize status",
    type: "authorizeStatus",
    slug: "authorizeStatus",
  },
  {
    value: "chargeStatus",
    label: "Charge status",
    type: "chargeStatus",
    slug: "chargeStatus",
  },
  {
    value: "updatedAt",
    label: "Updated at",
    type: "updatedAt",
    slug: "updatedAt",
  },
  {
    value: "isClickAndCollect",
    label: "Click and collect",
    type: "isClickAndCollect",
    slug: "isClickAndCollect",
  },
  {
    value: "isPreorder",
    label: "Preorder",
    type: "isPreorder",
    slug: "isPreorder",
  },
  {
    value: "giftCardBought",
    label: "Gift card bought",
    type: "giftCardBought",
    slug: "giftCardBought",
  },
  {
    value: "giftCardUsed",
    label: "Gift card used",
    type: "giftCardUsed",
    slug: "giftCardUsed",
  },
  {
    value: "customer",
    label: "Customer",
    type: "customer",
    slug: "customer",
  },
  {
    value: "metadata",
    label: "Metadata",
    type: "metadata",
    slug: "metadata",
  },
];

export const STATIC_VOUCHER_OPTIONS: LeftOperand[] = [
  {
    value: "channel",
    label: "Channel",
    type: "channel",
    slug: "channel",
  },
  {
    value: "discountType",
    label: "Discount type",
    type: "discountType",
    slug: "discountType",
  },
  {
    value: "started",
    label: "Started",
    type: "startDate",
    slug: "started",
  },
  {
    value: "voucherStatus",
    label: "Status",
    type: "voucherStatus",
    slug: "voucherStatus",
  },
  {
    value: "timesUsed",
    label: "Times used",
    type: "timesUsed",
    slug: "timesUsed",
  },
];

export const STATIC_COLLECTION_OPTIONS: LeftOperand[] = [
  {
    value: "published",
    label: "Is published",
    type: "published",
    slug: "published",
  },
  {
    value: "metadata",
    label: "Metadata",
    type: "metadata",
    slug: "metadata",
  },
  {
    value: "channel",
    label: "Channel",
    type: "channel",
    slug: "channel",
  },
];

export const STATIC_PAGE_OPTIONS: LeftOperand[] = [
  {
    value: "pageTypes",
    label: "Page types",
    type: "pageTypes",
    slug: "pageTypes",
  },
];

export const STATIC_DRAFT_ORDER_OPTIONS: LeftOperand[] = [
  {
    value: "customer",
    label: "Customer",
    type: "customer",
    slug: "customer",
  },
  {
    value: "created",
    label: "Creation date",
    type: "created",
    slug: "created",
  },
];

export const STATIC_GIFT_CARDS_OPTIONS: LeftOperand[] = [
  {
    value: "currency",
    label: "Currency",
    type: "currency",
    slug: "currency",
  },
  {
    value: "currentBalance",
    label: "Current balance",
    type: "currentBalance",
    slug: "currentBalance",
  },
  {
    value: "initialBalance",
    label: "Initial balance",
    type: "initialBalance",
    slug: "initialBalance",
  },
  {
    value: "products",
    label: "Products",
    type: "products",
    slug: "products",
  },
  {
    value: "isActive",
    label: "Is active",
    type: "isActive",
    slug: "isActive",
  },
  {
    value: "tags",
    label: "Tags",
    type: "tags",
    slug: "tags",
  },
  {
    value: "usedBy",
    label: "Used by",
    type: "usedBy",
    slug: "usedBy",
  },
];

export const STATIC_CUSTOMER_OPTIONS: LeftOperand[] = [
  {
    value: "dateJoined",
    label: "Join date",
    type: "dateJoined",
    slug: "dateJoined",
  },
  {
    value: "numberOfOrders",
    label: "Number of orders",
    type: "numberOfOrders",
    slug: "numberOfOrders",
  },
];

export const STATIC_PRODUCT_TYPES_OPTIONS: LeftOperand[] = [
  {
    value: "configurable",
    label: "Has variant attributes",
    type: "configurable",
    slug: "configurable",
  },
  {
    value: "typeOfProduct",
    label: "Type",
    type: "typeOfProduct",
    slug: "typeOfProduct",
  },
];

export const STAFF_MEMBER_OPTIONS: LeftOperand[] = [
  {
    value: "staffMemberStatus",
    label: "Status",
    type: "staffMemberStatus",
    slug: "staffMemberStatus",
  },
];

export const STATIC_ATTRIBUTES_OPTIONS: LeftOperand[] = [
  {
    value: "filterableInStorefront",
    label: "Filterable in Storefront",
    type: "filterableInStorefront",
    slug: "filterableInStorefront",
  },
  {
    value: "isVariantOnly",
    label: "Variant only",
    type: "isVariantOnly",
    slug: "isVariantOnly",
  },
  {
    value: "valueRequired",
    label: "Is required",
    type: "valueRequired",
    slug: "valueRequired",
  },
  {
    value: "visibleInStorefront",
    label: "Visible in Storefront",
    type: "visibleInStorefront",
    slug: "visibleInStorefront",
  },
  {
    value: "attributeType",
    label: "Type",
    type: "attributeType",
    slug: "attributeType",
  },
  {
    value: "channel",
    label: "Channel",
    type: "channel",
    slug: "channel",
  },
];

export const STATIC_OPTIONS = [
  ...STATIC_PRODUCT_OPTIONS,
  ...STATIC_DISCOUNT_OPTIONS,
  ...STATIC_ORDER_OPTIONS,
  ...STATIC_VOUCHER_OPTIONS,
  ...STATIC_PAGE_OPTIONS,
  ...STATIC_DRAFT_ORDER_OPTIONS,
  ...STATIC_GIFT_CARDS_OPTIONS,
  ...STATIC_CUSTOMER_OPTIONS,
  ...STATIC_COLLECTION_OPTIONS,
  ...STATIC_PRODUCT_TYPES_OPTIONS,
  ...STAFF_MEMBER_OPTIONS,
  ...STATIC_ATTRIBUTES_OPTIONS,
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
  DATE_TIME: [
    { type: "datetime", label: "lower", value: "input-2" },
    { type: "datetime", label: "greater", value: "input-3" },
    { type: "datetime.range", label: "between", value: "input-4" },
  ],
  DATE: [
    { type: "date", label: "lower", value: "input-1" },
    { type: "date", label: "greater", value: "input-2" },
    { type: "date.range", label: "between", value: "input-4" },
  ],
  SWATCH: [{ type: "multiselect", label: "in", value: "input-2" }],
};

export const getAttributeInputType = (item: ConditionItem | null) => {
  const result = Object.entries(ATTRIBUTE_INPUT_TYPE_CONDITIONS).find(([_, value]) =>
    value.find(entry => entry.type === item?.type && entry.label === item.label),
  );

  return result && result[0];
};

export type RowType = keyof typeof STATIC_CONDITIONS | "attribute";

export const booleanOptionTrue = (type?: string) => ({
  label: "Yes",
  value: "true",
  slug: "true",
  ...{ type },
});

export const booleanOptionFalse = (type?: string) => ({
  label: "No",
  value: "false",
  slug: "false",
  ...{ type },
});

export const createBooleanOptions = (type?: string): ItemOption[] => [
  booleanOptionTrue(type),
  booleanOptionFalse(type),
];

export const createBooleanOption = (flag: boolean, type?: string): ItemOption => {
  if (flag) return booleanOptionTrue(type);

  return booleanOptionFalse(type);
};
