import { mouse, Point, keyboard, Key, Button } from "@nut-tree/nut-js";
import { app, BrowserWindow, ipcMain, net, protocol } from "electron";
import path from "path";
import MenuBuilder from "./menu";
import i18n, { SupportedLanguages } from "../i18n";
import { EngLetters } from "../renderer/hooks/hookUtils";
import { store } from "../electronStore";

protocol.registerSchemesAsPrivileged([
    {
        scheme: "static",
        privileges: { supportFetchAPI: true, bypassCSP: true },
    },
]);

if (require("electron-squirrel-startup")) {
    app.quit();
}

const language = store.get("language", null) as SupportedLanguages | null;

if (language !== null) {
    i18n.changeLanguage(language);
} else {
    const systemLanguage = app.getLocaleCountryCode();
    i18n.changeLanguage(systemLanguage);
    store.set("language", systemLanguage);
}
// "#0a0a0a"
// "#f5f5f5"
export const createMainWindow = () => {
    const mainWindow = new BrowserWindow({
        trafficLightPosition: { x: 18, y: 12 },
        minHeight: 600,
        width: 900,
        minWidth: 900,
        titleBarStyle: "hidden",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    i18n.on("languageChanged", (language: SupportedLanguages) => {
        menuBuilder.buildMenu();
        store.set("language", language);
        mainWindow.webContents.send("update-language", language);
    });

    ipcMain.on("request-language", (event) => {
        event.reply("response-language", i18n.language);
    });

    ipcMain.on("move-mouse", async (event, x: number, y: number) => {
        await mouse.setPosition(new Point(x, y));
    });

    ipcMain.on("input-letter", async (event, numOfLetter: number) => {
        await keyboard.type(EngLetters[numOfLetter]);
    });

    ipcMain.on("backspace-press", async () => {
        await keyboard.pressKey(Key.Backspace);
        await keyboard.releaseKey(Key.Backspace);
    });

    ipcMain.on("enter-press", async () => {
        await keyboard.pressKey(Key.Enter);
        await keyboard.releaseKey(Key.Enter);
    });

    ipcMain.on("space-press", async () => {
        await keyboard.pressKey(Key.Space);
        await keyboard.releaseKey(Key.Space);
    });

    ipcMain.on("request-mouse-pos", async (event) => {
        event.reply("response-mouse-pos", await mouse.getPosition());
    });

    ipcMain.on("volume-up", async () => {
        await keyboard.pressKey(Key.AudioVolUp);
        await keyboard.releaseKey(Key.AudioVolUp);
    });

    ipcMain.on("volume-down", async () => {
        await keyboard.pressKey(Key.AudioVolDown);
        await keyboard.releaseKey(Key.AudioVolDown);
    });

    ipcMain.on("next-track", async () => {
        await keyboard.pressKey(Key.AudioNext);
        await keyboard.releaseKey(Key.AudioNext);
    });

    ipcMain.on("previous-track", async () => {
        await keyboard.pressKey(Key.AudioPrev);
        await keyboard.releaseKey(Key.AudioPrev);
    });

    ipcMain.on("play-track", async () => {
        await keyboard.pressKey(Key.AudioPlay);
        await keyboard.releaseKey(Key.AudioPlay);
    });

    ipcMain.on("left-click", async () => {
        await mouse.click(Button.LEFT);
    });

    ipcMain.on("right-click", async () => {
        await mouse.click(Button.RIGHT);
    });

    // mainWindow.addListener("blur", () => {
    //     mainWindow.setMinimumSize(360, 200);
    //     mainWindow.setResizable(false);
    //     mainWindow.setAlwaysOnTop(true);
    //     lastSize = mainWindow.getSize();
    //     lastPos = mainWindow.getPosition();
    //     mainWindow.setSize(360, 200, true);
    //     mainWindow.setPosition(20, 20, true);
    // });

    // mainWindow.addListener("focus", () => {
    //     mainWindow.setMinimumSize(800, 600);
    //     mainWindow.setResizable(true);
    //     mainWindow.setAlwaysOnTop(false);
    //     mainWindow.setSize(
    //         lastSize ? lastSize[0] : 800,
    //         lastSize ? lastSize[1] : 600,
    //         true
    //     );
    //     lastPos && mainWindow.setPosition(lastPos[0], lastPos[1], true);
    // });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    } else {
        mainWindow.loadFile(
            path.join(
                __dirname,
                `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`
            )
        );
    }

    mainWindow.on("closed", () => {
        i18n.off("languageChanged");
    });

    const menuBuilder = new MenuBuilder(mainWindow);
    menuBuilder.buildMenu();
};

app.whenReady().then(() => {
    protocol.handle("static", (request) => {
        return net.fetch(
            "file://" +
                path.join(__dirname, request.url.slice("static://".length))
        );
    });

    createMainWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
