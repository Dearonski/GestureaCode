import { InferenceSession, env } from "onnxruntime-web";
import { loadHands } from "../utils/canvasUtils";
import useModelsStore from "./useModels";

const useInitializeModels = () => {
    const {
        setHandLandmarker,
        setLetterClassificationModelEn,
        setLetterClassificationModelRu,
    } = useModelsStore();

    const initializeModels = async () => {
        env.wasm.wasmPaths = "static://dist/";

        setHandLandmarker(await loadHands());
        setLetterClassificationModelEn(
            await InferenceSession.create("static://eng.onnx")
        );
        setLetterClassificationModelRu(
            await InferenceSession.create("static://rus.onnx")
        );
        console.log("Loaded models!");
    };

    return initializeModels;
};

export default useInitializeModels;
