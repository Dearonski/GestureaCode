import useCamera from "../hooks/useCamera";
import useUserMedia from "../hooks/useUserMedia";
import { useEffect, useRef } from "react";

let lastVideoTime = -1;

const Camera = () => {
    const mediaStream = useUserMedia();
    const videoRef = useRef<HTMLVideoElement>();
    const videoCanvasRef = useRef<HTMLCanvasElement>(null);
    const { setIsLoading } = useCamera();
    // const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    const videoCanvasCtx = useRef<CanvasRenderingContext2D>(null);

    useEffect(() => {
        setIsLoading(true);
    }, []);

    useEffect(() => {
        if (videoCanvasRef.current) {
            videoCanvasCtx.current = videoCanvasRef.current.getContext("2d");
        }
    }, [videoRef.current]);

    useEffect(() => {
        if (mediaStream && videoRef.current) {
            videoRef.current.srcObject = mediaStream;
        }
    }, [mediaStream]);

    const drawCanvas = async () => {
        if (
            videoRef.current &&
            lastVideoTime !== videoRef.current.currentTime
        ) {
            lastVideoTime = videoRef.current.currentTime;
            videoCanvasCtx.current.drawImage(videoRef.current, 0, 0);
        }
        requestAnimationFrame(drawCanvas);
    };

    const handleCanPlay = () => {
        videoRef.current.play();
        videoCanvasRef.current.width = videoRef.current.videoWidth;
        videoCanvasRef.current.height = videoRef.current.videoHeight;
        drawCanvas();
        setIsLoading(false);
    };

    return (
        <div className="relative size-full flex items-center justify-center">
            <video
                ref={videoRef}
                autoPlay
                playsInline
                onCanPlay={handleCanPlay}
                muted
                className="size-full rotate-y-180 absolute z-10 object-fill blur-[256px]"
            />
            <canvas
                ref={videoCanvasRef}
                className="pointer-events-none h-full max-w-full w-auto object-contain absolute z-20 rotate-y-180"
            />
            {/* <canvas
                ref={drawingCanvasRef}
                className="pointer-events-none h-full max-w-full w-auto object-contain absolute z-20"
            /> */}
        </div>
    );
};

export default Camera;
