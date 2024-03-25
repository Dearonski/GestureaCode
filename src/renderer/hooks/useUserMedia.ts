import { useState, useEffect } from "react";
import useVideoInput from "./useVideoInput";

function useUserMedia() {
    const [mediaStream, setMediaStream] = useState<MediaStream>(null);
    const { videoInput } = useVideoInput();

    const cleanUp = () => {
        mediaStream.getTracks().forEach((track) => {
            track.stop();
        });
    };

    useEffect(() => {
        setMediaStream(null);
    }, [videoInput]);

    useEffect(() => {
        const enableVideoStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: {
                        width: 1280,
                        height: 720,
                        frameRate: 60,
                        deviceId: videoInput.deviceId,
                    },
                });
                setMediaStream(stream);
            } catch (err) {
                console.log(err);
            }
        };

        if (!mediaStream) {
            enableVideoStream();
        } else {
            return cleanUp;
        }
    }, [mediaStream, videoInput]);

    return mediaStream;
}

export default useUserMedia;
