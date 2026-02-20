export const LOCALES = ["en", "sv"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export const TABS = ["blog", "experience", "about"] as const;
export type TabKey = (typeof TABS)[number];

export const C = {
  LOCALES: { en: "en-US", sv: "sv-SE" },
  OG_LOCALES: { en: "en_US", sv: "sv_SE" },
  DEFAULT_LOCALE,
  TABS,
  STORAGE_KEYS: {
    THEME: "theme",
  },
  SEGMENT_TRANSLATIONS: {
    en: {
      blog: "blog",
      experience: "experience",
      about: "about",
    },
    sv: {
      blog: "blogg",
      experience: "erfarenhet",
      about: "om",
    },
  },
  SITE: {
    name: "Mohammed Hammoud",
    url: "http://www.mohammedhammoud.com/",
    gaMeasurementId: "G-FDJ1WXYXRJ",
    social: {
      github: "https://github.com/mohammedhammoud/",
      linkedin: "https://www.linkedin.com/in/mohammed-hammoud/",
    },
    githubUserId: "5408383",
  },
} as const;
