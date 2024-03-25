import { useEffect, useRef, useState } from "react";
import { Point } from "@nut-tree/nut-js";
import { env, InferenceSession, Tensor } from "onnxruntime-web";
import { Gestures, clearCanvas, convertImageData, drawLine } from "./hookUtils";

import { LandMarksMethods } from "../utils/Gestures";

export const useExecuteGesture = () => {
    const lastGesture = useRef<Gestures>(null);
    const mousePos = useRef<Point>(null);
    const mouseTrackingCoords = useRef<Point>(null);
    const lastVolume = useRef<number>(0);
    const timer = useRef<boolean>(false);
    const lastDrawing = useRef<Point>(null);

    const [engLetters, setEngLetters] = useState<InferenceSession>(null);

    const clearTimer = () => {
        setTimeout(() => {
            timer.current = false;
        }, 700);
    };

    const loadModel = async () => {
        env.wasm.wasmPaths = "static://dist/";
        setEngLetters(await InferenceSession.create("static://eng.onnx"));
    };

    useEffect(() => {
        loadModel();
    }, []);

    useEffect(() => {
        window.electronAPI.responses.responseMousePos((pos: Point) => {
            mousePos.current = pos;
        });
    }, [window.electronAPI.responses.responseMousePos]);

    const executeGesture = async (
        gesture: Gestures,
        landMarks: LandMarksMethods,
        drawingCtx: CanvasRenderingContext2D
    ) => {
        switch (gesture) {
            case "Drawing":
                if (lastDrawing.current === null) {
                    const trackingFinger = landMarks.results[8];
                    lastDrawing.current = {
                        x: trackingFinger.x,
                        y: trackingFinger.y,
                    };
                }
                if (drawingCtx) {
                    const trackingFinger = landMarks.results[8];
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
                break;
            case "Mouse Moving":
                if (lastGesture.current !== "Mouse Moving") {
                    window.electronAPI.requests.requestMousePos();
                    const trackingFinger = landMarks.results[5];
                    mouseTrackingCoords.current = {
                        x: trackingFinger.x,
                        y: trackingFinger.y,
                    };
                }
                if (mouseTrackingCoords.current && mousePos.current) {
                    const trackingFinger = landMarks.results[5];
                    const x =
                        (mouseTrackingCoords.current.x - trackingFinger.x) *
                            1.14 +
                        mousePos.current.x;
                    const y =
                        (trackingFinger.y - mouseTrackingCoords.current.y) *
                            1.14 +
                        mousePos.current.y;
                    window.electronAPI.actions.moveMouse(x, y);
                }
                break;
            case "Volume Change":
                if (lastVolume.current) {
                    const volume = landMarks.results[9].y;
                    const volumeDiff = Math.abs(lastVolume.current - volume);
                    if (volumeDiff > 5 && volume < lastVolume.current) {
                        window.electronAPI.actions.volumeUp();
                    } else if (volumeDiff > 5 && volume > lastVolume.current) {
                        window.electronAPI.actions.volumeDown();
                    }
                    lastVolume.current = landMarks.results[9].y;
                } else {
                    lastVolume.current = landMarks.results[9].y;
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
                if (!timer.current && lastGesture.current != "Play/Pause") {
                    window.electronAPI.actions.playTrack();
                    timer.current = true;
                    clearTimer();
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
            case "Backspace":
                if (!timer.current) {
                    window.electronAPI.actions.backspacePress();
                    timer.current = true;
                    clearTimer();
                }
                break;
            case "Enter":
                if (!timer.current) {
                    window.electronAPI.actions.enterPress();
                    timer.current = true;
                    clearTimer();
                }
                break;
            case "Space":
                if (!timer.current) {
                    window.electronAPI.actions.spacePress();
                    timer.current = true;
                    clearTimer();
                }
                break;
            case "None Gesture":
                lastVolume.current = 0;
                mousePos.current = null;
                mouseTrackingCoords.current = null;
                lastDrawing.current = null;
                if (lastGesture.current === "Drawing" && !timer.current) {
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

                    const inputTensor = new Tensor(
                        "float32",
                        preparedImageData,
                        [3, landMarks.height, landMarks.width]
                    );

                    const feeds: Record<string, Tensor> = {};
                    feeds[engLetters.inputNames[0]] = inputTensor;
                    const resultsData: Record<string, Tensor> =
                        await engLetters.run(feeds);

                    const results: number[] = Array.prototype.slice.call(
                        resultsData[engLetters.outputNames[0]].data
                    );

                    window.electronAPI.actions.inputLetter(
                        results.findIndex((el) => el === Math.max(...results))
                    );

                    clearCanvas(drawingCtx, landMarks.width, landMarks.height);
                    timer.current = true;
                    clearTimer();
                }
                break;
        }
        if (lastGesture.current !== gesture) {
            lastGesture.current = gesture;
        }
    };

    return { executeGesture };
};
