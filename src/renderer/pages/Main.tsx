import CheckBox from "../components/CheckBox";
import CameraWithButtons from "../components/CameraWithButtons";

export const Main = () => {
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
            <div className="hidden md:flex flex-col gap-y-3 overflow-y-auto max-h-full overflow-x-hidden">
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
