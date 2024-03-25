import { useEffect, useState } from "react";
import { VideoCameraIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import useVideoInput from "../hooks/useVideoInput";
import Button from "./Button";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import useCamera from "../hooks/useCamera";
import { useTranslation } from "react-i18next";

const SelectCam = () => {
    const [videoInputs, setVideoInputs] = useState<MediaDeviceInfo[]>();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { setIsLoading, isActive } = useCamera();
    const { videoInput, setVideoInput } = useVideoInput();
    const { t } = useTranslation();

    const handleClick = () => {
        setIsOpen(!isOpen);
    };

    const chooseVideoInput = (videoInput: MediaDeviceInfo) => {
        setVideoInput(videoInput);
        setIsOpen(false);
        if (isActive) {
            setIsLoading(true);
        }
    };

    const initVideoInputs = async () => {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            const videoDevices = devices.filter(
                (device) => device.kind === "videoinput"
            );
            setVideoInput(videoDevices[0]);
            setVideoInputs(videoDevices);
        });
    };

    useEffect(() => {
        initVideoInputs();
    }, [setVideoInputs]);

    return (
        <div className="flex-shrink-0 h-full relative">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="absolute bottom-[calc(100%+12px)] z-[100] w-full text-white bg-indigo-600 font-medium overflow-hidden rounded-xl"
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex flex-col gap-y-3 overflow-hidden w-full p-3 items-center">
                            {videoInputs.filter(
                                (item) => item.deviceId !== videoInput.deviceId
                            ).length
                                ? videoInputs
                                      .filter(
                                          (item) =>
                                              item.deviceId !==
                                              videoInput.deviceId
                                      )
                                      .map((item) => (
                                          <button
                                              className="text-center"
                                              key={item.deviceId}
                                              onClick={() =>
                                                  chooseVideoInput(item)
                                              }
                                          >
                                              {item.label.split("(", 1)}
                                          </button>
                                      ))
                                : t("No available video devices")}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Button
                className="flex items-center size-full justify-center gap-x-3 px-3"
                onClick={handleClick}
            >
                <VideoCameraIcon className="text-white size-8" />
                <p className="font-medium">
                    {videoInput ? videoInput.label.split("(", 1) : "Бебра"}
                </p>
                <ChevronDownIcon
                    className={twMerge(
                        `text-white size-8 transition-all duration-300`,
                        isOpen && "rotate-180"
                    )}
                />
            </Button>
        </div>
    );
};

export default SelectCam;
