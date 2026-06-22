import { useState, useEffect } from "react";
import { locations } from "#constants";
import clsx from "clsx";
import {useGSAP} from "@gsap/react";
import {Draggable} from "gsap/Draggable";
import useWindowStore from "#store/window.js";
import useLocationStore from "#store/location.js";

const projects = locations.work?.children ?? [];

const Home = () => {
    const { setActiveLocation } = useLocationStore();
    const { openWindow } = useWindowStore();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleOpenProjectFinder = (project) => {
        setActiveLocation(project);
        openWindow("finder")
    }

    useGSAP(() => {
        if (!isMobile) {
            Draggable.create('.folder');
        }
    }, [isMobile])

    if (isMobile) {
        return (
            <section id="home" className="absolute top-20 left-0 right-0 p-6 z-10 select-none">
                <div className="flex gap-6 justify-start items-end">
                    {/* Notes App Icon */}
                    <div 
                        className="flex flex-col items-center cursor-pointer w-[80px] active:scale-95 transition-transform"
                        onClick={() => openWindow("resume")}
                    >
                        <img src="/pages.png" alt="Notes" className="w-[80px] h-[80px] object-contain rounded-xl" />
                    </div>

                    {/* Terminal App Icon */}
                    <div 
                        className="flex flex-col items-center cursor-pointer w-[84px] active:scale-95 transition-transform"
                        onClick={() => openWindow("terminal")}
                    >
                        <img src="/images/terminal.png" alt="Terminal" className="w-[84px] h-[84px] object-contain rounded-xl" />
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="home">
            <ul>
                {projects.map((project) => (
                    <li
                        key={project.id}
                        className={clsx("group folder", project.windowPosition)}
                        onClick={() => handleOpenProjectFinder(project)}
                    >
                        <img src="/images/folder.png" alt={project.name} />
                        <p>{project.name}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default Home;