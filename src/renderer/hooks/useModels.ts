import { HandLandmarker } from "@mediapipe/tasks-vision";
import { InferenceSession } from "onnxruntime-web";
import { create } from "zustand";

interface ModelsStore {
    handLandmarker: HandLandmarker;
    letterClassificationModelRu: InferenceSession;
    letterClassificationModelEn: InferenceSession;
    setHandLandmarker: (model: HandLandmarker) => void;
    setLetterClassificationModelEn: (model: InferenceSession) => void;
    setLetterClassificationModelRu: (model: InferenceSession) => void;
}

const useModels = create<ModelsStore>((set) => ({
    handLandmarker: null,
    letterClassificationModelEn: null,
    letterClassificationModelRu: null,
    setHandLandmarker: (model: HandLandmarker) =>
        set({ handLandmarker: model }),
    setLetterClassificationModelEn: (model: InferenceSession) =>
        set({ letterClassificationModelEn: model }),
    setLetterClassificationModelRu: (model: InferenceSession) =>
        set({ letterClassificationModelRu: model }),
}));

export default useModels;
