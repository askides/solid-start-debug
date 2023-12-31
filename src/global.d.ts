/// <reference types="solid-start/env" />

interface ImportMetaEnv {
  readonly VITE_DATABASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
