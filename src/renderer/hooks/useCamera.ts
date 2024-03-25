import { create } from "zustand";

interface CameraStore {
    isActive: boolean;
    setIsActive: (active: boolean) => void;
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

const useCamera = create<CameraStore>((set) => ({
    isActive: false,
    setIsActive: (active: boolean) => set({ isActive: active }),
    isLoading: false,
    setIsLoading: (isLoading: boolean) => set({ isLoading: isLoading }),
}));

export default useCamera;
