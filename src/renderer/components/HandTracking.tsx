import { useEffect, useRef, useState } from "react";
import { Button } from "./Button";
import { AnimatePresence, motion } from "framer-motion";
import { useHandLandMarker } from "../hooks/useHandLandMarker";
import { useRecognize } from "../hooks/useRecognize";
import { useExecuteGesture } from "../hooks/useExecuteGesture";
import { LandMarksMethods } from "../utils/Gestures";
import { SelectCam } from "./SelectCam";
import { Card } from "./Card";
import useUserMedia from "../hooks/useUserMedia";

const CAPTURE_OPTIONS: MediaStreamConstraints = {
    audio: false,
    video: {
        width: 1280,
        height: 720,
        frameRate: 60,
    },
};

export const Camera = () => {
    // const [webcamRunning, setWebcamRunning] = useState<boolean>(false);
    const mediaStream = useUserMedia(CAPTURE_OPTIONS);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    // const { enableCam, predictWebcam, results, drawingCanvasCtx } =
    //     useHandLandMarker(
    //         webcamRunning,
    //         setWebcamRunning,
    //         videoRef,
    //         videoCanvasRef,
    //         drawingCanvasRef
    //     );
    // const { executeGesture } = useExecuteGesture();
    // const { recognizeGesture, recognizedGesture } = useRecognize();
    // const landMarks = useRef<LandMarksMethods>(null);

    // useEffect(() => {
    //     if (results) {
    //         landMarks.current = new LandMarksMethods(
    //             results,
    //             videoRef.current.videoWidth,
    //             videoRef.current.videoHeight
    //         );
    //         recognizeGesture(landMarks.current);
    //     }
    //     console.log(recognizedGesture);
    // }, [results]);

    // useEffect(() => {
    //     if (results && results.landmarks[0]) {
    //         executeGesture(
    //             recognizedGesture,
    //             landMarks.current,
    //             drawingCanvasCtx.current
    //         );
    //     }
    // });

    return (
        <Card className="flex flex-col gap-y-3 size-full">
            <div className="relative flex justify-center size-full rounded-xl overflow-hidden">
                <AnimatePresence>
                    {true && (
                        <motion.div
                            className="absolute size-full z-20"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.7 }}
                        >
                            <motion.div
                                className="bg-gradient-to-tr from-fuchsia-600 via-sky-600 to-red-600 bg-[length:500%_500%] size-full"
                                animate={{
                                    backgroundPositionX: ["0%", "100%", "0%"],
                                    backgroundPositionY: ["50%", "50%", "50%"],
                                }}
                                transition={{
                                    duration: 20,
                                    ease: "easeInOut",
                                    repeat: Infinity,
                                }}
                            ></motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/* <video
                    autoPlay
                    ref={videoRef}
                    onLoadedData={predictWebcam}
                    className="size-full object-fill blur-[256px] rotate-y-180 absolute"
                />
                <canvas
                    ref={videoCanvasRef}
                    className="pointer-events-none h-full max-w-full w-auto object-contain absolute z-10"
                />
                <canvas
                    ref={drawingCanvasRef}
                    className="pointer-events-none h-full max-w-full w-auto object-contain absolute z-20"
                /> */}
            </div>
            {/* <div className="flex gap-x-3">
                <Button
                    onClick={enableCam}
                    className="grid sm:grid-cols-[auto_40px_170px_auto] items-center gap-x-4 flex-grow"
                >
                    <motion.div
                        animate={
                            webcamRunning
                                ? { rotate: -90, scale: 3.5 }
                                : { rotate: -120, scale: 3.5 }
                        }
                        transition={{ duration: 0.7 }}
                        className={`w-9 h-9 rounded-full col-start-2`}
                    >
                        <div
                            className={`h-9 w-9 bg-white absolute transition-[clip-path] duration-700 ${
                                webcamRunning ? "pause_1" : "play_1"
                            }`}
                        ></div>
                        <div
                            className={`h-9 w-9 bg-white absolute transition-[clip-path] duration-700 ${
                                webcamRunning ? "pause_2" : "play_2"
                            }`}
                        ></div>
                    </motion.div>
                    <span className="text-left hidden sm:block font-medium text-lg">
                        {webcamRunning
                            ? t("Turn off camera")
                            : t("Turn on camera")}
                    </span>
                </Button>
                <SelectCam className="h-full flex-shrink-0" />
            </div> */}
        </Card>
    );
};
