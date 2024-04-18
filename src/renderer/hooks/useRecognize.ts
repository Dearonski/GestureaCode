import LandMarksMethods from "../utils/landMarksMethods";
import useCheckboxStore from "./useCheckboxStore";

const eqArr = (a: number[], b: number[]) => {
    return JSON.stringify(a) === JSON.stringify(b);
};

export const useRecognize = () => {
    const { gestureState } = useCheckboxStore();

    const recognizeGesture = (landMarks: LandMarksMethods) => {
        const fingersUp = landMarks.fingersUp();
        if (fingersUp) {
            if (eqArr(fingersUp.slice(1), [1, 1, 0, 0])) {
                if (landMarks.findDistance(4, 8) < 35) {
                    return gestureState.leftClick
                        ? "Left Click"
                        : "None Gesture";
                } else if (landMarks.findDistance(4, 12) < 35) {
                    return gestureState.rightClick
                        ? "Right Click"
                        : "None Gesture";
                } else {
                    return gestureState.movingCursor
                        ? "Mouse Moving"
                        : "None Gesture";
                }
            } else if (eqArr(fingersUp, [0, 1, 0, 0, 0])) {
                return gestureState.keyboardMode ? "Drawing" : "None Gesture";
            } else if (eqArr(fingersUp, [1, 1, 0, 0, 0])) {
                return gestureState.keyboardMode
                    ? "Drawing pause"
                    : "None Gesture";
            } else if (eqArr(fingersUp, [1, 1, 0, 0, 1])) {
                return gestureState.volumeChange
                    ? "Volume Change"
                    : "None Gesture";
            } else if (eqArr(fingersUp.slice(1), [1, 1, 1, 1])) {
                if (landMarks.findDistance(4, 16) < 30) {
                    return gestureState.switchingTracks
                        ? "Previous track"
                        : "None Gesture";
                } else if (landMarks.findDistance(4, 12) < 30) {
                    return gestureState.switchingTracks
                        ? "Next track"
                        : "None Gesture";
                } else if (landMarks.findDistance(4, 20) < 30) {
                    return gestureState.keyboardMode
                        ? "Play/Pause"
                        : "None Gesture";
                } else if (landMarks.findDistance(4, 8) < 30) {
                    return gestureState.keyboardMode
                        ? "ChangeLanguage"
                        : "None Gesture";
                } else {
                    return "None Gesture";
                }
            } else {
                return "None Gesture";
            }
        }
    };

    return { recognizeGesture };
};
