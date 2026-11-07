import { defineMessages, type IntlShape, type MessageDescriptor } from "react-intl";

import { STATIC_OPTIONS } from "./constants";
import { type ConditionItem, ConditionOptions } from "./FilterElement/ConditionOptions";

const staticFilterMessages: Partial<Record<string, MessageDescriptor>> = defineMessages({
  Price: {
    id: "b1zuN9",
    defaultMessage: "Price",
  },
  Category: {
    id: "ccXLVi",
    defaultMessage: "Category",
  },
  Collection: {
    id: "phAZoj",
    defaultMessage: "Collection",
  },
  Channel: {
    id: "KeO51o",
    defaultMessage: "Channel",
  },
  ProductType: {
    id: "Eb/9wV",
    defaultMessage: "ProductType",
  },
  IsAvailable: {
    id: "saSBz9",
    defaultMessage: "IsAvailable",
  },
  IsPublished: {
    id: "7PxvnK",
    defaultMessage: "IsPublished",
  },
  VisibleInListing: {
    id: "DLPnUt",
    defaultMessage: "VisibleInListing",
  },
  HasCategory: {
    id: "JHBLyT",
    defaultMessage: "HasCategory",
  },
  IsGiftcard: {
    id: "SfKUmG",
    defaultMessage: "IsGiftcard",
  },
  Attribute: {
    id: "OsU2Fs",
    defaultMessage: "Attribute",
  },
  Status: {
    id: "tzMNF3",
    defaultMessage: "Status",
  },
  Type: {
    id: "+U6ozc",
    defaultMessage: "Type",
  },
  "Start date": {
    id: "n5QvJy",
    defaultMessage: "Start date",
  },
  "End date": {
    id: "Humfno",
    defaultMessage: "End date",
  },
  IDs: {
    id: "4dU6vc",
    defaultMessage: "IDs",
  },
  Channels: {
    id: "LUrJwE",
    defaultMessage: "Channels",
  },
  "Order Status": {
    id: "ast9q1",
    defaultMessage: "Order Status",
  },
  "Fulfillment Status": {
    id: "L++/M+",
    defaultMessage: "Fulfillment Status",
  },
  "Creation date": {
    id: "+ayPjC",
    defaultMessage: "Creation date",
  },
  "Authorize status": {
    id: "TxMsgK",
    defaultMessage: "Authorize status",
  },
  "Charge status": {
    id: "0dyyVm",
    defaultMessage: "Charge status",
  },
  "Updated at": {
    id: "wFMlsH",
    defaultMessage: "Updated at",
  },
  "Click and collect": {
    id: "kt5p0t",
    defaultMessage: "Click and collect",
  },
  "Gift card bought": {
    id: "iB3OYW",
    defaultMessage: "Gift card bought",
  },
  "Gift card used": {
    id: "cy82q5",
    defaultMessage: "Gift card used",
  },
  "Total Gross Amount": {
    id: "UaKzxa",
    defaultMessage: "Total Gross Amount",
  },
  "Total Net Amount": {
    id: "BYCXFU",
    defaultMessage: "Total Net Amount",
  },
  "Has Invoices": {
    id: "+JgQeI",
    defaultMessage: "Has Invoices",
  },
  "Has Fulfillments": {
    id: "E4hG1d",
    defaultMessage: "Has Fulfillments",
  },
  "Invoice Date": {
    id: "AoqLcK",
    defaultMessage: "Invoice Date",
  },
  "Customer ID": {
    id: "tyssDm",
    defaultMessage: "Customer ID",
  },
  Metadata: {
    id: "8Q504V",
    defaultMessage: "Metadata",
  },
  "Order Number": {
    id: "JAcwxt",
    defaultMessage: "Order Number",
  },
  "Customer Email": {
    id: "97l2MO",
    defaultMessage: "Customer Email",
  },
  "Voucher Code": {
    id: "/QL0BF",
    defaultMessage: "Voucher Code",
  },
  "Number of Lines": {
    id: "8OCpw2",
    defaultMessage: "Number of Lines",
  },
  "Checkout ID": {
    id: "IEBd77",
    defaultMessage: "Checkout ID",
  },
  "Lines Metadata": {
    id: "Nr2l21",
    defaultMessage: "Lines Metadata",
  },
  "Transactions Metadata": {
    id: "XtB206",
    defaultMessage: "Transactions Metadata",
  },
  "Payment Type": {
    id: "QOGxSK",
    defaultMessage: "Payment Type",
  },
  "Card Brand": {
    id: "OeISyb",
    defaultMessage: "Card Brand",
  },
  "Fulfillments Metadata": {
    id: "N4ViQd",
    defaultMessage: "Fulfillments Metadata",
  },
  "Billing Phone": {
    id: "B21NxF",
    defaultMessage: "Billing Phone",
  },
  "Billing Country": {
    id: "stFhe8",
    defaultMessage: "Billing Country",
  },
  "Shipping Phone": {
    id: "zILOYY",
    defaultMessage: "Shipping Phone",
  },
  "Shipping Country": {
    id: "jfcESt",
    defaultMessage: "Shipping Country",
  },
  "Fulfillment Warehouse": {
    id: "YvuHIW",
    defaultMessage: "Fulfillment Warehouse",
  },
  "Discount type": {
    id: "z/2AZY",
    defaultMessage: "Discount type",
  },
  Started: {
    id: "TDUfVk",
    defaultMessage: "Started",
  },
  "Times used": {
    id: "YRrwDI",
    defaultMessage: "Times used",
  },
  "Is published": {
    id: "mIRBuW",
    defaultMessage: "Is published",
  },
  "Model types": {
    id: "GgvbdW",
    defaultMessage: "Model types",
  },
  Currency: {
    id: "55hdQy",
    defaultMessage: "Currency",
  },
  "Current balance": {
    id: "kuYpoI",
    defaultMessage: "Current balance",
  },
  "Initial balance": {
    id: "iTFALN",
    defaultMessage: "Initial balance",
  },
  Products: {
    id: "7NFfmz",
    defaultMessage: "Products",
  },
  "Is active": {
    id: "S8DnK6",
    defaultMessage: "Is active",
  },
  Tags: {
    id: "1EYCdR",
    defaultMessage: "Tags",
  },
  "Used by": {
    id: "1QosTr",
    defaultMessage: "Used by",
  },
  Code: {
    id: "h2vipu",
    defaultMessage: "Code",
  },
  "Join date": {
    id: "cITkLK",
    defaultMessage: "Join date",
  },
  "Number of orders": {
    id: "+5Qk43",
    defaultMessage: "Number of orders",
  },
  "Has variant attributes": {
    id: "fE+LP7",
    defaultMessage: "Has variant attributes",
  },
  "Filterable in Storefront": {
    id: "Km3A5D",
    defaultMessage: "Filterable in Storefront",
  },
  "Variant only": {
    id: "8EITfb",
    defaultMessage: "Variant only",
  },
  "Is required": {
    id: "kWXp6p",
    defaultMessage: "Is required",
  },
  "Visible in Storefront": {
    id: "E6m1iT",
    defaultMessage: "Visible in Storefront",
  },
});

const conditionMessages: Partial<Record<string, MessageDescriptor>> = defineMessages({
  is: {
    id: "fXdkiI",
    defaultMessage: "is",
  },
  in: {
    id: "6ISjoQ",
    defaultMessage: "in",
  },
  lower: {
    id: "L5IuDw",
    defaultMessage: "lower",
  },
  greater: {
    id: "PFnobO",
    defaultMessage: "greater",
  },
  between: {
    id: "BvGp1I",
    defaultMessage: "between",
  },
  contains: {
    id: "f19YrE",
    defaultMessage: "contains",
  },
});

/** Translate presentation labels while preserving query/operator tokens. */
export const localizeStaticFilterLabel = (
  label: string,
  type: string,
  value: string,
  intl: IntlShape,
): string => {
  if (!ConditionOptions.isStaticName(type)) return label;

  const definition = STATIC_OPTIONS.find(option => option.type === type && option.slug === value);
  const message = staticFilterMessages[definition?.label ?? label];

  return message ? intl.formatMessage(message) : label;
};

export const localizeFilterCondition = (option: ConditionItem, intl: IntlShape): ConditionItem => {
  const message = conditionMessages[option.label];

  return message ? { ...option, label: intl.formatMessage(message) } : option;
};
