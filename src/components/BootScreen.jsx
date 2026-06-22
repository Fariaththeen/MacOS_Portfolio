import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

const BootScreen = ({ onBootComplete }) => {
    const [showButton, setShowButton] = useState(true);

    const handleStart = () => {
        // Request fullscreen
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log("Fullscreen request failed", err);
            });
        } else if (document.documentElement.webkitRequestFullscreen) { /* Safari */
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) { /* IE11 */
            document.documentElement.msRequestFullscreen();
        }
        
        setShowButton(false);
    };

    useEffect(() => {
        if (!showButton) {
            // Boot animation sequence
            const tl = gsap.timeline({
                onComplete: () => {
                    onBootComplete();
                }
            });

            tl.to(".boot-logo", { 
                opacity: 1, 
                duration: 1.5,
                ease: "power2.inOut"
            })
            .to(".boot-progress-container", { 
                opacity: 1, 
                duration: 0.8 
            }, "-=0.5")
            .to(".boot-progress-bar", { 
                width: "100%", 
                duration: 2.5, 
                ease: "power1.inOut" 
            })
            .to(".boot-screen", { 
                opacity: 0, 
                duration: 1.2, 
                ease: "power2.inOut",
                delay: 0.5 
            });
        }
    }, [showButton, onBootComplete]);

    return (
        <div className="boot-screen fixed inset-0 bg-black z-[10000] flex flex-col items-center justify-center select-none overflow-hidden">
            {/* Apple Logo */}
            <div className="boot-logo opacity-0 mb-16">
                <img src="/images/logo.svg" className="w-24 invert" alt="Apple" />
            </div>

            {showButton ? (
                <div className="flex flex-col items-center">
                    <button 
                        onClick={handleStart}
                        className="group relative px-10 py-4 overflow-hidden rounded-2xl bg-white/5 text-white border border-white/10 backdrop-blur-2xl transition-all hover:bg-white/10 hover:border-white/30 active:scale-95 shadow-2xl"
                    >
                        <span className="relative z-10 font-georama text-lg tracking-wider font-light">Enter Portfolio</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </button>
                    <p className="mt-6 text-gray-500 font-roboto text-xs uppercase tracking-[0.2em] opacity-60">
                        Click to enable fullscreen experience
                    </p>
                </div>
            ) : (
                <div className="boot-progress-container opacity-0 w-72 h-[3px] bg-white/10 rounded-full overflow-hidden">
                    <div className="boot-progress-bar h-full w-0 bg-white shadow-[0_0_20px_rgba(255,255,255,0.8)]" />
                </div>
            )}
            
            {/* Ambient light effect */}
            <div className="absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-white/5 blur-[120px] rounded-full pointer-events-none" />
        </div>
    );
};

export default BootScreen;
