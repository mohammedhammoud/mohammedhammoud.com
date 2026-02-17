export type DataType = "jobs" | "certificates" | "awards";

export interface Job {
  title: string;
  company: string;
  location: string;
  period: string;
  responsibilities: string[];
}

export interface Certificate {
  title: string;
  year: string;
  description: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Award {
  title: string;
  year: string;
  description: string;
}
