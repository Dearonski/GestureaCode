import { app, Menu, BrowserWindow, MenuItemConstructorOptions } from "electron";
import i18n from "../i18n";

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
    selector?: string;
    submenu?: DarwinMenuItemConstructorOptions[] | Menu;
}

export default class MenuBuilder {
    mainWindow: BrowserWindow;

    constructor(mainWindow: BrowserWindow) {
        this.mainWindow = mainWindow;
    }

    buildMenu(): Menu {
        const template = this.buildDarwinTemplate();

        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);

        return menu;
    }

    buildDarwinTemplate(): MenuItemConstructorOptions[] {
        const subMenuAbout: DarwinMenuItemConstructorOptions = {
            label: app.name,
            submenu: [
                {
                    label: i18n.t("Hide Gesturea", { ns: "menu" }),
                    accelerator: "Command+H",
                    selector: "hide:",
                },
                {
                    label: i18n.t("Hide Others", { ns: "menu" }),
                    accelerator: "Command+Shift+H",
                    selector: "hideOtherApplications:",
                },
                {
                    label: i18n.t("Show All", { ns: "menu" }),
                    selector: "unhideAllApplications:",
                },
                { type: "separator" },
                {
                    label: i18n.t("Quit Gesturea", { ns: "menu" }),
                    accelerator: "Command+Q",
                    click: () => {
                        app.quit();
                    },
                },
            ],
        };
        const subMenuView: MenuItemConstructorOptions = {
            label: i18n.t("View", { ns: "menu" }),
            submenu: [
                {
                    label: i18n.t("Reload", { ns: "menu" }),
                    accelerator: "Command+R",
                    click: () => {
                        this.mainWindow.webContents.reload();
                    },
                },
                {
                    label: i18n.t("Toggle Full Screen", { ns: "menu" }),
                    accelerator: "Ctrl+Command+F",
                    click: () => {
                        this.mainWindow.setFullScreen(
                            !this.mainWindow.isFullScreen()
                        );
                    },
                },
                {
                    label: i18n.t("Toggle Developer Tools", { ns: "menu" }),
                    accelerator: "Alt+Command+I",
                    click: () => {
                        this.mainWindow.webContents.toggleDevTools();
                    },
                },
            ],
        };
        const subMenuWindow: DarwinMenuItemConstructorOptions = {
            label: i18n.t("Window", { ns: "menu" }),
            submenu: [
                {
                    label: i18n.t("Minimize", { ns: "menu" }),
                    accelerator: "Command+M",
                    selector: "performMiniaturize:",
                },
                {
                    label: i18n.t("Close", { ns: "menu" }),
                    accelerator: "Command+W",
                    selector: "performClose:",
                },
                { type: "separator" },
                {
                    label: i18n.t("Bring All to Front", { ns: "menu" }),
                    selector: "arrangeInFront:",
                },
            ],
        };
        const subMenuLanguage: DarwinMenuItemConstructorOptions = {
            label: i18n.t("Language", { ns: "menu" }),
            submenu: [
                {
                    label: i18n.t("English", { ns: "menu" }),
                    type: "radio",
                    checked: i18n.language === "EN",
                    click: () => {
                        i18n.changeLanguage("EN");
                    },
                },
                {
                    label: i18n.t("Russian", { ns: "menu" }),
                    type: "radio",
                    checked: i18n.language === "RU",
                    click: () => {
                        i18n.changeLanguage("RU");
                    },
                },
            ],
        };

        return [subMenuAbout, subMenuView, subMenuWindow, subMenuLanguage];
    }
}
