import { create } from "zustand";

interface VideoInputStore {
    videoInput: MediaDeviceInfo;
    setVideoInput: (videoInput: MediaDeviceInfo) => void;
}

const useVideoInput = create<VideoInputStore>((set) => ({
    videoInput: null,
    setVideoInput: (videoInput: MediaDeviceInfo) =>
        set({ videoInput: videoInput }),
}));

export default useVideoInput;
