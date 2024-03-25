import { Gestures } from "./hookUtils";
import { useEffect, useRef, useState } from "react";
import { LandMarksMethods } from "../utils/Gestures";
import { useDebounce } from "./useDebouced";
import { useAppSelector } from "./reduxHooks";
import { gestureSelector } from "../reducers/gestureSlice";

const eqArr = (a: number[], b: number[]) => {
    return JSON.stringify(a) === JSON.stringify(b);
};

export const useRecognize = () => {
    const recognizedGestureRef = useRef<Gestures>(null);
    const debouncedValue = useDebounce(recognizedGestureRef.current, 100);
    const [recognizedGesture, setRecongnizedGesture] = useState<Gestures>(null);
    const states = useAppSelector(gestureSelector);

    useEffect(() => {
        setRecongnizedGesture(recognizedGestureRef.current);
    }, [debouncedValue]);

    const recognizeGesture = (landMarks: LandMarksMethods) => {
        const fingersUp = landMarks.fingersUp();
        if (fingersUp) {
            if (eqArr(fingersUp, [0, 1, 1, 0, 0])) {
                if (landMarks.results[8].y > landMarks.results[7].y) {
                    recognizedGestureRef.current = states.leftClick
                        ? "Left Click"
                        : "None Gesture";
                } else if (landMarks.results[12].y > landMarks.results[11].y) {
                    recognizedGestureRef.current = states.rightClick
                        ? "Right Click"
                        : "None Gesture";
                } else {
                    recognizedGestureRef.current = states.movingCursor
                        ? "Mouse Moving"
                        : "None Gesture";
                }
            } else if (eqArr(fingersUp, [0, 1, 0, 0, 0])) {
                recognizedGestureRef.current = states.keyboardMode
                    ? "Drawing"
                    : "None Gesture";
            } else if (eqArr(fingersUp, [1, 1, 0, 0, 0])) {
                recognizedGestureRef.current = states.keyboardMode
                    ? "Drawing pause"
                    : "None Gesture";
            } else if (eqArr(fingersUp, [1, 1, 0, 0, 1])) {
                recognizedGestureRef.current = states.volumeChange
                    ? "Volume Change"
                    : "None Gesture";
            } else if (eqArr(fingersUp.slice(1), [1, 1, 1, 1])) {
                if (landMarks.findDistance(4, 16) < 30) {
                    recognizedGestureRef.current = states.switchingTracks
                        ? "Previous track"
                        : "None Gesture";
                } else if (landMarks.findDistance(4, 12) < 30) {
                    recognizedGestureRef.current = states.switchingTracks
                        ? "Next track"
                        : "None Gesture";
                } else if (landMarks.findDistance(4, 20) < 30) {
                    recognizedGestureRef.current = states.keyboardMode
                        ? "Space"
                        : "None Gesture";
                } else if (landMarks.findDistance(4, 8) < 30) {
                    recognizedGestureRef.current = states.keyboardMode
                        ? "Backspace"
                        : "None Gesture";
                } else if (eqArr(fingersUp.slice(0, 1), [0])) {
                    recognizedGestureRef.current = states.playPause
                        ? "Play/Pause"
                        : "None Gesture";
                } else {
                    recognizedGestureRef.current = "None Gesture";
                }
            } else if (eqArr(fingersUp, [1, 0, 0, 0, 0])) {
                recognizedGestureRef.current = states.keyboardMode
                    ? "Enter"
                    : "None Gesture";
            } else {
                recognizedGestureRef.current = "None Gesture";
            }
        }
    };

    return { recognizeGesture, recognizedGesture };
};
