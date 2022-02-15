import { defineMessages } from "react-intl";

export const orderPaymentMessages = defineMessages({
  clickAndCollectShippingMethod: {
    defaultMessage: "click&collect",
    description: "OrderPayment click&collect shipping method"
  },
  shippingDoesNotApply: {
    defaultMessage: "does not apply",
    description: "OrderPayment does not require shipping"
  },
  paymentTitle: {
    defaultMessage: "Payment status",
    description: "Payment card title"
  },
  subtotal: {
    defaultMessage: "Subtotal",
    description: "order subtotal price"
  },
  itemCount: {
    defaultMessage: "{quantity} items",
    description: "ordered products"
  },
  taxes: {
    defaultMessage: "Taxes"
  },
  vatIncluded: {
    defaultMessage: "VAT included",
    description: "vat included in order price"
  },
  vatNotIncluded: {
    defaultMessage: "does not apply",
    description: "vat not included in order price",
    id: "orderPaymentVATDoesNotApply"
  },
  shipping: {
    defaultMessage: "Shipping",
    description: "order shipping method name"
  },
  shippingNotApplicable: {
    defaultMessage: "does not apply",
    description: "order does not require shipping"
  },
  discount: {
    defaultMessage: "Discount",
    description: "order discount"
  },
  staffAdded: {
    defaultMessage: "Staff added",
    description: "staff added type order discount"
  },
  voucher: {
    defaultMessage: "Voucher",
    description: "voucher type order discount"
  },
  total: {
    defaultMessage: "Total",
    description: "order total price"
  },
  preauthorized: {
    defaultMessage: "Preauthorized amount",
    description: "order payment"
  },
  captured: {
    defaultMessage: "Captured amount",
    description: "order payment"
  },
  refunded: {
    defaultMessage: "Refunded amount",
    description: "order payment"
  },
  outstanding: {
    defaultMessage: "Outstanding Balance",
    description: "order payment"
  },
  paidWithGiftCard: {
    defaultMessage: "Paid with Gift Card",
    description: "order payment"
  }
});

export const paymentButtonMessages = defineMessages({
  capture: {
    defaultMessage: "Capture",
    description: "capture payment, button"
  },
  refund: {
    defaultMessage: "Refund",
    description: "button"
  },
  void: {
    defaultMessage: "Refund",
    description: "button"
  },
  markAsPaid: {
    defaultMessage: "Mark as paid",
    description: "order, button"
  }
});
