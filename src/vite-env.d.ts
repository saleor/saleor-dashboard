/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly VITE_DISABLE_STRICT_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*/vite.config.js" {
  const content: any;
  // eslint-disable-next-line import/no-default-export
  export default content;
}
