import { Metadata } from "../MetaData";

export interface ApplicationInformation {
  applicationVersion: string | null;
  metadataUrl: string;
  setApplicationVersion: (v: string | null) => void;
  isUpdateAvailable: boolean;
  setIsUpdateAvailable: (s: boolean) => void;
  detectUpdate: () => void;
  onlineVersion: string | null;
  setOnlineVersion: (v: string) => void;
  updateMetadata:Metadata | null;
  setUpdateMetadata:(m:Metadata)=>void;
  errorFoundWhileUpdateChecking:boolean;
  setErrorFoundWhileUpdateChecking:(status:boolean)=>void;
  fetchApplicationVersion:()=>void;
}
