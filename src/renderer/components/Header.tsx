import TitleBarItem from "./TitlebarItem";
import { useTranslation } from "react-i18next";
import i18next, { changeLanguage } from "i18next";
import useTitleBarStore from "../hooks/useTitleBarStore";
import { CheckIcon } from "@heroicons/react/24/solid";

const Header = () => {
    const { setOpened } = useTitleBarStore();

    const { t } = useTranslation("menu");

    return (
        <header className="h-10">
            {navigator.platform == "Win32" && (
                <div className="pl-4 py-1.5 flex gap-x-1">
                    <TitleBarItem title={t("View")}>
                        <div className="flex flex-col text-left gap-y-2 px-4 py-2">
                            <button className="text-left w-full text-nowrap">
                                {t("Reload")}
                            </button>
                            <button className="text-left w-full text-nowrap">
                                {t("Toggle Full Screen")}
                            </button>
                            <button className="text-left w-full text-nowrap">
                                Toggle Developer Tools
                            </button>
                        </div>
                    </TitleBarItem>
                    <TitleBarItem title={t("Window")}>
                        <div className="flex flex-col text-left gap-y-2 px-4 py-2">
                            <button className="text-left w-full text-nowrap">
                                {t("Minimize")}
                            </button>
                            <button className="text-left w-full text-nowrap">
                                {t("Close")}
                            </button>
                        </div>
                    </TitleBarItem>
                    <TitleBarItem title={t("Language")}>
                        <div className="flex flex-col text-left gap-y-2 pl-2 pr-4 py-2">
                            <button
                                className="text-left w-full text-nowrap"
                                onClick={() => {
                                    changeLanguage("EN");
                                    setOpened("");
                                }}
                            >
                                <div className="flex items-center gap-x-1">
                                    <div className="w-4 h-4">
                                        {i18next.language == "EN" && (
                                            <CheckIcon className="w-4 h-4" />
                                        )}
                                    </div>

                                    {t("English")}
                                </div>
                            </button>
                            <button
                                className="text-left w-full text-nowrap"
                                onClick={() => {
                                    changeLanguage("RU");
                                    setOpened("");
                                }}
                            >
                                <div className="flex items-center gap-x-1">
                                    <div className="w-4 h-4">
                                        {i18next.language == "RU" && (
                                            <CheckIcon className="w-4 h-4" />
                                        )}
                                    </div>
                                    {t("Russian")}
                                </div>
                            </button>
                        </div>
                    </TitleBarItem>
                </div>
            )}
        </header>
    );
};

export default Header;
