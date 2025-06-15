export interface ApplicationInformation {
  applicationVersion: string | null;
  metadataUrl:string;
  setApplicationVersion: (v: string | null) => void;
}
