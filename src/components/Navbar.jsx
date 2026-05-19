import { useState, useEffect } from "react";
import dayjs from "dayjs";
import { Maximize, Minimize } from "lucide-react";
import {navIcons, navLinks} from "#constants";
import useWindowStore from "#store/window.js";

const Navbar = () => {
    const { openWindow } = useWindowStore();
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((e) => {
                console.error(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    };

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    return (
        <nav>
            <div>
                <img src="/images/logo.svg" alt="logo"/>
                <p className="font-bold">Farid's Portfolio</p>

                <ul>
                    {navLinks.map(({id, name, type}) => (
                        <li key={id} onClick={() => openWindow(type)}>
                            <p>{name}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <ul>
                    <li onClick={toggleFullscreen} className="cursor-pointer icon-hover flex items-center justify-center p-1">
                        {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                    </li>
                    {navIcons.map(({id, img}) => (
                        <li key={id}>
                            <img src={img} className="icon-hover" alt={`icon-${id}`} />
                        </li>
                    ))}
                </ul>

                <time>{dayjs().format("ddd MMM D h:mm A")}</time>
            </div>
        </nav>
    )
};
export default Navbar;
