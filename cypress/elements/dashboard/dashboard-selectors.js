export const DASHBOARD_SELECTORS = {
  sales: "div:nth-child(1) > [class*='HomeAnalyticsCard-cardContent']",
  orders: "div:nth-child(2) > [class*='HomeAnalyticsCard-cardContent']",
  activity: "[class*='Grid-root'] > div:nth-child(2) > [class*='MuiPaper']",
  topProducts:
    "[class*='Grid-root'] > div:nth-child(1) > [class*='MuiPaper']:nth-child(4)",
  ordersReadyToFulfill: "[class*='HomeNotificationTable'] > tr:nth-child(1)",
  paymentsWaitingForCapture:
    "[class*='HomeNotificationTable'] > tr:nth-child(2)",
  productsOutOfStock: "[class*='HomeNotificationTable'] > tr:nth-child(3)"
};
