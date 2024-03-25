import CheckBox from "../components/CheckBox";
import CameraWithButtons from "../components/CameraWithButtons";
import useCheckboxState from "../hooks/useCheckboxState";
import { useEffect } from "react";

export const Main = () => {
    const { gestureState } = useCheckboxState();

    useEffect(() => {
        console.log(gestureState);
    });

    const gesturesWithActions = [
        {
            gesture: "Moving the cursor",
            name: "movingCursor",
        },
        {
            gesture: "Left mouse click",
            name: "leftClick",
        },
        {
            gesture: "Right mouse click",
            name: "rightClick",
        },
        {
            gesture: "Volume change",
            name: "volumeChange",
        },
        {
            gesture: "Switching tracks",
            name: "switchingTracks",
        },
        {
            gesture: "Play/Pause track",
            name: "playPause",
        },
        {
            gesture: "Keyboard mode",
            name: "keyboardMode",
        },
    ];

    return (
        <div className="flex items-center gap-x-3 px-3 pb-3 size-full">
            <CameraWithButtons />
            <div className="flex flex-col gap-y-3 overflow-y-auto max-h-full">
                {gesturesWithActions.map((gesture) => (
                    <CheckBox
                        key={gesture.gesture}
                        className="w-full"
                        title={gesture.gesture}
                        name={gesture.name}
                    />
                ))}
            </div>
        </div>
    );
};
