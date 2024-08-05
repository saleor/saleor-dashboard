import { gql } from "@apollo/client";
import { MockedResponse } from "@apollo/client/testing";
import { getIntrospectionQuery } from "graphql";

export const introspectionMocks: MockedResponse[] = [
  {
    request: {
      query: gql(getIntrospectionQuery()),
      variables: {},
    },
    result: {
      data: {
        __schema: {
          types: [
            {
              kind: "OBJECT",
              name: "Query",
              description: null,
              fields: [
                {
                  name: "product",
                  description:
                    "Look up a product by ID. Requires one of the following permissions to include the unpublished items: MANAGE_ORDERS, MANAGE_DISCOUNTS, MANAGE_PRODUCTS.",
                },
                {
                  name: "products",
                  description:
                    "List of the shop's products. Requires one of the following permissions to include the unpublished items: MANAGE_ORDERS, MANAGE_DISCOUNTS, MANAGE_PRODUCTS.",
                },
                {
                  name: "order",
                  description: "Look up an order by ID or external reference.",
                },
                {
                  name: "orders",
                  description:
                    "List of orders.\n\nRequires one of the following permissions: MANAGE_ORDERS.",
                },
                {
                  name: "sale",
                  description:
                    "Look up a sale by ID.\n\nRequires one of the following permissions: MANAGE_DISCOUNTS.",
                },
                {
                  name: "sales",
                  description:
                    "List of the shop's sales.\n\nRequires one of the following permissions: MANAGE_DISCOUNTS.",
                },
              ],
            },
            {
              kind: "OBJECT",
              name: "Product",
              description: "Represents an individual item for sale in the storefront.",
              fields: [
                {
                  name: "id",
                  description: null,
                },
                {
                  name: "privateMetadata",
                  description:
                    "List of private metadata items. Requires staff permissions to access.",
                },
                {
                  name: "privateMetafield",
                  description:
                    "A single key from private metadata. Requires staff permissions to access.\n\nTip: Use GraphQL aliases to fetch multiple keys.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "privateMetafields",
                  description:
                    "Private metadata. Requires staff permissions to access. Use `keys` to control which fields you want to include. The default is to include everything.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "metadata",
                  description:
                    "List of public metadata items. Can be accessed without permissions.",
                },
                {
                  name: "metafield",
                  description:
                    "A single key from public metadata.\n\nTip: Use GraphQL aliases to fetch multiple keys.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "metafields",
                  description:
                    "Public metadata. Use `keys` to control which fields you want to include. The default is to include everything.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "seoTitle",
                  description: null,
                },
                {
                  name: "seoDescription",
                  description: null,
                },
                {
                  name: "name",
                  description: null,
                },
                {
                  name: "description",
                  description:
                    "Description of the product.\n\nRich text format. For reference see https://editorjs.io/",
                },
                {
                  name: "productType",
                  description: null,
                },
                {
                  name: "slug",
                  description: null,
                },
                {
                  name: "category",
                  description: null,
                },
                {
                  name: "created",
                  description: null,
                },
                {
                  name: "updatedAt",
                  description: null,
                },
                {
                  name: "weight",
                  description: null,
                },
                {
                  name: "defaultVariant",
                  description: null,
                },
                {
                  name: "rating",
                  description: null,
                },
                {
                  name: "channel",
                  description:
                    "Channel given to retrieve this product. Also used by federation gateway to resolve this object in a federated query.",
                },
                {
                  name: "thumbnail",
                  description: null,
                },
                {
                  name: "pricing",
                  description:
                    "Lists the storefront product's pricing, the current price and discounts, only meant for displaying.",
                },
                {
                  name: "isAvailable",
                  description: "Whether the product is in stock and visible or not.",
                },
                {
                  name: "attribute",
                  description:
                    "Get a single attribute attached to product by attribute slug.\n\nAdded in Saleor 3.9.",
                },
                {
                  name: "attributes",
                  description: "List of attributes assigned to this product.",
                },
                {
                  name: "channelListings",
                  description:
                    "List of availability in channels for the product.\n\nRequires one of the following permissions: MANAGE_PRODUCTS.",
                },
                {
                  name: "mediaById",
                  description: "Get a single product media by ID.",
                },
                {
                  name: "variants",
                  description:
                    "List of variants for the product. Requires the following permissions to include the unpublished items: MANAGE_ORDERS, MANAGE_DISCOUNTS, MANAGE_PRODUCTS.",
                },
                {
                  name: "media",
                  description: "List of media for the product.",
                },
                {
                  name: "collections",
                  description:
                    "List of collections for the product. Requires the following permissions to include the unpublished items: MANAGE_ORDERS, MANAGE_DISCOUNTS, MANAGE_PRODUCTS.",
                },
                {
                  name: "translation",
                  description: "Returns translated product fields for the given language code.",
                },
                {
                  name: "availableForPurchaseAt",
                  description: "Date when product is available for purchase.",
                },
                {
                  name: "isAvailableForPurchase",
                  description: "Whether the product is available for purchase.",
                },
                {
                  name: "taxClass",
                  description:
                    "Tax class assigned to this product type. All products of this product type use this tax class, unless it's overridden in the `Product` type.\n\nRequires one of the following permissions: AUTHENTICATED_STAFF_USER.",
                },
                {
                  name: "externalReference",
                  description: "External ID of this product. \n\nAdded in Saleor 3.10.",
                },
              ],
            },
            {
              kind: "OBJECT",
              name: "ProductType",
              description:
                "Represents a type of product. It defines what attributes are available to products of this type.",
              fields: [
                {
                  name: "id",
                  description: null,
                },
                {
                  name: "privateMetadata",
                  description:
                    "List of private metadata items. Requires staff permissions to access.",
                },
                {
                  name: "privateMetafield",
                  description:
                    "A single key from private metadata. Requires staff permissions to access.\n\nTip: Use GraphQL aliases to fetch multiple keys.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "privateMetafields",
                  description:
                    "Private metadata. Requires staff permissions to access. Use `keys` to control which fields you want to include. The default is to include everything.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "metadata",
                  description:
                    "List of public metadata items. Can be accessed without permissions.",
                },
                {
                  name: "metafield",
                  description:
                    "A single key from public metadata.\n\nTip: Use GraphQL aliases to fetch multiple keys.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "metafields",
                  description:
                    "Public metadata. Use `keys` to control which fields you want to include. The default is to include everything.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "name",
                  description: null,
                },
                {
                  name: "slug",
                  description: null,
                },
                {
                  name: "hasVariants",
                  description: null,
                },
                {
                  name: "isShippingRequired",
                  description: null,
                },
                {
                  name: "isDigital",
                  description: null,
                },
                {
                  name: "weight",
                  description: null,
                },
                {
                  name: "kind",
                  description: "The product type kind.",
                },
                {
                  name: "taxClass",
                  description:
                    "Tax class assigned to this product type. All products of this product type use this tax class, unless it's overridden in the `Product` type.\n\nRequires one of the following permissions: AUTHENTICATED_STAFF_USER.",
                },
                {
                  name: "assignedVariantAttributes",
                  description:
                    "Variant attributes of that product type with attached variant selection.\n\nAdded in Saleor 3.1.",
                },
                {
                  name: "productAttributes",
                  description: "Product attributes of that product type.",
                },
                {
                  name: "availableAttributes",
                  description:
                    "List of attributes which can be assigned to this product type.\n\nRequires one of the following permissions: MANAGE_PRODUCTS.",
                },
              ],
            },
            {
              kind: "ENUM",
              name: "ProductTypeKindEnum",
              description: "An enumeration.",
              fields: null,
            },
            {
              kind: "OBJECT",
              name: "Sale",
              description:
                "Sales allow creating discounts for categories, collections or products and are visible to all the customers.",
              fields: [
                {
                  name: "id",
                  description: null,
                },
                {
                  name: "privateMetadata",
                  description:
                    "List of private metadata items. Requires staff permissions to access.",
                },
                {
                  name: "privateMetafield",
                  description:
                    "A single key from private metadata. Requires staff permissions to access.\n\nTip: Use GraphQL aliases to fetch multiple keys.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "privateMetafields",
                  description:
                    "Private metadata. Requires staff permissions to access. Use `keys` to control which fields you want to include. The default is to include everything.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "metadata",
                  description:
                    "List of public metadata items. Can be accessed without permissions.",
                },
                {
                  name: "metafield",
                  description:
                    "A single key from public metadata.\n\nTip: Use GraphQL aliases to fetch multiple keys.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "metafields",
                  description:
                    "Public metadata. Use `keys` to control which fields you want to include. The default is to include everything.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "name",
                  description: null,
                },
                {
                  name: "type",
                  description: null,
                },
                {
                  name: "startDate",
                  description: null,
                },
                {
                  name: "endDate",
                  description: null,
                },
                {
                  name: "created",
                  description: null,
                },
                {
                  name: "updatedAt",
                  description: null,
                },
                {
                  name: "categories",
                  description: "List of categories this sale applies to.",
                },
                {
                  name: "collections",
                  description:
                    "List of collections this sale applies to.\n\nRequires one of the following permissions: MANAGE_DISCOUNTS.",
                },
                {
                  name: "products",
                  description:
                    "List of products this sale applies to.\n\nRequires one of the following permissions: MANAGE_DISCOUNTS.",
                },
                {
                  name: "variants",
                  description:
                    "List of product variants this sale applies to.\n\nAdded in Saleor 3.1.\n\nRequires one of the following permissions: MANAGE_DISCOUNTS.",
                },
                {
                  name: "translation",
                  description: "Returns translated sale fields for the given language code.",
                },
                {
                  name: "channelListings",
                  description:
                    "List of channels available for the sale.\n\nRequires one of the following permissions: MANAGE_DISCOUNTS.",
                },
                {
                  name: "discountValue",
                  description: "Sale value.",
                },
                {
                  name: "currency",
                  description: "Currency code for sale.",
                },
              ],
            },
            {
              kind: "ENUM",
              name: "SaleType",
              description: null,
              fields: null,
            },
            {
              kind: "OBJECT",
              name: "Order",
              description: "Represents an order in the shop.",
              fields: [
                {
                  name: "id",
                  description: null,
                },
                {
                  name: "privateMetadata",
                  description:
                    "List of private metadata items. Requires staff permissions to access.",
                },
                {
                  name: "privateMetafield",
                  description:
                    "A single key from private metadata. Requires staff permissions to access.\n\nTip: Use GraphQL aliases to fetch multiple keys.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "privateMetafields",
                  description:
                    "Private metadata. Requires staff permissions to access. Use `keys` to control which fields you want to include. The default is to include everything.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "metadata",
                  description:
                    "List of public metadata items. Can be accessed without permissions.",
                },
                {
                  name: "metafield",
                  description:
                    "A single key from public metadata.\n\nTip: Use GraphQL aliases to fetch multiple keys.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "metafields",
                  description:
                    "Public metadata. Use `keys` to control which fields you want to include. The default is to include everything.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "created",
                  description: null,
                },
                {
                  name: "updatedAt",
                  description: null,
                },
                {
                  name: "status",
                  description: null,
                },
                {
                  name: "user",
                  description:
                    "User who placed the order. This field is set only for orders placed by authenticated users. Can be fetched for orders created in Saleor 3.2 and later, for other orders requires one of the following permissions: MANAGE_USERS, MANAGE_ORDERS, OWNER.",
                },
                {
                  name: "trackingClientId",
                  description: null,
                },
                {
                  name: "billingAddress",
                  description:
                    "Billing address. The full data can be access for orders created in Saleor 3.2 and later, for other orders requires one of the following permissions: MANAGE_ORDERS, OWNER.",
                },
                {
                  name: "shippingAddress",
                  description:
                    "Shipping address. The full data can be access for orders created in Saleor 3.2 and later, for other orders requires one of the following permissions: MANAGE_ORDERS, OWNER.",
                },
                {
                  name: "shippingMethodName",
                  description: null,
                },
                {
                  name: "collectionPointName",
                  description: null,
                },
                {
                  name: "channel",
                  description: null,
                },
                {
                  name: "fulfillments",
                  description: "List of shipments for the order.",
                },
                {
                  name: "lines",
                  description: "List of order lines.",
                },
                {
                  name: "actions",
                  description:
                    "List of actions that can be performed in the current state of an order.",
                },
                {
                  name: "shippingMethods",
                  description: "Shipping methods related to this order.",
                },
                {
                  name: "availableCollectionPoints",
                  description:
                    "Collection points that can be used for this order.\n\nAdded in Saleor 3.1.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "invoices",
                  description:
                    "List of order invoices. Can be fetched for orders created in Saleor 3.2 and later, for other orders requires one of the following permissions: MANAGE_ORDERS, OWNER.",
                },
                {
                  name: "number",
                  description: "User-friendly number of an order.",
                },
                {
                  name: "original",
                  description: "The ID of the order that was the base for this order.",
                },
                {
                  name: "origin",
                  description: "The order origin.",
                },
                {
                  name: "isPaid",
                  description: "Informs if an order is fully paid.",
                },
                {
                  name: "paymentStatus",
                  description: "Internal payment status.",
                },
                {
                  name: "paymentStatusDisplay",
                  description: "User-friendly payment status.",
                },
                {
                  name: "authorizeStatus",
                  description:
                    "The authorize status of the order.\n\nAdded in Saleor 3.4.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "chargeStatus",
                  description:
                    "The charge status of the order.\n\nAdded in Saleor 3.4.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "taxExemption",
                  description:
                    "Returns True if order has to be exempt from taxes.\n\nAdded in Saleor 3.8.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "transactions",
                  description:
                    "List of transactions for the order. Requires one of the following permissions: MANAGE_ORDERS, HANDLE_PAYMENTS.\n\nAdded in Saleor 3.4.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "payments",
                  description: "List of payments for the order.",
                },
                {
                  name: "total",
                  description: "Total amount of the order.",
                },
                {
                  name: "undiscountedTotal",
                  description: "Undiscounted total amount of the order.",
                },
                {
                  name: "shippingPrice",
                  description: "Total price of shipping.",
                },
                {
                  name: "shippingTaxRate",
                  description: "The shipping tax rate value.",
                },
                {
                  name: "shippingTaxClass",
                  description:
                    "Denormalized tax class assigned to the shipping method.\n\nAdded in Saleor 3.9.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.\n\nRequires one of the following permissions: AUTHENTICATED_STAFF_USER.",
                },
                {
                  name: "shippingTaxClassName",
                  description:
                    "Denormalized name of the tax class assigned to the shipping method.\n\nAdded in Saleor 3.9.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "shippingTaxClassMetadata",
                  description:
                    "Denormalized public metadata of the shipping method's tax class.\n\nAdded in Saleor 3.9.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "shippingTaxClassPrivateMetadata",
                  description:
                    "Denormalized private metadata of the shipping method's tax class. Requires staff permissions to access.\n\nAdded in Saleor 3.9.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "voucher",
                  description: null,
                },
                {
                  name: "giftCards",
                  description: "List of user gift cards.",
                },
                {
                  name: "customerNote",
                  description: null,
                },
                {
                  name: "weight",
                  description: null,
                },
                {
                  name: "redirectUrl",
                  description: null,
                },
                {
                  name: "subtotal",
                  description: "The sum of line prices not including shipping.",
                },
                {
                  name: "statusDisplay",
                  description: "User-friendly order status.",
                },
                {
                  name: "canFinalize",
                  description:
                    "Informs whether a draft order can be finalized(turned into a regular order).",
                },
                {
                  name: "totalAuthorized",
                  description: "Amount authorized for the order.",
                },
                {
                  name: "totalCaptured",
                  description: "Amount captured by payment.",
                },
                {
                  name: "events",
                  description:
                    "List of events associated with the order.\n\nRequires one of the following permissions: MANAGE_ORDERS.",
                },
                {
                  name: "totalBalance",
                  description: "The difference between the paid and the order total amount.",
                },
                {
                  name: "userEmail",
                  description:
                    "Email address of the customer. The full data can be access for orders created in Saleor 3.2 and later, for other orders requires one of the following permissions: MANAGE_ORDERS, OWNER.",
                },
                {
                  name: "isShippingRequired",
                  description: "Returns True, if order requires shipping.",
                },
                {
                  name: "deliveryMethod",
                  description:
                    "The delivery method selected for this order.\n\nAdded in Saleor 3.1.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "languageCodeEnum",
                  description: "Order language code.",
                },
                {
                  name: "discounts",
                  description: "List of all discounts assigned to the order.",
                },
                {
                  name: "errors",
                  description: "List of errors that occurred during order validation.",
                },
                {
                  name: "displayGrossPrices",
                  description:
                    "Determines whether checkout prices should include taxes when displayed in a storefront.\n\nAdded in Saleor 3.9.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "externalReference",
                  description: "External ID of this order. \n\nAdded in Saleor 3.10.",
                },
                {
                  name: "checkoutId",
                  description:
                    "ID of the checkout that the order was created from. \n\nAdded in Saleor 3.11.",
                },
              ],
            },
            {
              kind: "ENUM",
              name: "OrderStatus",
              description: "An enumeration.",
              fields: null,
            },
            {
              kind: "OBJECT",
              name: "Invoice",
              description: "Represents an Invoice.",
              fields: [
                {
                  name: "privateMetadata",
                  description:
                    "List of private metadata items. Requires staff permissions to access.",
                },
                {
                  name: "privateMetafield",
                  description:
                    "A single key from private metadata. Requires staff permissions to access.\n\nTip: Use GraphQL aliases to fetch multiple keys.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "privateMetafields",
                  description:
                    "Private metadata. Requires staff permissions to access. Use `keys` to control which fields you want to include. The default is to include everything.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "metadata",
                  description:
                    "List of public metadata items. Can be accessed without permissions.",
                },
                {
                  name: "metafield",
                  description:
                    "A single key from public metadata.\n\nTip: Use GraphQL aliases to fetch multiple keys.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "metafields",
                  description:
                    "Public metadata. Use `keys` to control which fields you want to include. The default is to include everything.\n\nAdded in Saleor 3.3.\n\nNote: this API is currently in Feature Preview and can be subject to changes at later point.",
                },
                {
                  name: "status",
                  description: "Job status.",
                },
                {
                  name: "createdAt",
                  description: null,
                },
                {
                  name: "updatedAt",
                  description: null,
                },
                {
                  name: "message",
                  description: null,
                },
                {
                  name: "id",
                  description: "The ID of the object.",
                },
                {
                  name: "number",
                  description: null,
                },
                {
                  name: "externalUrl",
                  description: null,
                },
                {
                  name: "url",
                  description: "URL to download an invoice.",
                },
                {
                  name: "order",
                  description: "Order related to the invoice.\n\nAdded in Saleor 3.10.",
                },
              ],
            },
          ],
        },
      },
      extensions: {
        cost: {
          requestedQueryCost: 0,
          maximumAvailable: 50000,
        },
      },
    },
  },
];

export default introspectionMocks;
