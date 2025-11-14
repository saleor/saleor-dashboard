declare module "*.webp";
declare module "*.jpg";
declare module "*.png";
declare module "*.svg" {
  const content: any;
  export default content;
}

declare const FLAGS_SERVICE_ENABLED: boolean;
/**
 * Feature flags available in the application.
 * Notable flags:
 * - FF_USE_STAGING_SCHEMA: Enable staging schema instead of main schema
 */
declare const FLAGS: Record<string, string>;

declare interface Window {
  PasswordCredential: PasswordCredential;
  __SALEOR_CONFIG__: {
    API_URL: string;
    APP_MOUNT_URI: string;
    LOCALE_CODE?: string;
    APPS_MARKETPLACE_API_URL?: string;
    EXTENSIONS_API_URL?: string;
    APPS_TUNNEL_URL_KEYWORDS?: string;
    IS_CLOUD_INSTANCE?: string;
  };
}

declare module "@editorjs/paragraph" {}
