/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_APP_ENV: string;
  /**
   * Data source mode: "mock" | "backend"
   * - "mock" (default): Use mock data only (when backend is not available)
   * - "backend": Use backend API only (when backend is available)
   */
  readonly VITE_DATA_MODE?: "mock" | "backend";
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}





