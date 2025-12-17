import {
  AllocationStrategyEnum,
  MarkAsPaidStrategyEnum,
  TransactionFlowStrategyEnum,
} from "@dashboard/graphql";
import { ChannelDetailsFragment } from "@dashboard/graphql/staging";

export const channelsList: ChannelDetailsFragment[] = [
  {
    __typename: "Channel",
    currencyCode: "EUR",
    hasOrders: false,
    id: "Q2hhbm5lcDoy",
    isActive: true,
    name: "Test",
    slug: "test",
    defaultCountry: {
      code: "PL",
      country: "Poland",
      __typename: "CountryDisplay",
    },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    },
    warehouses: [
      {
        __typename: "Warehouse",
        id: "WH1",
        name: "Warehouse 1",
      },
      {
        __typename: "Warehouse",
        id: "WH2",
        name: "Warehouse 2",
      },
    ],
    orderSettings: {
      markAsPaidStrategy: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
      deleteExpiredOrdersAfter: 60,
      allowUnpaidOrders: false,
      __typename: "OrderSettings",
    },
    paymentSettings: {
      __typename: "PaymentSettings",
      defaultTransactionFlowStrategy: TransactionFlowStrategyEnum.CHARGE,
    },
    checkoutSettings: {
      automaticallyCompleteFullyPaidCheckouts: true,
      allowLegacyGiftCardUse: true,
      automaticCompletionDelay: 30,
      automaticCompletionCutOffDate: "2024-01-01T00:00:00Z",
      __typename: "CheckoutSettings",
    },
  },
  {
    __typename: "Channel",
    currencyCode: "EUR",
    hasOrders: false,
    id: "Q2hhbm7lbDoy213",
    isActive: true,
    name: "Channel",
    slug: "channel",
    defaultCountry: {
      code: "PL",
      country: "Poland",
      __typename: "CountryDisplay",
    },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    },
    warehouses: [
      {
        __typename: "Warehouse",
        id: "WH1",
        name: "Warehouse 1",
      },
      {
        __typename: "Warehouse",
        id: "WH2",
        name: "Warehouse 2",
      },
    ],
    orderSettings: {
      markAsPaidStrategy: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
      deleteExpiredOrdersAfter: 60,
      allowUnpaidOrders: false,
      __typename: "OrderSettings",
    },
    paymentSettings: {
      __typename: "PaymentSettings",
      defaultTransactionFlowStrategy: TransactionFlowStrategyEnum.CHARGE,
    },
    checkoutSettings: {
      automaticallyCompleteFullyPaidCheckouts: true,
      automaticCompletionDelay: 30,
      automaticCompletionCutOffDate: "2024-01-01T00:00:00Z",
      allowLegacyGiftCardUse: true,
      __typename: "CheckoutSettings",
    },
  },
  {
    __typename: "Channel",
    currencyCode: "EUR",
    hasOrders: false,
    id: "Q2hhbn5lbDoytr",
    isActive: true,
    name: "Channel test",
    slug: "channeltest",
    defaultCountry: {
      code: "PL",
      country: "Poland",
      __typename: "CountryDisplay",
    },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    },
    warehouses: [
      {
        __typename: "Warehouse",
        id: "WH1",
        name: "Warehouse 1",
      },
      {
        __typename: "Warehouse",
        id: "WH2",
        name: "Warehouse 2",
      },
    ],
    orderSettings: {
      markAsPaidStrategy: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
      deleteExpiredOrdersAfter: 60,
      allowUnpaidOrders: false,
      __typename: "OrderSettings",
    },
    paymentSettings: {
      __typename: "PaymentSettings",
      defaultTransactionFlowStrategy: TransactionFlowStrategyEnum.CHARGE,
    },
    checkoutSettings: {
      automaticallyCompleteFullyPaidCheckouts: true,
      allowLegacyGiftCardUse: true,
      automaticCompletionDelay: 30,
      automaticCompletionCutOffDate: "2024-01-01T00:00:00Z",
      __typename: "CheckoutSettings",
    },
  },
  {
    __typename: "Channel",
    currencyCode: "EUR",
    hasOrders: false,
    id: "Q2hhbm5lbDo5bot",
    isActive: true,
    name: "Channel USD",
    slug: "channel-usd",
    defaultCountry: {
      code: "PL",
      country: "Poland",
      __typename: "CountryDisplay",
    },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    },
    warehouses: [
      {
        __typename: "Warehouse",
        id: "WH1",
        name: "Warehouse 1",
      },
      {
        __typename: "Warehouse",
        id: "WH2",
        name: "Warehouse 2",
      },
    ],
    orderSettings: {
      markAsPaidStrategy: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
      deleteExpiredOrdersAfter: 60,
      allowUnpaidOrders: false,
      __typename: "OrderSettings",
    },
    paymentSettings: {
      __typename: "PaymentSettings",
      defaultTransactionFlowStrategy: TransactionFlowStrategyEnum.CHARGE,
    },
    checkoutSettings: {
      automaticallyCompleteFullyPaidCheckouts: true,
      automaticCompletionDelay: 30,
      automaticCompletionCutOffDate: "2024-01-01T00:00:00Z",
      allowLegacyGiftCardUse: true,
      __typename: "CheckoutSettings",
    },
  },
  {
    __typename: "Channel",
    currencyCode: "EUR",
    hasOrders: false,
    id: "Q2hhbm7lbDoyr0tr",
    isActive: true,
    name: "Channel",
    slug: "channel2",
    defaultCountry: {
      code: "PL",
      country: "Poland",
      __typename: "CountryDisplay",
    },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    },
    warehouses: [
      {
        __typename: "Warehouse",
        id: "WH1",
        name: "Warehouse 1",
      },
      {
        __typename: "Warehouse",
        id: "WH2",
        name: "Warehouse 2",
      },
    ],
    orderSettings: {
      markAsPaidStrategy: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
      deleteExpiredOrdersAfter: 60,
      allowUnpaidOrders: false,
      __typename: "OrderSettings",
    },
    paymentSettings: {
      __typename: "PaymentSettings",
      defaultTransactionFlowStrategy: TransactionFlowStrategyEnum.CHARGE,
    },
    checkoutSettings: {
      automaticallyCompleteFullyPaidCheckouts: true,
      allowLegacyGiftCardUse: true,
      automaticCompletionDelay: 30,
      automaticCompletionCutOffDate: "2024-01-01T00:00:00Z",
      __typename: "CheckoutSettings",
    },
  },
  {
    __typename: "Channel",
    currencyCode: "EUR",
    hasOrders: false,
    id: "Q2hhbn5lbDoyya",
    isActive: true,
    name: "Channel test",
    slug: "channeltest4",
    defaultCountry: {
      code: "PL",
      country: "Poland",
      __typename: "CountryDisplay",
    },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    },
    warehouses: [
      {
        __typename: "Warehouse",
        id: "WH1",
        name: "Warehouse 1",
      },
      {
        __typename: "Warehouse",
        id: "WH2",
        name: "Warehouse 2",
      },
    ],
    orderSettings: {
      markAsPaidStrategy: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
      deleteExpiredOrdersAfter: 60,
      allowUnpaidOrders: false,
      __typename: "OrderSettings",
    },
    paymentSettings: {
      __typename: "PaymentSettings",
      defaultTransactionFlowStrategy: TransactionFlowStrategyEnum.CHARGE,
    },
    checkoutSettings: {
      automaticallyCompleteFullyPaidCheckouts: true,
      automaticCompletionDelay: 30,
      automaticCompletionCutOffDate: "2024-01-01T00:00:00Z",
      allowLegacyGiftCardUse: true,
      __typename: "CheckoutSettings",
    },
  },
  {
    __typename: "Channel",
    currencyCode: "EUR",
    hasOrders: false,
    id: "Q2hhbm5lbDo5w0z",
    isActive: true,
    name: "Channel USD",
    slug: "channel-usd1",
    defaultCountry: {
      code: "PL",
      country: "Poland",
      __typename: "CountryDisplay",
    },
    stockSettings: {
      __typename: "StockSettings",
      allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
    },
    warehouses: [
      {
        __typename: "Warehouse",
        id: "WH1",
        name: "Warehouse 1",
      },
      {
        __typename: "Warehouse",
        id: "WH2",
        name: "Warehouse 2",
      },
    ],
    orderSettings: {
      markAsPaidStrategy: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
      deleteExpiredOrdersAfter: 60,
      allowUnpaidOrders: false,
      __typename: "OrderSettings",
    },
    paymentSettings: {
      __typename: "PaymentSettings",
      defaultTransactionFlowStrategy: TransactionFlowStrategyEnum.CHARGE,
    },
    checkoutSettings: {
      automaticallyCompleteFullyPaidCheckouts: true,
      automaticCompletionDelay: 30,
      automaticCompletionCutOffDate: "2024-01-01T00:00:00Z",
      allowLegacyGiftCardUse: true,
      __typename: "CheckoutSettings",
    },
  },
];

