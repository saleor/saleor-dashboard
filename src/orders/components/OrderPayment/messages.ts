import { defineMessages } from "react-intl";

export const orderPaymentMessages = defineMessages({
  paymentStatus: {
    defaultMessage: "Payment status",
    description: "capture payment, button"
  },
  subtotal: {
    defaultMessage: "Subtotal",
    description: "order subtotal price"
  },
  subtotalQuantity: {
    defaultMessage: "{quantity} items",
    description: "ordered products"
  },
  taxes: {
    defaultMessage: "Taxes",
    description: "order taxes"
  },
  vatIncluded: {
    defaultMessage: "VAT included",
    description: "vat included in order price"
  },
  vatNotIncluded: {
    defaultMessage: "does not apply",
    description: "vat not included in order price"
  },
  shipping: {
    defaultMessage: "Shipping",
    description: "order shipping method name"
  },
  shippingNotIncluded: {
    defaultMessage: "does not apply",
    description: "order does not require shipping"
  },
  discount: {
    defaultMessage: "Discount",
    description: "order discount"
  },
  discountStaffAdded: {
    defaultMessage: "Staff added",
    description: "staff added type order discount"
  },
  discountVoucher: {
    defaultMessage: "Voucher",
    description: "voucher type order discount"
  },
  total: {
    defaultMessage: "Total",
    description: "order total price"
  },
  totalPreauthorized: {
    defaultMessage: "Total preauthorized",
    description: "order payment"
  },
  totalCaptured: {
    defaultMessage: "Total captured",
    description: "order payment"
  },
  totalRefunded: {
    defaultMessage: "Total refunded",
    description: "order payment"
  },
  outstandingBalance: {
    defaultMessage: "Outstanding Balance",
    description: "order payment"
  }
});
