export const returnsExchangeSection = "/returns-exchange";

export const returnsQueuePath = `${returnsExchangeSection}/returns`;
export const requestDetailPath = (requestId: string) =>
  `${returnsExchangeSection}/returns/${requestId}`;
export const logCallPath = (requestId: string) =>
  `${returnsExchangeSection}/returns/${requestId}/log-call`;
export const sizeSelectionPath = (requestId: string) =>
  `${returnsExchangeSection}/returns/${requestId}/exchange`;

export const manualExchangeListPath = `${returnsExchangeSection}/manual`;
export const manualExchangeNewPath = `${returnsExchangeSection}/manual/new`;
export const manualExchangeNewOrderPath = (orderId: string) =>
  `${returnsExchangeSection}/manual/new/${orderId}`;
export const manualExchangeNewSizePath = (orderId: string, variantSku: string) =>
  `${returnsExchangeSection}/manual/new/${orderId}/${variantSku}`;
export const manualExchangeDetailPath = (mxId: string) =>
  `${returnsExchangeSection}/manual/${mxId}`;

export const notificationSettingsPath = `${returnsExchangeSection}/settings`;
