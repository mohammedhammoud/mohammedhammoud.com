export const translations = {
  en: {
    "site.title": "Mohammed Hammoud",
    "site.description":
      "Senior full-stack developer based in Stockholm. TypeScript, React, SolidJS, Python, Django.",

    "nav.blog": "Blog",
    "nav.experience": "Experience",
    "nav.about": "About me",

    "blog.description":
      "Personal notes on software architecture, frontend systems, and backend design, focused on clear explanations and solutions that work in practice.",
    "blog.readingTime": "{{minutes}} min read",

    "profile.name": "Mohammed Hammoud",
    "profile.bio":
      "Senior full-stack developer building scalable web and mobile products with a strong UX focus. TypeScript, React, SolidJS, Python, Django. Based in Stockholm.",

    "experience.title": "Experience",
    "experience.awards": "Awards",
    "experience.certificates": "Certificates",
    "experience.credentialId": "Credential ID:",

    "social.github": "GitHub",
    "social.linkedin": "LinkedIn",

    "theme.toggle": "Toggle theme",

    "404.title": "404 - Page Not Found",
    "404.heading": "Page not found",
    "404.message": "The page you are looking for does not exist.",
    "404.goHome": "Go to homepage",
  },
  sv: {
    "site.title": "Mohammed Hammoud",
    "site.description":
      "Senior full-stack-utvecklare baserad i Stockholm. TypeScript, React, SolidJS, Python, Django.",

    "nav.blog": "Blogg",
    "nav.experience": "Erfarenhet",
    "nav.about": "Om mig",

    "blog.description":
      "Personliga anteckningar om mjukvaruarkitektur, frontendsystem och backenddesign, med fokus på tydliga förklaringar och lösningar som fungerar i praktiken.",
    "blog.readingTime": "{{minutes}} min läsning",

    "profile.name": "Mohammed Hammoud",
    "profile.bio":
      "Senior full-stack-utvecklare som bygger skalbara webb- och mobilprodukter med starkt fokus på användarupplevelse. TypeScript, React, SolidJS, Python, Django. Baserad i Stockholm.",

    "experience.title": "Erfarenhet",
    "experience.awards": "Utmärkelser",
    "experience.certificates": "Certifikat",
    "experience.credentialId": "Credential ID:",

    "social.github": "GitHub",
    "social.linkedin": "LinkedIn",

    "theme.toggle": "Växla tema",

    "404.title": "404 - Sidan hittades inte",
    "404.heading": "Sidan hittades inte",
    "404.message": "Sidan du letar efter finns inte.",
    "404.goHome": "Till startsidan",
  },
} as const;

export type TranslationKey = keyof (typeof translations)["en"];
