import { AppErrorCode } from "./graphql";

export const TECHNICAL_HELP_CTA_URL =
  "https://www.getclockwise.com/c/rian-dillon-saleor-io/short-call-with-saleor";

export const DOCS_ULRS = {
  TRANSACTIONS_AUTOMATIC_CHECKOUT_COMPLETION:
    "https://docs.saleor.io/developer/payments/transactions#automatic-checkout-completion",
};

export const MISSING_APPS_TYPEFORM_URL = "https://saleor.typeform.com/to/ecR2msLk";

export const PRODUCT_CONFIGURATION_DOCS_URL =
  "https://docs.saleor.io/developer/products/configuration";
export const ORDER_MANAGEMENT_DOCS_URL = "https://docs.saleor.io/developer/checkout/order-status";
export const API_REFERENCE_DOCS = "https://docs.saleor.io/api-reference/";
export const API_GUIDE_DOCS = "https://docs.saleor.io/api-usage/overview";
export const EXTENDING_WITH_WEBHOOKS_DOCS_URL =
  "https://docs.saleor.io/developer/extending/webhooks/overview";
export const USER_PERMISSIONS_DOCS_URL =
  "https://docs.saleor.io/developer/permissions#user-permissions";
export const ORDER_EVENTS_DOCS_URL =
  "https://docs.saleor.io/developer/extending/api/events#order-events";
export const GIFT_CARD_PRODUCT_DOCS_URL = "https://docs.saleor.io/developer/gift-cards";
export const EXTENSIONS_DOCS_URL = "https://docs.saleor.io/developer/app-store/overview";
export const PLUGINS_DOCS_URL = "https://docs.saleor.io/developer/app-store/overview#plugins";
export const CUSTOM_EXTENSIONS_DOCS_URL =
  "https://docs.saleor.io/developer/extending/webhooks/creating";
export const MANIFEST_FORMAT_DOCS_URL =
  "https://docs.saleor.io/developer/extending/apps/architecture/manifest";
export const EXTENSION_MANIFEST_DOCS =
  "https://docs.saleor.io/developer/extending/apps/developing-apps/app-error-codes";

export const getSpecificManifestErrorDocLink = (errorCode?: AppErrorCode): string => {
  if (!errorCode) {
    return EXTENSION_MANIFEST_DOCS;
  }

  const codeToLinkMap: Record<AppErrorCode, string> = {
    [AppErrorCode.INVALID_URL_FORMAT]: `${EXTENSION_MANIFEST_DOCS}#apperrorcodeinvalid_url_format`,
    [AppErrorCode.INVALID_PERMISSION]: `${EXTENSION_MANIFEST_DOCS}#apperrorcodeinvalid_permission`,
    [AppErrorCode.OUT_OF_SCOPE_PERMISSION]: `${EXTENSION_MANIFEST_DOCS}#apperrorcodeout_of_scope_permission`,
    [AppErrorCode.MANIFEST_URL_CANT_CONNECT]: `${EXTENSION_MANIFEST_DOCS}#apperrorcodemanifest_url_cant_connect`,
    [AppErrorCode.INVALID_MANIFEST_FORMAT]: `${EXTENSION_MANIFEST_DOCS}#apperrorcodeinvalid_manifest_format`,
    [AppErrorCode.REQUIRED]: `${EXTENSION_MANIFEST_DOCS}#apperrorcoderequired`,
    [AppErrorCode.UNIQUE]: `${EXTENSION_MANIFEST_DOCS}#apperrorcodeunique`,
    [AppErrorCode.UNSUPPORTED_SALEOR_VERSION]: `${EXTENSION_MANIFEST_DOCS}#apperrorcodeunsupported_saleor_version`,
    [AppErrorCode.INVALID_CUSTOM_HEADERS]: `${EXTENSION_MANIFEST_DOCS}#apperrorcodeinvalid_custom_headers`,
    [AppErrorCode.GRAPHQL_ERROR]: `${EXTENSION_MANIFEST_DOCS}#apperrorcodegraphql_error`,
    [AppErrorCode.INVALID]: `${EXTENSION_MANIFEST_DOCS}#apperrorcodeinvalid`,
    [AppErrorCode.INVALID_STATUS]: `${EXTENSION_MANIFEST_DOCS}#apperrorcodeinvalid_status`,
    [AppErrorCode.NOT_FOUND]: `${EXTENSION_MANIFEST_DOCS}#apperrorcodenot_found`,
    [AppErrorCode.FORBIDDEN]: EXTENSION_MANIFEST_DOCS, // No docs section
    [AppErrorCode.OUT_OF_SCOPE_APP]: EXTENSION_MANIFEST_DOCS, // No docs sect
  };

  return codeToLinkMap[errorCode] || "";
};
