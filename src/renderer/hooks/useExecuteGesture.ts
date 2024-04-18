import { useEffect, useRef, useState } from "react";
import { Point } from "@nut-tree/nut-js";
import { Tensor } from "onnxruntime-web";
import {
    Gestures,
    clearCanvas,
    convertImageData,
    drawLine,
} from "../utils/canvasUtils";

import LandMarksMethods from "../utils/landMarksMethods";
import useModels from "./useModels";

type Size = {
    width: number;
    height: number;
};

type Language = "ru" | "en";

export const useExecuteGesture = () => {
    const lastGesture = useRef<Gestures>(null);
    const mousePos = useRef<Point>(null);
    const lastTrackingCoords = useRef<Point>(null);
    const lastVolume = useRef<number>(0);
    const timer = useRef<boolean>(false);
    const lastDrawing = useRef<Point>(null);
    const screenSize = useRef<Size>(null);
    const [language, setLanguage] = useState<Language>("en");
    const { letterClassificationModelEn, letterClassificationModelRu } =
        useModels();

    const clearTimer = () => {
        setTimeout(() => {
            timer.current = false;
        }, 700);
    };

    useEffect(() => {
        window.electronAPI.requests.requestScreenSize();
    }, []);

    useEffect(() => {
        window.electronAPI.responses.responseScreenSize(
            (width: number, height: number) => {
                screenSize.current = { width: width, height: height };
            }
        );
    }, [window.electronAPI.responses.responseScreenSize]);

    useEffect(() => {
        window.electronAPI.responses.responseMousePos((pos: Point) => {
            mousePos.current = pos;
        });
    }, [window.electronAPI.responses.responseMousePos]);

    useEffect(() => {
        window.electronAPI.responses.responseScreenSize(
            (width: number, height: number) => {
                screenSize.current = { width: width, height: height };
            }
        );
    }, [window.electronAPI.responses.responseScreenSize]);

    const executeGesture = async (
        gesture: Gestures,
        landMarks: LandMarksMethods,
        drawingCtx: CanvasRenderingContext2D
    ) => {
        switch (gesture) {
            case "Drawing":
                if (lastDrawing.current === null) {
                    const trackingFinger = landMarks.preparedResults[8];
                    lastDrawing.current = {
                        x: trackingFinger.x,
                        y: trackingFinger.y,
                    };
                }
                if (drawingCtx) {
                    const trackingFinger = landMarks.preparedResults[8];
                    drawLine(
                        drawingCtx,
                        lastDrawing.current.x,
                        lastDrawing.current.y,
                        trackingFinger.x,
                        trackingFinger.y
                    );
                    lastDrawing.current = {
                        x: trackingFinger.x,
                        y: trackingFinger.y,
                    };
                }
                break;
            case "Drawing pause":
                lastDrawing.current = null;
                break;
            case "Mouse Moving":
                if (mousePos.current) {
                    const trackingFinger = LandMarksMethods.findPosition(
                        landMarks.results,
                        screenSize.current.width,
                        screenSize.current.height
                    )[5];
                    const { x, y } = trackingFinger;
                    if (!lastTrackingCoords.current) {
                        lastTrackingCoords.current = {
                            x: screenSize.current.width - x,
                            y: y,
                        };
                    }
                    const deltaX =
                        screenSize.current.width -
                        x -
                        lastTrackingCoords.current.x;
                    const deltaY = y - lastTrackingCoords.current.y;
                    const distance = deltaX ** 2 + deltaY ** 2;
                    let ratio = 0;
                    lastTrackingCoords.current = {
                        x: screenSize.current.width - x,
                        y: y,
                    };
                    if (distance <= 15) {
                        ratio = 0;
                    } else if (distance <= 900) {
                        ratio = 0.07 * distance ** 0.5;
                    } else {
                        ratio = 2.1;
                    }
                    const x1 = mousePos.current.x + deltaX * ratio;
                    const y1 = mousePos.current.y + deltaY * ratio;
                    window.electronAPI.actions.moveMouse(x1, y1);
                    mousePos.current = null;
                } else {
                    window.electronAPI.requests.requestMousePos();
                }
                break;
            case "Volume Change":
                if (lastVolume.current) {
                    const volume = landMarks.preparedResults[9].y;
                    const volumeDiff = Math.abs(lastVolume.current - volume);
                    if (volumeDiff > 5 && volume < lastVolume.current) {
                        window.electronAPI.actions.volumeUp();
                    } else if (volumeDiff > 5 && volume > lastVolume.current) {
                        window.electronAPI.actions.volumeDown();
                    }
                    lastVolume.current = landMarks.preparedResults[9].y;
                } else {
                    lastVolume.current = landMarks.preparedResults[9].y;
                }
                break;
            case "Next track":
                if (!timer.current) {
                    window.electronAPI.actions.nextTrack();
                    timer.current = true;
                    clearTimer();
                }
                break;
            case "Previous track":
                if (!timer.current) {
                    window.electronAPI.actions.previousTrack();
                    timer.current = true;
                    clearTimer();
                }
                break;
            case "Play/Pause":
                if (!timer.current) {
                    window.electronAPI.actions.playTrack();
                    timer.current = true;
                    clearTimer();
                }
                break;
            case "ChangeLanguage":
                if (
                    !timer.current &&
                    lastGesture.current !== "ChangeLanguage"
                ) {
                    if (language == "en") {
                        setLanguage("ru");
                    } else {
                        setLanguage("en");
                    }
                }
                break;
            case "Left Click":
                if (!timer.current) {
                    window.electronAPI.actions.leftClick();
                    timer.current = true;
                    clearTimer();
                }
                break;
            case "Right Click":
                if (!timer.current) {
                    window.electronAPI.actions.rightClick();
                    timer.current = true;
                    clearTimer();
                }
                break;
            case "None Gesture":
                lastVolume.current = 0;
                mousePos.current = null;
                lastTrackingCoords.current = null;
                lastDrawing.current = null;
                break;
        }
        if (
            (lastGesture.current === "Drawing" ||
                lastGesture.current === "Drawing pause") &&
            gesture !== "Drawing" &&
            gesture !== "Drawing pause" &&
            !timer.current
        ) {
            const imageData = drawingCtx.getImageData(
                0,
                0,
                landMarks.width,
                landMarks.height
            ).data;

            const preparedImageData = convertImageData(
                imageData,
                landMarks.width,
                landMarks.height
            );

            const inputTensor = new Tensor("float32", preparedImageData, [
                3,
                landMarks.height,
                landMarks.width,
            ]);

            const feeds: Record<string, Tensor> = {};

            if (language == "en") {
                feeds[letterClassificationModelEn.inputNames[0]] = inputTensor;
                const resultsData: Record<string, Tensor> =
                    await letterClassificationModelEn.run(feeds);

                const results: number[] = Array.prototype.slice.call(
                    resultsData[letterClassificationModelEn.outputNames[0]].data
                );

                window.electronAPI.actions.inputLetter(
                    results.findIndex((el) => el === Math.max(...results)),
                    "en"
                );
                console.log("bebra");
            } else {
                feeds[letterClassificationModelRu.inputNames[0]] = inputTensor;
                const resultsData: Record<string, Tensor> =
                    await letterClassificationModelRu.run(feeds);

                const results: number[] = Array.prototype.slice.call(
                    resultsData[letterClassificationModelRu.outputNames[0]].data
                );

                window.electronAPI.actions.inputLetter(
                    results.findIndex((el) => el === Math.max(...results)),
                    "ru"
                );
            }

            clearCanvas(drawingCtx, landMarks.width, landMarks.height);
            timer.current = true;
            clearTimer();
        }
        if (lastGesture.current !== gesture) {
            lastGesture.current = gesture;
        }
    };

    return { executeGesture };
};
