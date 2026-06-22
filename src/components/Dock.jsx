import {useRef, useState, useEffect} from "react";
import {Tooltip} from "react-tooltip"
import gsap from "gsap";

import {dockApps} from "#constants";
import {useGSAP} from "@gsap/react";
import useWindowStore from "#store/window.js";

const Dock = () => {
    const { openWindow, closeWindow, windows } = useWindowStore();
    const dockRef = useRef(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useGSAP(() => {
        const dock = dockRef.current;
        if (!dock) return;

        // Skip hover scaling on mobile screens
        if (window.innerWidth < 768) return;

        const animateIcons = (mouseX) => {
            const {left} = dock.getBoundingClientRect();
            const icons = dock.querySelectorAll('.dock-icon');

            icons.forEach((icon) => {
                const {left: iconLeft, width} = icon.getBoundingClientRect();
                const center = iconLeft - left + width / 2;
                const distance = Math.abs(mouseX - center);
                const intensity = Math.exp(-(distance ** 2.5) / 20000);

                gsap.to(icon, {
                    scale: 1 + 0.25 * intensity,
                    y: -15 * intensity,
                    duration: 0.2,
                    ease: 'power1.Out',
                })
            })
        }

        const handleMouseMove = (e) => {
            const {left} = dock.getBoundingClientRect();

            animateIcons(e.clientX - left);
        }

        const resetIcons = () => {
            const icons = dock.querySelectorAll('.dock-icon');
            icons.forEach((icon) =>
                gsap.to(icon, {
                    scale: 1,
                    y: 0,
                    duration: 0.3,
                    ease: 'power1.Out'
                })
            );
        }

        dock.addEventListener('mousemove', handleMouseMove)
        dock.addEventListener('mouseleave', resetIcons)

        return () => {
            dock.removeEventListener('mousemove', handleMouseMove)
            dock.removeEventListener('mouseleave', resetIcons)
        }
    }, [])

    const toggleApp = (app, e) => {
        if (!app.canOpen) return;

        const targetIcon = e.currentTarget;
        if (targetIcon) {
            gsap.fromTo(targetIcon, 
                { y: 0 }, 
                { y: -15, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.out" }
            );
        }

        const window = windows[app.id];

        if (!window){
            console.error(`Window not found for app : ${app.id}`);
            return;
        }
        if (window.isOpen) {
            closeWindow(app.id);
        } else {
            openWindow(app.id);
        }

        console.log(windows);
    }

    const filteredApps = isMobile 
        ? dockApps.filter(app => app.id !== "terminal" && app.id !== "trash")
        : dockApps;

    return (
        <section id="dock">
            <div ref={dockRef} className="dock-container">
                {filteredApps.map(({id, name, icon, canOpen}) => (
                    <div key={id} className="relative flex justify-center">
                        <button
                            type="button"
                            className="dock-icon"
                            aria-label={name}
                            data-tooltip-id="dock-tooltip"
                            data-tooltip-content={name}
                            data-tooltip-delay-show={150}
                            disabled={!canOpen}
                            onClick={(e) => toggleApp({id, canOpen}, e)}
                        >
                            <img
                                src={`/images/${icon}`}
                                alt={name}
                                loading="lazy"
                                className={canOpen ? "" : "opacity-60"}
                            />
                        </button>
                    </div>
                ))}
                <Tooltip id="dock-tooltip" place="top" className="tooltip" />
            </div>
        </section>
    )
}

export default Dock;