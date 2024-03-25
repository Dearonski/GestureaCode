import { useTranslation } from "react-i18next";
import { DetailedHTMLProps, HTMLAttributes } from "react";
import useCheckboxState from "../hooks/useCheckboxState";

interface CheckBoxProps
    extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
    title: string;
    name: string;
}

const CheckBox: React.FC<CheckBoxProps> = ({
    className,
    title,
    name,
    ...props
}) => {
    const { t } = useTranslation();
    const { setGesturesState, gestureState } = useCheckboxState();

    const toggleChange = () => {
        setGesturesState(name);
    };

    return (
        <div
            className={`flex items-center gap-x-3 dark:bg-zinc-900 p-3 rounded-xl bg-neutral-300 border dark:border-zinc-800 border-neutral-400 ${className}`}
            {...props}
        >
            <h3 className="dark:text-white text-black font-medium w-full">
                {t(title)}
            </h3>
            <label className={`relative cursor-pointer`}>
                <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={gestureState[name]}
                    onChange={toggleChange}
                />
                <div className="w-[72px] h-10 bg-zinc-700 peer-checked:bg-indigo-600 rounded-full transition-colors peer after:content-[''] after:w-8 after:h-8 after:bg-white after:absolute after:rounded-full after after:top-1 after:left-1 peer-checked:after:translate-x-full after:transition-transform peer-focus-visible:outline-none peer-focus-visible:outline peer-focus-visible:outline-white peer-focus-visible:outline-offset-4"></div>
            </label>
        </div>
    );
};

export default CheckBox;
