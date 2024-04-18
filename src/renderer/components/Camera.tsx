import useCamera from "../hooks/useCamera";
import useUserMedia from "../hooks/useUserMedia";
import { useEffect, useRef } from "react";
import useDrawCanvas from "../hooks/useDrawCanvas";

const Camera = () => {
    const videoRef = useRef<HTMLVideoElement>();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    const { drawCanvas, initializeCanvas } = useDrawCanvas(
        videoRef.current,
        canvasRef.current,
        drawingCanvasRef.current
    );
    const { setIsLoading } = useCamera();
    const mediaStream = useUserMedia();

    useEffect(() => {
        setIsLoading(true);
    }, []);

    useEffect(() => {
        if (mediaStream && videoRef.current) {
            videoRef.current.srcObject = mediaStream;
        }
    }, [mediaStream]);

    const handleCanPlay = () => {
        videoRef.current.play();
        initializeCanvas();
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
                ref={canvasRef}
                className="pointer-events-none h-full max-w-full w-auto object-contain absolute z-20"
            />
            <canvas
                ref={drawingCanvasRef}
                className="pointer-events-none h-full max-w-full w-auto object-contain absolute z-20"
            />
        </div>
    );
};

export default Camera;
