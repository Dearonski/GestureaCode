import { create } from "zustand";

type StateGestures = {
    [key: string]: boolean;
};

interface GestureStateStore {
    gestureState: StateGestures;
    setGesturesState: (name: string) => void;
}

const useCheckboxStore = create<GestureStateStore>((set) => ({
    gestureState: {
        movingCursor: true,
        leftClick: true,
        rightClick: true,
        volumeChange: true,
        switchingTracks: true,
        playPause: true,
        keyboardMode: true,
    },
    setGesturesState: (name: string) =>
        set((state) => ({
            gestureState: {
                ...state.gestureState,
                [name]: !state.gestureState[name],
            },
        })),
}));

export default useCheckboxStore;
