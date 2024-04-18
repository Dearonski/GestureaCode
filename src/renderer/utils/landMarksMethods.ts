import { NormalizedLandmarkList } from "@mediapipe/drawing_utils";
import { HandLandmarkerResult } from "@mediapipe/tasks-vision";

type FingerPosition = {
    x: number;
    y: number;
};

class LandMarksMethods {
    results: FingerPosition[];
    preparedResults: NormalizedLandmarkList;
    labelHand: string | "Right" | "Left";
    fingersIds = [8, 12, 16, 20];
    width: number;
    height: number;

    constructor(results: HandLandmarkerResult, width: number, height: number) {
        this.results = results.landmarks[0];
        this.preparedResults = LandMarksMethods.findPosition(
            results.landmarks[0],
            width,
            height
        );
        this.width = width;
        this.height = height;
        this.labelHand = LandMarksMethods.defineHand(results);
    }

    static findPosition(
        results: NormalizedLandmarkList,
        width: number,
        height: number
    ) {
        const landmarks: FingerPosition[] = [];
        if (results) {
            results.map((landmark) => {
                landmarks.push({
                    x: Math.round(landmark.x * width),
                    y: Math.round(landmark.y * height),
                });
            });
        }
        return landmarks;
    }

    static defineHand(results: HandLandmarkerResult) {
        if (results.handedness[0]) {
            return results.handedness[0][0].displayName;
        }
    }

    fingersUp() {
        if (this.preparedResults.length) {
            const fingers: number[] = [];
            if (this.preparedResults[4].x > this.preparedResults[2].x) {
                fingers.push(this.labelHand == "Left" ? 0 : 1);
            } else {
                fingers.push(this.labelHand == "Left" ? 1 : 0);
            }
            this.fingersIds.map((fingersId) => {
                if (
                    this.preparedResults[fingersId].y >
                    this.preparedResults[fingersId - 3].y
                ) {
                    fingers.push(0);
                } else {
                    fingers.push(1);
                }
            });
            return fingers;
        }
    }

    findDistance(p1: number, p2: number) {
        if (this.preparedResults.length) {
            return Math.abs(
                Math.round(
                    Math.hypot(
                        this.preparedResults[p2].x - this.preparedResults[p1].x,
                        this.preparedResults[p2].y - this.preparedResults[p1].y
                    )
                )
            );
        }
    }
}

export default LandMarksMethods;
