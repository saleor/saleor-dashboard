declare module "*.jpg";
declare module "*.png";
declare module "*.svg" {
  const content: any;
  export default content;
}

declare const FLAGS_SERVICE_ENABLED: boolean;
declare const FLAGSMITH_ID: string;
declare const FLAGS: Record<string, string>;

declare interface Window {
  PasswordCredential: PasswordCredential;
  __SALEOR_CONFIG__: {
    API_URL: string;
    APP_MOUNT_URI: string;
    APPS_MARKETPLACE_API_URI?: string;
    APPS_TUNNEL_URL_KEYWORDS?: string;
    IS_CLOUD_INSTANCE?: string;
  };
}
