export const EN: Language = { code: 'en', language: 'English' }

export const languages = {
  en: EN,
}

export const languageList = Object.values(languages)

// Export this here to avoid dependency cycle
export type LanguageCode = keyof typeof languages

export interface Language {
  code: LanguageCode
  language: string
}
