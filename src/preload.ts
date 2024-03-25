import { Point } from "@nut-tree/nut-js";
import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";
import { SupportedLanguages } from "./i18n";

export const electronApi = {
    store: {},
    actions: {
        moveMouse: (x: number, y: number) =>
            ipcRenderer.send("move-mouse", x, y),
        inputLetter: (numOfLetter: number) =>
            ipcRenderer.send("input-letter", numOfLetter),
        volumeUp: () => ipcRenderer.send("volume-up"),
        volumeDown: () => ipcRenderer.send("volume-down"),
        nextTrack: () => ipcRenderer.send("next-track"),
        previousTrack: () => ipcRenderer.send("previous-track"),
        playTrack: () => ipcRenderer.send("play-track"),
        leftClick: () => ipcRenderer.send("left-click"),
        rightClick: () => ipcRenderer.send("right-click"),
        backspacePress: () => ipcRenderer.send("backspace-press"),
        spacePress: () => ipcRenderer.send("space-press"),
        enterPress: () => ipcRenderer.send("enter-press"),
    },
    responses: {
        responseLanguage: (callback: (language: SupportedLanguages) => void) =>
            ipcRenderer.once(
                "response-language",
                (_event: IpcRendererEvent, language: SupportedLanguages) =>
                    callback(language)
            ),
        responseMousePos: (callback: (pos: Point) => void) =>
            ipcRenderer.on(
                "response-mouse-pos",
                (_event: IpcRendererEvent, pos: Point) => callback(pos)
            ),
    },
    requests: {
        requestLanguage: () => ipcRenderer.send("request-language"),
        requestMousePos: () => ipcRenderer.send("request-mouse-pos"),
    },
    onUpdateLanguage: (callback: (language: SupportedLanguages) => void) => {
        ipcRenderer.on(
            "update-language",
            (_event: IpcRendererEvent, language: SupportedLanguages) =>
                callback(language)
        );
    },
};

contextBridge.exposeInMainWorld("electronAPI", electronApi);
