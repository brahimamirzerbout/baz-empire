/**
 * Ad Providers — stub for ad platform integrations
 * These exports are expected by the ads API routes
 */

export interface AdProvider {
  id: string;
  name: string;
  connected: boolean;
}

export const adProviders: AdProvider[] = [
  { id: "google", name: "Google Ads", connected: false },
  { id: "facebook", name: "Facebook Ads", connected: false },
  { id: "linkedin", name: "LinkedIn Ads", connected: false },
  { id: "twitter", name: "X Ads", connected: false },
  { id: "tiktok", name: "TikTok Ads", connected: false },
];

export const adProviderList = adProviders;

export function adProvidersWith(config?: any): AdProvider[] {
  return adProviders.map(p => ({ ...p, ...config }));
}

// Additional exports expected by ads API routes
export const providerList = adProviders;
export const providerMap = Object.fromEntries(adProviders.map(p => [p.id, p]));
export const providers = adProviders;
