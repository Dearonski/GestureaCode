import { mouse, Point, keyboard, Key, Button, screen } from "@nut-tree/nut-js";
import { app, BrowserWindow, ipcMain, net, protocol } from "electron";
import path from "path";
import MenuBuilder from "./menu";
import i18n, { SupportedLanguages } from "../i18n";
import { EngLetters, RusLetters } from "../renderer/utils/canvasUtils";
import { store } from "../electronStore";
import { Rule } from "postcss";

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

    let lastSize = mainWindow.getSize();
    let lastPos = mainWindow.getPosition();

    i18n.on("languageChanged", (language: SupportedLanguages) => {
        menuBuilder.buildMenu();
        store.set("language", language);
        mainWindow.webContents.send("update-language", language);
    });

    ipcMain.on("request-language", (event) => {
        event.reply("response-language", i18n.language);
    });

    ipcMain.on("move-mouse", async (event, x: number, y: number) => {
        await mouse.move([new Point(x, y)]);
    });

    ipcMain.on(
        "input-letter",
        async (event, numOfLetter: number, language: "ru" | "en") => {
            if (language === "en") {
                await keyboard.type(EngLetters[numOfLetter]);
            } else {
                await keyboard.type(RusLetters[numOfLetter]);
            }
        }
    );

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

    ipcMain.on("request-screen-size", async (event) => {
        event.reply(
            "response-screen-size",
            await screen.width(),
            await screen.height()
        );
    });

    mainWindow.addListener("blur", () => {
        mainWindow.setMinimumSize(360, 250);
        mainWindow.setResizable(false);
        mainWindow.setAlwaysOnTop(true);
        lastSize = mainWindow.getSize();
        lastPos = mainWindow.getPosition();
        mainWindow.setSize(360, 200, true);
        mainWindow.setPosition(1100, 50, true);
    });

    mainWindow.addListener("focus", () => {
        mainWindow.setMinimumSize(800, 600);
        mainWindow.setResizable(true);
        // mainWindow.setAlwaysOnTop(false);
        mainWindow.setSize(
            lastSize ? lastSize[0] : 800,
            lastSize ? lastSize[1] : 600,
            true
        );
        lastPos && mainWindow.setPosition(lastPos[0], lastPos[1], true);
    });

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
