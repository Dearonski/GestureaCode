import { create } from "zustand";

interface TitleBarStore {
    opened: string;
    setOpened: (title: string) => void;
}

const useTitleBarStore = create<TitleBarStore>((set) => ({
    opened: "",
    setOpened: (title: string) => set({ opened: title }),
}));

export default useTitleBarStore;
