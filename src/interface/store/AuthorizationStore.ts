export interface AuthorizationStoreInterface {

  mobileNumber: string | null;
  loginPassword: string | null;
  bearerToken: string | null;
  isLoggedIn: boolean;
  loginFailed: boolean;
  setMobileNumber: (value: string | null) => void;
  setLoginPassword: (value: string | null) => void;
  setBearerToken: (value: string | null) => void;
  setIsLoggedIn: (value: boolean) => void;
  setLoginFailed: (value: boolean) => void;
  loginUrl: string;
  fetchToken: () => Promise<void>;
  editPasswordEnable:boolean;
  setEditPasswordEnable: (value: boolean) => void;
}

export const inValidAuthData = [null, undefined, ""];

export interface ResponseUser {
  passport: null | string;
  is_submitted_for_manual_verification: boolean;
  is_email_verification_required: boolean;
  is_email_verified: number;
  nid_validated: number;
  is_nid_verification_required: boolean;
}

export interface ResponseData {
  message: string;
  nid_validated: number;
  token: string;
  user: ResponseUser;
}

export interface ApiError {
  code: number;
  messages: string[];
}

export interface ParsedJsonResponse {
  data: ResponseData;
}

export interface ValidationErrorResponse {
  error: {
    code: 422;
    messages: {
      [field: string]: string[]; //mobile_number: ["The mobile number must be valid..."]
    };
  };
  extra: {
    hash: string;
  };
}

export interface AuthErrorResponse {
  error: {
    code: 422;
    messages: string[]; //  ["Invalid Mobile Number Or Password"]
  };
  extra: {
    hash: string;
  };
}
