export interface Metadata {
  version: string;
  release_date: string;
  features: string[];
  fixed_errors: string[];
  notes: string | null;
  release_url: string | null;
  author: string | null;
  severity: "low" | "medium" | "high";
  platforms: string[];
}
