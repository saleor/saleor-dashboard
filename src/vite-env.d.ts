/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly VITE_DISABLE_STRICT_MODE?: string;
  readonly VITE_ENABLE_PERMISSIONS_DEBUGGER?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
