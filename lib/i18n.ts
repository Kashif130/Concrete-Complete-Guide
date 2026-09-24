export const locales = ["en", "ur", "hi", "pcm", "zh", "id"] as const;
export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: "English",
  ur: "Roman Urdu",
  hi: "हिन्दी",
  pcm: "Naija Pidgin",
  zh: "中文",
  id: "Indonesia",
};

export const defaultLocale: Locale = "en";

export type Dictionary = {
  nav: { brand: string; unofficial: string };
  hero: {
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  live: {
    heading: string;
    tvlLabel: string;
    updated: string;
    loading: string;
    error: string;
    sourceNote: string;
  };
  snapshot: {
    heading: string;
    note: string;
    assetsOnPlatform: string;
    assetsProcessed: string;
    deposits: string;
    volume: string;
    depositors: string;
  };
  model: {
    heading: string;
    deposit: string;
    depositDesc: string;
    get: string;
    getDesc: string;
    earn: string;
    earnDesc: string;
    use: string;
    useDesc: string;
  };
  path: {
    heading: string;
    subheading: string;
    beginner: string;
    beginnerDesc: string;
    intermediate: string;
    intermediateDesc: string;
    advanced: string;
    advancedDesc: string;
    ecosystem: string;
    ecosystemDesc: string;
    reference: string;
    referenceDesc: string;
    readMore: string;
  };
  sidebar: { sections: string; backHome: string };
  doc: { notTranslated: string; onThisPage: string };
  footer: { disclaimerTitle: string; disclaimer: string; rights: string };
  lang: { switcherLabel: string };
};
