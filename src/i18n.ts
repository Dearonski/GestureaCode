import i18n, { InitOptions, use } from "i18next";
import { initReactI18next } from "react-i18next";
import enMain from "../public/locales/en/main.json";
import ruMain from "../public/locales/ru/main.json";
import enMenu from "../public/locales/en/menu.json";
import ruMenu from "../public/locales/ru/menu.json";

export const supportedLanguages = ["EN", "RU"];
export type SupportedLanguages = "EN" | "RU";

const config: InitOptions = {
    resources: {
        EN: { main: enMain, menu: enMenu },
        RU: { main: ruMain, menu: ruMenu },
    },
    saveMissing: true,
    supportedLngs: supportedLanguages,
    interpolation: {
        escapeValue: false,
    },
    ns: ["main", "menu"],
};

use(initReactI18next).init(config);

export default i18n;
