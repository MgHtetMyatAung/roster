import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./locales/en/common.json";
import mmCommon from "./locales/mm/common.json";
import enAuth from "./locales/en/auth.json";
import mmAuth from "./locales/mm/auth.json";

export const LANG_KEY = "app_lang";

export const DEFAULT_LANG = localStorage.getItem(LANG_KEY) || "mm";

const setLangClass = (lang: string) => {
  document.documentElement.classList.remove("lang-en", "lang-mm");
  document.documentElement.classList.add(`lang-${lang}`);
};

// Initial
setLangClass(DEFAULT_LANG);

// On change
i18n.on("languageChanged", (lang) => {
  setLangClass(lang);
});

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enCommon,
      auth: enAuth,
    },
    mm: {
      common: mmCommon,
      auth: mmAuth,
    },
  },
  lng: DEFAULT_LANG, // default language
  fallbackLng: "en",
  ns: ["common", "auth"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
