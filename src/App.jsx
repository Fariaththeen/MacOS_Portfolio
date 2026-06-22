import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import {Draggable} from "gsap/Draggable";

import {Dock, Home, Navbar, Welcome, BootScreen, MobileStatusBar} from '#components';
import {Resume, Safari, Terminal, Finder, Text, Image, Contact, Photos} from '#windows';

gsap.registerPlugin(Draggable);


const App = () => {
    const [isBooted, setIsBooted] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const contentRef = useRef(null);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        if (isBooted && contentRef.current) {
            gsap.fromTo(contentRef.current, 
                { opacity: 0 }, 
                { opacity: 1, duration: 1.2, ease: "power2.out" }
            );
        }
    }, [isBooted]);

    return (
        <main className="relative w-screen h-screen overflow-hidden">
            {!isBooted && <BootScreen onBootComplete={() => setIsBooted(true)} />}
            
            {isBooted && (
                <div ref={contentRef} className="w-full h-full">
                    {isMobile ? <MobileStatusBar /> : <Navbar />}
                    <Welcome />
                    <Dock />

                    <Terminal />
                    <Safari />
                    <Resume />
                    <Finder />
                    <Text />
                    <Image />
                    <Contact />
                    <Photos />
                    <Home />
                </div>
            )}
        </main>
    );
};
export default App;
