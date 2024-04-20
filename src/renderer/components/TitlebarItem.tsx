import { twMerge } from "tailwind-merge";
import useTitleBarStore from "../hooks/useTitleBarStore";

interface TitleBarItemProps {
    children: React.ReactNode;
    title: string;
}

const TitleBarItem: React.FC<TitleBarItemProps> = ({ title, children }) => {
    const { opened, setOpened } = useTitleBarStore();

    const handleClick = () => {
        if (opened == title) {
            setOpened("");
        } else {
            setOpened(title);
        }
    };

    const handleHover = () => {
        if (opened != "") {
            setOpened(title);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleClick}
                onMouseOver={handleHover}
                className={twMerge(
                    `dark:text-white text-black py-1 px-2 hover:bg-neutral-800 no-drag text-sm rounded-md`,
                    opened == title && "bg-neutral-800"
                )}
            >
                {title}
            </button>
            {opened == title && (
                <div className="absolute bg-neutral-800  rounded-lg dark:text-white text-black z-50 top-8 border border-neutral-700 text-sm">
                    {children}
                </div>
            )}
        </div>
    );
};

export default TitleBarItem;
