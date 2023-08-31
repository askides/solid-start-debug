/// <reference types="solid-start/env" />

interface ImportMetaEnv {
  readonly VITE_DATABASE_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
