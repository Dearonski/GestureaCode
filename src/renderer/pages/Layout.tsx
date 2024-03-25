import { useEffect } from "react";
import i18n, { SupportedLanguages } from "../../i18n";

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    useEffect(() => {
        window.electronAPI.requests.requestLanguage();
    }, []);

    useEffect(() => {
        window.electronAPI.responses.responseLanguage(
            (language: SupportedLanguages) => {
                i18n.changeLanguage(language);
            }
        );
    }, [window.electronAPI.responses.responseLanguage]);

    useEffect(() => {
        window.electronAPI.onUpdateLanguage((language: SupportedLanguages) => {
            i18n.changeLanguage(language);
        });
    }, [window.electronAPI.onUpdateLanguage]);

    return (
        <div className="flex flex-col dark:bg-neutral-950 bg-neutral-100 overflow-y-hidden h-screen">
            <header className="h-10 titleBar"></header>
            <main className="h-[calc(100vh-40px)]">{children}</main>
        </div>
    );
};
