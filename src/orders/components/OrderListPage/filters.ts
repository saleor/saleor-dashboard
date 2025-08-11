export enum OrderFilterKeys {
  createdAt = "createdAt",
  user = "user",
  status = "status",
  authorizeStatus = "authorizeStatus",
  chargeStatus = "chargeStatus",
  isClickAndCollect = "isClickAndCollect",
  channelId = "channelId",
  isGiftCardUsed = "isGiftCardUsed",
  isGiftCardBought = "isGiftCardBought",
  totalGross = "totalGross",
  totalNet = "totalNet",
  hasInvoices = "hasInvoices",
  hasFulfillments = "hasFulfillments",
  invoicesCreatedAt = "invoices.createdAt",
  metadata = "metadata",
}

export enum OrderFilterGiftCard {
  bought = "bought",
  paid = "paid",
}
