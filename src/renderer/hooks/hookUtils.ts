import {
    NormalizedLandmarkList,
    drawConnectors,
    drawLandmarks,
} from "@mediapipe/drawing_utils";
import { HAND_CONNECTIONS } from "@mediapipe/hands";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";

export type Gestures =
    | "Mouse Moving"
    | "Drawing"
    | "Drawing pause"
    | "Volume Change"
    | "Next track"
    | "Previous track"
    | "Play/Pause"
    | "Left Click"
    | "Right Click"
    | "Space"
    | "Enter"
    | "Backspace"
    | "None Gesture";

export const loadHands = async () => {
    const vision = await FilesetResolver.forVisionTasks("static://wasm");

    const hands = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `static://hands.task`,
            delegate: "GPU",
        },
        runningMode: "VIDEO",
        minHandDetectionConfidence: 0.7,
        minHandPresenceConfidence: 0.7,
        minTrackingConfidence: 0.7,
    });

    return hands;
};

export const initializeCanvas = (
    videoCanvas: HTMLCanvasElement,
    drawingCanvas: HTMLCanvasElement,
    width: number,
    height: number
) => {
    videoCanvas.width = width;
    videoCanvas.height = height;
    drawingCanvas.width = width;
    drawingCanvas.height = height;

    const videoCtx = videoCanvas.getContext("2d", {
        desynchronized: true,
    }) as CanvasRenderingContext2D;
    const drawingCtx = drawingCanvas.getContext("2d", {
        willReadFrequently: true,
    }) as CanvasRenderingContext2D;

    drawingCtx.setTransform(-1, 0, 0, 1, width, 0);
    drawingCtx.lineWidth = 25;
    drawingCtx.strokeStyle = "#4f46e5";
    drawingCtx.lineJoin = "round";

    videoCtx.setTransform(-1, 0, 0, 1, width, 0);

    return { drawingCtx, videoCtx };
};

export const clearCanvas = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
) => {
    ctx.clearRect(0, 0, width, height);
};

export const drawHandLandmarks = (
    videoCtx: CanvasRenderingContext2D,
    landmarks: NormalizedLandmarkList
) => {
    drawConnectors(videoCtx, landmarks, HAND_CONNECTIONS, {
        color: "#FFFFFF",
        lineWidth: 5,
    });
    drawLandmarks(videoCtx, landmarks, {
        color: "#4f46e5",
        radius: 5,
    });
};

export const drawLine = (
    ctx: CanvasRenderingContext2D,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number
) => {
    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.closePath();
    ctx.stroke();
};

export const convertImageData = (
    imageData: Uint8ClampedArray,
    width: number,
    height: number
) => {
    const [redArray, greenArray, blueArray] = [
        new Array<number>(),
        new Array<number>(),
        new Array<number>(),
    ];

    for (let i = 0; i < imageData.length; i += 4) {
        redArray.push(imageData[i]);
        greenArray.push(imageData[i + 1]);
        blueArray.push(imageData[i + 2]);
    }

    const transposedData = redArray.concat(greenArray).concat(blueArray);

    const l = transposedData.length;
    const float32Data = new Float32Array(3 * height * width);
    for (let i = 0; i < l; i++) {
        float32Data[i] = transposedData[i] / 255.0;
    }

    return float32Data;
};

export enum EngLetters {
    a,
    b,
    c,
    d,
    e,
    f,
    g,
    h,
    i,
    j,
    k,
    l,
    m,
    n,
    o,
    p,
    q,
    r,
    s,
    t,
    u,
    v,
    w,
    x,
    y,
    z,
}

export enum RusLetters {
    а,
    б,
    в,
    г,
    д,
    е,
    ж,
    з,
    и,
    й,
    к,
    л,
    м,
    н,
    о,
    п,
    р,
    с,
    т,
    у,
    ф,
    х,
    ц,
    ч,
    ш,
    щ,
    ъ,
    ы,
    ь,
    э,
    ю,
    я,
}
