import { motion } from "framer-motion";
import useCamera from "../hooks/useCamera";
import Button from "./Button";
import CameraOverlay from "./CameraOverlay";
import { Card } from "./Card";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "react-i18next";
import SelectCam from "./SelectCam";

const CameraWithButtons = () => {
    const { isActive, setIsActive, isLoading } = useCamera();
    const { t } = useTranslation();

    return (
        <Card className="size-full flex flex-col items-center gap-y-3 p-0 md:p-3">
            <CameraOverlay />
            <div className="hidden md:flex gap-x-3 w-full ">
                <Button
                    className="text-lg font-medium w-full h-full"
                    disabled={isLoading}
                    onClick={() => {
                        setIsActive(!isActive);
                    }}
                >
                    <div className="flex items-center justify-center gap-x-5">
                        <motion.div
                            className="relative size-10"
                            animate={
                                isActive
                                    ? { rotate: -90, scale: 3.5 }
                                    : { rotate: -120, scale: 3.5 }
                            }
                            transition={{ duration: 0.7 }}
                        >
                            <div
                                className={twMerge(
                                    `size-full bg-white absolute transition-all duration-700`,
                                    isActive ? "play_1" : "pause_1"
                                )}
                            ></div>
                            <div
                                className={twMerge(
                                    `size-full bg-white absolute transition-all duration-700`,
                                    isActive ? "play_2" : "pause_2"
                                )}
                            ></div>
                        </motion.div>
                        <span className="w-fit hidden md:block">
                            {isActive
                                ? t("Turn off camera")
                                : t("Turn on camera")}
                        </span>
                    </div>
                </Button>
                <SelectCam className="hidden md:block" />
            </div>
        </Card>
    );
};

export default CameraWithButtons;
