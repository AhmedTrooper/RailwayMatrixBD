export interface AuthorizationStoreInterface {
  token: null | string;
  setToken: (token: string | null) => void;
  uudid: string | null;
  setUUDId: (uudid: string | null) => void;
  ssdk: string | null;
  setSSDK: (ssdk: string | null) => void;
  resetAuthData: () => void;
}
