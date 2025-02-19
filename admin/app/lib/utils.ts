import clsx, { ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { config } from "../env/config";
import { api } from "../env/api";

export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes));

export const getEnvironment = (): string => {
  if (typeof window === "undefined") {
    return "prod"; // Default to 'local' or another value for static export
  }

  const url = window.location.hostname;
  
  if (url.includes("localhost")) {
    return "local";
  } else if (url.includes("u-stg.cisco.com")) {
    return "stage";
  } else if (url.includes("u-dev.cisco.com")) {
    return "dev";
  } else if (url.includes("u.cisco.com")) {
    return "prod";
  } else {
    return "unknown";
  }
};
export const getBaseUrl = (env: string,apicall : string): string => {
    console.log(config[env]+api[apicall],'config');
    return config[env]+api[apicall];
  };
