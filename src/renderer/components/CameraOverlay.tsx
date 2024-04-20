import { AnimatePresence, motion } from "framer-motion";
import useCamera from "../hooks/useCamera";
import Camera from "./Camera";

const CameraOverlay = () => {
    const { isActive, isLoading } = useCamera();

    return (
        <div className="size-full rounded-xl overflow-hidden flex items-center relative">
            <AnimatePresence>
                {(!isActive || isLoading) && (
                    <motion.div
                        className="size-full absolute z-40"
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
            {isActive && <Camera />}
        </div>
    );
};

export default CameraOverlay;
