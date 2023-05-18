export const ORDERS_SELECTORS = {
  orders: "[data-test-id='menu-item-label'][data-test-id='orders']",
  createOrderButton: "[data-test-id='create-order-button']",
  orderRow: "[data-test-id='order-table-row']",
  salesChannel: "[data-test-id='order-sales-channel']",
  cancelFulfillment: "[data-test-id='cancel-fulfillment-button']",
  cancelFulfillmentSelectField:
    "[data-test-id='cancel-fulfillment-select-field']",
  orderFulfillmentFrame: "[data-test-id='order-fulfillment']",
  refundButton: '[data-test-id="refund-button"]',
  fulfillMenuButton: '[data-test-id="fulfill-menu"]',
  priceCellFirstRowOrderDetails: "[id='glide-cell-4-0']",
  productNameSecondRowOrderDetails: "[id='glide-cell-1-1']",
  quantityCellFirstRowOrderDetails: "[id='glide-cell-3-0']",
  discountFixedPriceButton: '[data-test-id="FIXED"]',
  discountAmountField: '[data-test-id="price-field"]',
  discountReasonField: '[data-test-id="discount-reason"]',
  orderSummarySubtotalPriceRow: '[data-test-id="order-subtotal-price"]',
  orderSummaryTotalPriceRow: '[data-test-id="order-total-price"]',
  dataGridTable: "[data-testid='data-grid-canvas']",
  productDeleteFromRowButton: "[data-test-id='row-action-button']",
  markAsPaidButton: '[data-test-id="markAsPaidButton"]',
  grantRefundButton: '[data-test-id="grantRefundButton"]',
  transactionReferenceInput: '[data-test-id="transaction-reference-input"]',
  orderTransactionsList: '[data-test-id="orderTransactionsList"]',
  captureManualTransactionButton:
    '[data-test-id="captureManualTransactionButton"]',
};
export const ADD_PRODUCT_TO_ORDER_DIALOG = {
  productRow: "[data-test-id='product']",
  productName: "[data-test-id='product-name']",
  productVariant: "[data-test-id='variant']",
  checkbox: "[data-test-id='checkbox']",
};
