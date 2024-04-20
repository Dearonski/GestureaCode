import { useEffect, useState } from "react";

const Header = () => {
    const [platform, setPlatform] = useState<NodeJS.Platform>();

    useEffect(() => {
        window.electronAPI.requests.requestPlatform();
    }, []);

    useEffect(() => {
        window.electronAPI.responses.responsePlatform(
            (platform: NodeJS.Platform) => {
                setPlatform(platform);
                console.log(platform);
            }
        );
    }, [window.electronAPI.responses.responsePlatform]);

    return (
        <header className="h-10">
            {platform == "win32" && <span className="text-white">Бебра</span>}
        </header>
    );
};

export default Header;
