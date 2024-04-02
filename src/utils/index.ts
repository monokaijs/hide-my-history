import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export * from "./encryption.utils";

export function getFavIcon(u: string) {
  const url = new URL(chrome.runtime.getURL("/_favicon/"));
  url.searchParams.set("pageUrl", u);
  url.searchParams.set("size", "32");
  return url.toString();
}

export function urlToChromeMatchPattern(url: string): string {
  try {
    const urlObj = new URL(url);

    // Extract the domain name and ignore any subdomain distinctions, including 'www'
    let domain = urlObj.hostname;

    // Prefix with '*.' to match all subdomains, including 'www'
    if (!domain.startsWith('*.')) {
      domain = `*.${domain}`;
    }

    // Construct the match pattern with wildcards for protocol and path
    return `*://${domain}/*`;
  } catch (e) {
    console.error('Invalid URL:', e);
    return '';
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}