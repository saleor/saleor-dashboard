/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FLAGSMISH_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
