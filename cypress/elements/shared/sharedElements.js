export const SHARED_ELEMENTS = {
  header: "[data-test-id='page-header']",
  progressBar: '[role="progressbar"]',
  skeleton: '[data-test-id="skeleton"]',
  table: 'table[class*="Table"]',
  notificationSuccess: '[data-test="notification-success"]',
  richTextEditor: {
    empty: '[class*="codex-editor--empty"]'
  }
};

export const selectorWithDataValue = value => `[data-value="${value}"]`;
