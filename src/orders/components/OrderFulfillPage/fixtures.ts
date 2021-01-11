/* eslint-disable sort-keys */

import * as placeholderImage from "@assets/images/sample-product.jpg";
import { OrderFulfillData_order } from "@saleor/orders/types/OrderFulfillData";
import { warehouseList } from "@saleor/warehouses/fixtures";

export const orderToFulfill: OrderFulfillData_order = {
  __typename: "Order",
  id: "T3JkZXI6Mg==",
  lines: [
    {
      __typename: "OrderLine",
      id: "T3JkZXJMaW5lOjQ=",
      isShippingRequired: true,
      productName: "T-Shirt",
      quantity: 3,
      quantityFulfilled: 1,
      allocations: [],
      variant: {
        __typename: "ProductVariant",
        id: "UHJvZHVjdFZhcmlhbnQ6Mjk2",
        name: "S",
        sku: "62783187",
        attributes: [
          {
            __typename: "SelectedAttribute",
            values: [
              {
                __typename: "AttributeValue",
                id: "QXR0cmlidXRlVmFsdWU6MzY=",
                name: "S"
              }
            ]
          }
        ],
        stocks: [
          {
            __typename: "Stock",
            id: "U3RvY2s6NTIy",
            warehouse: warehouseList[0],
            quantity: 1217,
            quantityAllocated: 10
          },
          {
            __typename: "Stock",
            id: "U3RvY2s6NTIx",
            warehouse: warehouseList[1],
            quantity: 1217,
            quantityAllocated: 20
          },
          {
            __typename: "Stock",
            id: "U3RvY2s6NTIz",
            warehouse: warehouseList[2],
            quantity: 1217,
            quantityAllocated: 4
          },
          {
            __typename: "Stock",
            id: "U3RvY2s6NTI0",
            warehouse: warehouseList[3],
            quantity: 1220,
            quantityAllocated: 7
          }
        ],
        trackInventory: false
      },
      thumbnail: {
        __typename: "Image",
        url: placeholderImage
      }
    },
    {
      __typename: "OrderLine",
      id: "T3JkZXJMaW5lOjU=",
      isShippingRequired: true,
      productName: "Lemon Juice",
      quantity: 4,
      quantityFulfilled: 0,
      allocations: [],
      variant: {
        __typename: "ProductVariant",
        id: "UHJvZHVjdFZhcmlhbnQ6MTgx",
        name: "2.5l",
        sku: "998323583",
        attributes: [
          {
            __typename: "SelectedAttribute",
            values: [
              {
                __typename: "AttributeValue",
                id: "QXR0cmlidXRlVmFsdWU6NjE=",
                name: "2.5l"
              }
            ]
          }
        ],
        stocks: [
          {
            __typename: "Stock",
            id: "U3RvY2s6NTI=",
            warehouse: warehouseList[1],
            quantity: 760,
            quantityAllocated: 2
          },
          {
            __typename: "Stock",
            id: "U3RvY2s6NTE=",
            warehouse: warehouseList[2],
            quantity: 760,
            quantityAllocated: 33
          },
          {
            __typename: "Stock",
            id: "U3RvY2s6NTM=",
            warehouse: warehouseList[3],
            quantity: 760,
            quantityAllocated: 4
          }
        ],
        trackInventory: true
      },
      thumbnail: {
        __typename: "Image",
        url: placeholderImage
      }
    },
    {
      __typename: "OrderLine",
      id: "T3JkZXJMaW5lOjY=",
      isShippingRequired: true,
      productName: "Orange Juice",
      quantity: 3,
      quantityFulfilled: 2,
      allocations: [],
      variant: {
        __typename: "ProductVariant",
        id: "UHJvZHVjdFZhcmlhbnQ6MTgy",
        name: "5l",
        sku: "998323584",
        attributes: [
          {
            __typename: "SelectedAttribute",
            values: [
              {
                __typename: "AttributeValue",
                id: "QXR0cmlidXRlVmFsdWU6NjI=",
                name: "5l"
              }
            ]
          }
        ],
        stocks: [
          {
            __typename: "Stock",
            id: "U3RvY2s6NTc=",
            warehouse: warehouseList[0],
            quantity: 587,
            quantityAllocated: 0
          },
          {
            __typename: "Stock",
            id: "U3RvY2s6NTY=",
            warehouse: warehouseList[2],
            quantity: 587,
            quantityAllocated: 1
          }
        ],
        trackInventory: true
      },
      thumbnail: {
        __typename: "Image",
        url: placeholderImage
      }
    }
  ],
  number: "9123"
};
