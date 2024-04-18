import { HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";
import useModels from "./useModels";
import { Gestures, drawHandLandmarks } from "../utils/canvasUtils";
import LandMarksMethods from "../utils/landMarksMethods";
import { useRecognize } from "./useRecognize";
import { useDebounce } from "./useDebouced";
import { useExecuteGesture } from "./useExecuteGesture";

const useDrawCanvas = (
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    drawingCanvas: HTMLCanvasElement
) => {
    const resultsRef = useRef<HandLandmarkerResult>(null);
    const gestureRef = useRef<Gestures>(null);
    const canvasCtxRef = useRef<CanvasRenderingContext2D>(null);
    const drawingCanvasCtx = useRef<CanvasRenderingContext2D>(null);
    const lastVideoTime = useRef<number>(-1);
    const landMarks = useRef<LandMarksMethods>(null);
    const [gesture, setGesture] = useState<Gestures>(null);
    const [results, setResults] = useState<HandLandmarkerResult>(null);
    const debouncedValue = useDebounce(gestureRef.current, 70);
    const { handLandmarker } = useModels();
    const { recognizeGesture } = useRecognize();
    const { executeGesture } = useExecuteGesture();

    useEffect(() => {
        executeGesture(gesture, landMarks.current, drawingCanvasCtx.current);
    });

    useEffect(() => {
        setGesture(gestureRef.current);
        console.log(gestureRef.current);
    }, [debouncedValue]);

    const drawCanvas = () => {
        if (canvasCtxRef.current) {
            canvasCtxRef.current.drawImage(video, 0, 0);

            const startTimeMs = performance.now();

            if (video && lastVideoTime.current !== video.currentTime) {
                lastVideoTime.current = video.currentTime;
                resultsRef.current = handLandmarker.detectForVideo(
                    video,
                    startTimeMs
                );
            }

            if (resultsRef.current.landmarks[0]) {
                drawHandLandmarks(
                    canvasCtxRef.current,
                    resultsRef.current.landmarks[0]
                );
                setResults(resultsRef.current);
                landMarks.current = new LandMarksMethods(
                    resultsRef.current,
                    video.videoWidth,
                    video.videoHeight
                );
                gestureRef.current = recognizeGesture(landMarks.current);
            }

            requestAnimationFrame(drawCanvas);
        }
    };

    const initializeCanvas = () => {
        if (canvas && video) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvasCtxRef.current = canvas.getContext("2d", {
                desynchronized: true,
            });
            canvasCtxRef.current.setTransform(-1, 0, 0, 1, video.videoWidth, 0);
        }

        if (drawingCanvas && video) {
            drawingCanvas.width = video.videoWidth;
            drawingCanvas.height = video.videoHeight;
            drawingCanvasCtx.current = drawingCanvas.getContext("2d", {
                willReadFrequently: true,
            });
            drawingCanvasCtx.current.setTransform(
                -1,
                0,
                0,
                1,
                video.videoWidth,
                0
            );

            drawingCanvasCtx.current.lineWidth = 25;
            drawingCanvasCtx.current.strokeStyle = "#4f46e5";
            drawingCanvasCtx.current.lineJoin = "round";
        }
    };

    return { drawCanvas, initializeCanvas, results };
};

export default useDrawCanvas;
