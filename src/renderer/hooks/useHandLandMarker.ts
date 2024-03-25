import { HandLandmarker, HandLandmarkerResult } from "@mediapipe/tasks-vision";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "./reduxHooks";
import { camSelector } from "../reducers/camSlice";

import {
    clearCanvas,
    drawHandLandmarks,
    initializeCanvas,
    loadHands,
} from "./hookUtils";

export const useHandLandMarker = (
    webcamRunning: boolean,
    setWebcamRunning: React.Dispatch<React.SetStateAction<boolean>>,
    videoRef: React.MutableRefObject<HTMLVideoElement>,
    videoCanvasRef: React.MutableRefObject<HTMLCanvasElement>,
    drawingCanvasRef: React.MutableRefObject<HTMLCanvasElement>
) => {
    const [handDetector, sethandDetector] = useState<HandLandmarker>(null);
    const requestRef = useRef<number>(0);
    const localStream = useRef<MediaStream>(null);
    const selectedVideoDevice = useAppSelector(camSelector).selectedVideoInput;
    const videoCanvasCtx = useRef<CanvasRenderingContext2D>(null);
    const drawingCanvasCtx = useRef<CanvasRenderingContext2D>(null);
    const resultsRef = useRef<HandLandmarkerResult>(null);
    const [results, setResults] = useState<HandLandmarkerResult>(null);

    useEffect(() => {
        loadHands().then((hands) => sethandDetector(hands));
    }, []);

    const enableCam = () => {
        if (videoRef.current && videoCanvasRef.current) {
            if (!localStream.current) {
                navigator.mediaDevices
                    .getUserMedia({
                        video: {
                            width: 1280,
                            height: 720,
                            frameRate: 60,
                            deviceId: selectedVideoDevice.deviceId,
                        },
                        audio: false,
                    })
                    .then((stream) => {
                        localStream.current = stream;
                        videoRef.current.srcObject = webcamRunning
                            ? null
                            : localStream.current;
                        setWebcamRunning(!webcamRunning);
                    });
            } else {
                setWebcamRunning(!webcamRunning);
            }
        }

        if (webcamRunning === true) {
            localStream.current.getVideoTracks()[0].stop();

            clearCanvas(
                videoCanvasCtx.current,
                videoRef.current.videoWidth,
                videoRef.current.videoHeight
            );

            localStream.current = null;
            cancelAnimationFrame(requestRef.current);
        }
    };

    const predictWebcam = () => {
        if (videoCanvasCtx.current && videoCanvasRef.current) {
            videoCanvasCtx.current.drawImage(videoRef.current, 0, 0);

            let lastVideoTime = -1;

            const startTimeMs = performance.now();
            if (lastVideoTime !== videoRef.current.currentTime) {
                lastVideoTime = videoRef.current.currentTime;
                resultsRef.current = handDetector.detectForVideo(
                    videoRef.current,
                    startTimeMs
                );
            }

            if (resultsRef.current.landmarks[0]) {
                setResults(resultsRef.current);
                drawHandLandmarks(
                    videoCanvasCtx.current,
                    resultsRef.current.landmarks[0]
                );
            }
        } else {
            const { drawingCtx, videoCtx } = initializeCanvas(
                videoCanvasRef.current,
                drawingCanvasRef.current,
                videoRef.current.videoWidth,
                videoRef.current.videoHeight
            );
            videoCanvasCtx.current = videoCtx;
            drawingCanvasCtx.current = drawingCtx;
        }

        if (webcamRunning === true) {
            requestRef.current = requestAnimationFrame(predictWebcam);
        }
    };

    return {
        enableCam,
        predictWebcam,
        results,
        drawingCanvasCtx,
    };
};
