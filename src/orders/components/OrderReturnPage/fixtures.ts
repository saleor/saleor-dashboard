/* eslint-disable sort-keys */

import { OrderDetails_order } from "@saleor/orders/types/OrderDetails";
import {
  FulfillmentStatus,
  JobStatusEnum,
  OrderAction,
  OrderEventsEmailsEnum,
  OrderEventsEnum,
  OrderStatus,
  PaymentChargeStatusEnum,
  ProductTypeKindEnum
} from "@saleor/types/globalTypes";
import { warehouseForPickup } from "@saleor/warehouses/fixtures";

export const orderToReturn = (placeholder: string): OrderDetails_order => ({
  __typename: "Order",
  id: "ifgdfuhdfdf",
  number: "22",
  giftCards: [],
  status: OrderStatus.PARTIALLY_FULFILLED,
  actions: [
    OrderAction.CAPTURE,
    OrderAction.MARK_AS_PAID,
    OrderAction.REFUND,
    OrderAction.VOID
  ],
  paymentStatus: PaymentChargeStatusEnum.NOT_CHARGED,
  privateMetadata: [],
  shippingAddress: {
    __typename: "Address",
    city: "West Patriciastad",
    cityArea: "",
    companyName: "",
    country: {
      __typename: "CountryDisplay",
      code: "SB",
      country: "Wyspy Salomona"
    },
    countryArea: "",
    firstName: "Melissa",
    id: "QWRkcmVzczoyNQ==",
    lastName: "Simon",
    phone: "",
    postalCode: "66272",
    streetAddress1: "487 Roberto Shores",
    streetAddress2: ""
  },
  shippingMethod: null,
  shippingMethodName: "Registred priority",
  collectionPointName: "Warehouse",
  deliveryMethod: warehouseForPickup,
  metadata: [
    {
      __typename: "MetadataItem",
      key: "integration.key",
      value: "some-value"
    }
  ],
  invoices: [
    {
      __typename: "Invoice",
      createdAt: "2020-06-22T13:52:05.094636+00:00",
      id: "SW52b2ljZTox",
      number: "1",
      status: JobStatusEnum.SUCCESS,
      url: "invoice1"
    }
  ],
  isPaid: true,
  isShippingRequired: false,
  availableShippingMethods: [
    {
      __typename: "ShippingMethod",
      id: "U2hpcHBpbmdNZXRob2Q6NQ==",
      name: "FBA",
      price: {
        __typename: "Money",
        amount: 12.41,
        currency: "USD"
      }
    },
    {
      __typename: "ShippingMethod",
      id: "U2hpcHBpbmdNZXRob2Q6Nw==",
      name: "Oceania Air Mail",
      price: {
        __typename: "Money",
        amount: 9.12,
        currency: "USD"
      }
    },
    {
      __typename: "ShippingMethod",
      id: "U2hpcHBpbmdNZXRob2Q6Ng==",
      name: "FedEx Express",
      price: {
        __typename: "Money",
        amount: 7.6,
        currency: "USD"
      }
    }
  ],
  billingAddress: {
    __typename: "Address",
    city: "West Patriciastad",
    cityArea: "",
    companyName: "",
    country: {
      __typename: "CountryDisplay",
      code: "SB",
      country: "Wyspy Salomona"
    },
    countryArea: "",
    firstName: "Melissa",
    id: "QWRkcmVzczoyNQ==",
    lastName: "Simon",
    phone: "",
    postalCode: "66272",
    streetAddress1: "487 Roberto Shores",
    streetAddress2: ""
  },
  canFinalize: true,
  channel: {
    __typename: "Channel",
    slug: "channel-default",
    currencyCode: "USD",
    id: "123454",
    isActive: true,
    name: "Default Channel"
  },
  created: "2018-09-11T09:37:28.185874+00:00",
  customerNote: "Lorem ipsum dolor sit amet",
  discounts: [],
  subtotal: {
    __typename: "TaxedMoney",
    gross: {
      __typename: "Money",
      amount: 214.95,
      currency: "USD"
    },
    net: {
      __typename: "Money",
      amount: 214.95,
      currency: "USD"
    }
  },
  totalAuthorized: {
    __typename: "Money",
    amount: 234.93,
    currency: "USD"
  },
  undiscountedTotal: {
    __typename: "TaxedMoney",
    gross: {
      __typename: "Money",
      amount: 79.71,
      currency: "USD"
    },
    net: {
      __typename: "Money",
      amount: 79.71,
      currency: "USD"
    }
  },
  user: null,
  userEmail: "melissa.simon@example.com",
  events: [
    {
      __typename: "OrderEvent",
      amount: null,
      date: "2018-09-17T13:22:24.376193+00:00",
      discount: null,
      email: null,
      emailType: null,
      id: "T3JkZXJFdmVudDoyMQ==",
      invoiceNumber: null,
      lines: [],
      message: null,
      quantity: 1,
      relatedOrder: null,
      shippingCostsIncluded: false,
      transactionReference: "123",
      type: OrderEventsEnum.FULFILLMENT_FULFILLED_ITEMS,
      app: {
        id: "ZXCkcmVasdwoxTW==",
        __typename: "App",
        name: "Testapp",
        appUrl: "https://www.google.com/"
      },
      user: {
        __typename: "User",
        email: "admin@example.com",
        firstName: "John",
        id: "QWRkcmVzczoxNQ==",
        lastName: "Doe"
      }
    },
    {
      __typename: "OrderEvent",
      amount: null,
      date: "2018-09-17T13:22:24.376193+00:00",
      discount: null,
      email: null,
      emailType: null,
      id: "UYgDNUnnfyiuyimuhd==",
      invoiceNumber: null,
      lines: [
        {
          __typename: "OrderEventOrderLineObject",
          discount: null,
          itemName: "Cow's milk",
          orderLine: {
            __typename: "OrderLine",
            id: "h47gfncfgwegfehfhj",
            productName: "Milk",
            variantName: "Cow's milk"
          },
          quantity: 4
        },
        {
          __typename: "OrderEventOrderLineObject",
          discount: null,
          itemName: "Goat's milk",
          orderLine: {
            __typename: "OrderLine",
            id: "7846f857t4t84y8fgh",
            productName: "Milk",
            variantName: "Goat's milk"
          },
          quantity: 4
        }
      ],
      message: null,
      quantity: 1,
      relatedOrder: null,
      shippingCostsIncluded: true,
      transactionReference: "123",
      type: OrderEventsEnum.FULFILLMENT_REFUNDED,
      app: {
        id: "ZXCkcmVasdwoxTW==",
        __typename: "App",
        name: "Testapp",
        appUrl: "https://www.google.com/"
      },
      user: {
        __typename: "User",
        email: "admin@example.com",
        firstName: "Jane",
        id: "QWRkcmVzczoxNQ==",
        lastName: "Doe"
      }
    },
    {
      __typename: "OrderEvent",
      amount: null,
      date: "2019-09-17T13:22:24.376193+00:00",
      discount: null,
      email: null,
      emailType: null,
      id: "T3JkZXJFdmVudDo0",
      invoiceNumber: null,
      lines: [],
      message: "This is note",
      quantity: null,
      relatedOrder: null,
      shippingCostsIncluded: false,
      transactionReference: "124",
      type: OrderEventsEnum.NOTE_ADDED,
      user: null,
      app: null
    },
    {
      __typename: "OrderEvent",
      amount: null,
      date: "2019-09-17T13:22:24.376193+00:00",
      discount: null,
      email: null,
      emailType: null,
      id: "T3JkZXJFdmVudDo1",
      invoiceNumber: null,
      lines: [],
      message: "This is note",
      quantity: null,
      relatedOrder: null,
      shippingCostsIncluded: false,
      transactionReference: "125",
      type: OrderEventsEnum.NOTE_ADDED,
      user: null,
      app: null
    },
    {
      __typename: "OrderEvent",
      amount: null,
      date: "2019-09-17T13:22:24.376193+00:00",
      discount: null,
      email: null,
      emailType: null,
      id: "T3JkZXJFdmVudDo2",
      invoiceNumber: null,
      lines: [],
      message: "Note from external service",
      quantity: null,
      relatedOrder: null,
      shippingCostsIncluded: false,
      transactionReference: "126",
      type: OrderEventsEnum.EXTERNAL_SERVICE_NOTIFICATION,
      user: null,
      app: null
    },
    {
      __typename: "OrderEvent",
      amount: null,
      date: "2019-09-17T13:22:24.376193+00:00",
      discount: null,
      email: null,
      emailType: OrderEventsEmailsEnum.ORDER_CANCEL,
      id: "T3JkZXJFdmVudDo3",
      invoiceNumber: null,
      lines: [],
      message: null,
      quantity: null,
      relatedOrder: null,
      shippingCostsIncluded: false,
      transactionReference: "127",
      type: OrderEventsEnum.EMAIL_SENT,
      user: null,
      app: null
    },
    {
      __typename: "OrderEvent",
      amount: null,
      date: "2019-09-17T13:22:24.376193+00:00",
      discount: null,
      email: null,
      emailType: OrderEventsEmailsEnum.ORDER_REFUND,
      id: "T3JkZXJFdmVudDo4",
      invoiceNumber: null,
      lines: [],
      message: null,
      quantity: null,
      relatedOrder: null,
      shippingCostsIncluded: false,
      transactionReference: "128",
      type: OrderEventsEnum.EMAIL_SENT,
      user: null,
      app: null
    },
    {
      __typename: "OrderEvent",
      amount: null,
      date: "2019-09-17T13:22:24.376193+00:00",
      discount: null,
      email: null,
      emailType: null,
      id: "T3JkZXJFdmVudDo5",
      invoiceNumber: null,
      lines: [],
      message: null,
      quantity: null,
      relatedOrder: null,
      shippingCostsIncluded: false,
      transactionReference: "129",
      type: OrderEventsEnum.PAYMENT_AUTHORIZED,
      user: null,
      app: null
    }
  ],
  total: {
    __typename: "TaxedMoney",
    net: {
      __typename: "Money",
      amount: 764.38,
      currency: "USD"
    },
    tax: {
      __typename: "Money",
      amount: 0,
      currency: "USD"
    },
    gross: {
      __typename: "Money",
      amount: 764.38,
      currency: "USD"
    }
  },
  totalCaptured: {
    __typename: "Money",
    amount: 664.38,
    currency: "USD"
  },
  shippingPrice: {
    __typename: "TaxedMoney",
    gross: {
      __typename: "Money",
      amount: 20,
      currency: "USD"
    }
  },
  lines: [
    {
      __typename: "OrderLine",
      id: "diufhdsif",
      productName: "Milk",
      quantity: 19,
      quantityToFulfill: 16,
      quantityFulfilled: 3,
      isShippingRequired: true,
      productSku: "usgytfgdsyufhd",
      unitDiscount: null,
      unitDiscountValue: null,
      unitDiscountReason: null,
      unitDiscountType: null,
      undiscountedUnitPrice: null,
      thumbnail: {
        __typename: "Image",
        url: placeholder
      },
      unitPrice: {
        __typename: "TaxedMoney",
        net: {
          __typename: "Money",
          amount: 26.02,
          currency: "USD"
        },
        gross: {
          __typename: "Money",
          amount: 26.02,
          currency: "USD"
        }
      },
      variant: {
        __typename: "ProductVariant",
        id: "pvgfsjfdhfd",
        quantityAvailable: 1000,
        product: {
          __typename: "Product",
          id: "pededededa",
          productType: {
            __typename: "ProductType",
            id: "pthudfsdbcs",
            kind: ProductTypeKindEnum.NORMAL
          }
        }
      }
    },
    {
      __typename: "OrderLine",
      id: "fdsfdfdsf",
      productName: "Coffee",
      quantity: 13,
      quantityToFulfill: 8,
      quantityFulfilled: 5,
      isShippingRequired: true,
      productSku: "fiudhiurhfiejds",
      unitDiscount: null,
      unitDiscountValue: null,
      unitDiscountReason: null,
      unitDiscountType: null,
      undiscountedUnitPrice: null,
      thumbnail: {
        __typename: "Image",
        url: placeholder
      },
      unitPrice: {
        __typename: "TaxedMoney",
        net: {
          __typename: "Money",
          amount: 10,
          currency: "USD"
        },
        gross: {
          __typename: "Money",
          amount: 10,
          currency: "USD"
        }
      },
      variant: {
        __typename: "ProductVariant",
        id: "pvjgfdiguhk",
        quantityAvailable: 1000,
        product: {
          __typename: "Product",
          id: "pededededa",
          productType: {
            __typename: "ProductType",
            id: "pthudfsdbcs",
            kind: ProductTypeKindEnum.NORMAL
          }
        }
      }
    },
    {
      __typename: "OrderLine",
      id: "hsdifbdsjkkk",
      productName: "GiftCard",
      quantity: 2,
      quantityToFulfill: 1,
      quantityFulfilled: 1,
      isShippingRequired: true,
      productSku: "fiwuhfuhiafsdf",
      unitDiscount: null,
      unitDiscountValue: null,
      unitDiscountReason: null,
      unitDiscountType: null,
      undiscountedUnitPrice: null,
      thumbnail: {
        __typename: "Image",
        url: placeholder
      },
      unitPrice: {
        __typename: "TaxedMoney",
        net: {
          __typename: "Money",
          amount: 10,
          currency: "USD"
        },
        gross: {
          __typename: "Money",
          amount: 10,
          currency: "USD"
        }
      },
      variant: {
        __typename: "ProductVariant",
        id: "ttt444jhsjfhd",
        quantityAvailable: 1000,
        product: {
          __typename: "Product",
          id: "kjjkk43hhh",
          productType: {
            __typename: "ProductType",
            id: "jkiiigcgcgc",
            kind: ProductTypeKindEnum.GIFT_CARD
          }
        }
      }
    }
  ],
  fulfillments: [
    {
      __typename: "Fulfillment",
      id: "f12345qwertyu",
      status: FulfillmentStatus.FULFILLED,
      fulfillmentOrder: 1,
      trackingNumber: "ygdudh8edgygwduedsc",
      warehouse: {
        __typename: "Warehouse",
        id: "hdsuyfwguge74d43hjbcxz",
        name: "Warehouse 1"
      },
      lines: [
        {
          __typename: "FulfillmentLine",
          id: "fg3333fu66666",
          quantity: 1,
          orderLine: {
            __typename: "OrderLine",
            id: "diufhdsif",
            productName: "Milk",
            quantity: 1,
            quantityToFulfill: 16,
            quantityFulfilled: 3,
            isShippingRequired: true,
            productSku: "fiwuhfuhiafsdf",
            unitDiscount: null,
            unitDiscountValue: null,
            unitDiscountReason: null,
            unitDiscountType: null,
            undiscountedUnitPrice: null,
            thumbnail: {
              __typename: "Image",
              url: placeholder
            },
            unitPrice: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 26.02,
                currency: "USD"
              },
              gross: {
                __typename: "Money",
                amount: 26.02,
                currency: "USD"
              }
            },
            variant: {
              __typename: "ProductVariant",
              id: "pvgfsjfdhfd",
              quantityAvailable: 1000,
              product: {
                __typename: "Product",
                id: "pededededa",
                productType: {
                  __typename: "ProductType",
                  id: "pthudfsdbcs",
                  kind: ProductTypeKindEnum.NORMAL
                }
              }
            }
          }
        },
        {
          __typename: "FulfillmentLine",
          id: "fgytrytytu88977",
          quantity: 1,
          orderLine: {
            __typename: "OrderLine",
            id: "fdsfdfdsf",
            productName: "Coffee",
            quantity: 1,
            quantityToFulfill: 8,
            quantityFulfilled: 5,
            isShippingRequired: true,
            productSku: "fiudhiurhfiejds",
            unitDiscount: null,
            unitDiscountValue: null,
            unitDiscountReason: null,
            unitDiscountType: null,
            undiscountedUnitPrice: null,
            thumbnail: {
              __typename: "Image",
              url: placeholder
            },
            unitPrice: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 10,
                currency: "USD"
              },
              gross: {
                __typename: "Money",
                amount: 10,
                currency: "USD"
              }
            },
            variant: {
              __typename: "ProductVariant",
              id: "pvjgfdiguhk",
              quantityAvailable: 1000,
              product: {
                __typename: "Product",
                id: "pededededa",
                productType: {
                  __typename: "ProductType",
                  id: "pthudfsdbcs",
                  kind: ProductTypeKindEnum.NORMAL
                }
              }
            }
          }
        },
        {
          __typename: "FulfillmentLine",
          id: "kdvfdkjgrun44573",
          quantity: 1,
          orderLine: {
            __typename: "OrderLine",
            id: "hsdifbdsjkkk",
            productName: "GiftCard",
            quantity: 1,
            quantityToFulfill: 1,
            quantityFulfilled: 1,
            isShippingRequired: true,
            productSku: "fiwuhfuhiafsdf",
            unitDiscount: null,
            unitDiscountValue: null,
            unitDiscountReason: null,
            unitDiscountType: null,
            undiscountedUnitPrice: null,
            thumbnail: {
              __typename: "Image",
              url: placeholder
            },
            unitPrice: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 10,
                currency: "USD"
              },
              gross: {
                __typename: "Money",
                amount: 10,
                currency: "USD"
              }
            },
            variant: {
              __typename: "ProductVariant",
              id: "ttt444jhsjfhd",
              quantityAvailable: 1000,
              product: {
                __typename: "Product",
                id: "kjjkk43hhh",
                productType: {
                  __typename: "ProductType",
                  id: "jkiiigcgcgc",
                  kind: ProductTypeKindEnum.GIFT_CARD
                }
              }
            }
          }
        }
      ]
    },
    {
      __typename: "Fulfillment",
      id: "876543jhgfdfd",
      status: FulfillmentStatus.FULFILLED,
      fulfillmentOrder: 2,
      trackingNumber: "ffsdfuhsdfgi",
      warehouse: {
        __typename: "Warehouse",
        id: "sdhugyfueryhferyufbreybf374f",
        name: "Warehouse 2"
      },
      lines: [
        {
          __typename: "FulfillmentLine",
          id: "fgydgsyfu23456",
          quantity: 2,
          orderLine: {
            __typename: "OrderLine",
            id: "diufhdsif",
            productName: "Milk",
            quantity: 2,
            quantityToFulfill: 16,
            quantityFulfilled: 3,
            isShippingRequired: true,
            productSku: "usgytfgdsyufhd",
            unitDiscount: null,
            unitDiscountValue: null,
            unitDiscountReason: null,
            unitDiscountType: null,
            undiscountedUnitPrice: null,
            thumbnail: {
              __typename: "Image",
              url: placeholder
            },
            unitPrice: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 26.02,
                currency: "USD"
              },
              gross: {
                __typename: "Money",
                amount: 26.02,
                currency: "USD"
              }
            },
            variant: {
              __typename: "ProductVariant",
              id: "pvgfsjfdhfd",
              quantityAvailable: 1000,
              product: {
                __typename: "Product",
                id: "pededededa",
                productType: {
                  __typename: "ProductType",
                  id: "pthudfsdbcs",
                  kind: ProductTypeKindEnum.NORMAL
                }
              }
            }
          }
        },
        {
          __typename: "FulfillmentLine",
          id: "fgydgsyfu555444",
          quantity: 4,
          orderLine: {
            __typename: "OrderLine",
            id: "fdsfdfdsf",
            productName: "Coffee",
            quantity: 4,
            quantityToFulfill: 8,
            quantityFulfilled: 5,
            isShippingRequired: true,
            productSku: "fiudhiurhfiejds",
            unitDiscount: null,
            unitDiscountValue: null,
            unitDiscountReason: null,
            unitDiscountType: null,
            undiscountedUnitPrice: null,
            thumbnail: {
              __typename: "Image",
              url: placeholder
            },
            unitPrice: {
              __typename: "TaxedMoney",
              net: {
                __typename: "Money",
                amount: 10,
                currency: "USD"
              },
              gross: {
                __typename: "Money",
                amount: 10,
                currency: "USD"
              }
            },
            variant: {
              __typename: "ProductVariant",
              id: "pvjgfdiguhk",
              quantityAvailable: 1000,
              product: {
                __typename: "Product",
                id: "pededededa",
                productType: {
                  __typename: "ProductType",
                  id: "pthudfsdbcs",
                  kind: ProductTypeKindEnum.NORMAL
                }
              }
            }
          }
        }
      ]
    }
  ]
});
