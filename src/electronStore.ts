import Store from "electron-store";
import { supportedLanguages } from "./i18n";

const schema = {
    language: {
        enum: supportedLanguages,
    },
};

export const store = new Store({ schema });