export const channel: ChannelDetailsFragment = {
  __typename: "Channel",
  currencyCode: "zl",
  hasOrders: false,
  id: "Q2hhbm5lbDov78",
  isActive: true,
  name: "Test",
  slug: "test",
  defaultCountry: {
    code: "PL",
    country: "Poland",
    __typename: "CountryDisplay",
  },
  stockSettings: {
    __typename: "StockSettings",
    allocationStrategy: AllocationStrategyEnum.PRIORITIZE_HIGH_STOCK,
  },
  warehouses: [
    {
      __typename: "Warehouse",
      id: "WH1",
      name: "Warehouse 1",
    },
    {
      __typename: "Warehouse",
      id: "WH2",
      name: "Warehouse 2",
    },
  ],
  orderSettings: {
    markAsPaidStrategy: MarkAsPaidStrategyEnum.TRANSACTION_FLOW,
    deleteExpiredOrdersAfter: 60,
    allowUnpaidOrders: false,
    __typename: "OrderSettings",
  },
  paymentSettings: {
    __typename: "PaymentSettings",
    defaultTransactionFlowStrategy: TransactionFlowStrategyEnum.CHARGE,
  },
  checkoutSettings: {
    automaticallyCompleteFullyPaidCheckouts: true,
    automaticCompletionDelay: 30,
    automaticCompletionCutOffDate: "2024-01-01T00:00:00Z",
    allowLegacyGiftCardUse: true,
    __typename: "CheckoutSettings",
  },
};
