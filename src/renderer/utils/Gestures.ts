import { NormalizedLandmarkList } from "@mediapipe/drawing_utils";
import { HandLandmarkerResult } from "@mediapipe/tasks-vision";

type FingerPosition = {
    x: number;
    y: number;
};

export class LandMarksMethods {
    results: FingerPosition[];
    labelHand: string | "Right" | "Left";
    fingersIds = [8, 12, 16, 20];
    width: number;
    height: number;

    constructor(results: HandLandmarkerResult, width: number, height: number) {
        this.results = LandMarksMethods.findPosition(
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
        if (
            (this.results[4].x > this.results[17].x &&
                this.labelHand == "Right") ||
            (this.results[4].x < this.results[17].x && this.labelHand == "Left")
        ) {
            if (this.results.length) {
                const fingers: number[] = [];
                if (this.results[4].x > this.results[2].x) {
                    fingers.push(this.labelHand == "Left" ? 0 : 1);
                } else {
                    fingers.push(this.labelHand == "Left" ? 1 : 0);
                }
                this.fingersIds.map((fingersId) => {
                    if (
                        this.results[fingersId].y >
                        this.results[fingersId - 3].y
                    ) {
                        fingers.push(0);
                    } else {
                        fingers.push(1);
                    }
                });
                return fingers;
            }
        } else {
            return null;
        }
    }

    findDistance(p1: number, p2: number) {
        if (this.results.length) {
            return Math.abs(
                Math.round(
                    Math.hypot(
                        this.results[p2].x - this.results[p1].x,
                        this.results[p2].y - this.results[p1].y
                    )
                )
            );
        }
    }
}
