import { useState, useEffect } from "react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components";
import useWindowStore from "#store/window.js";
import { ChevronLeft } from "lucide-react";

const Text = () => {
    const { windows, closeWindow } = useWindowStore();
    const data = windows.txtfile?.data;
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (!data) return null;

    const { name, image, subtitle, description } = data;

    const handleGoBack = (e) => {
        e.stopPropagation();
        e.preventDefault();
        closeWindow("txtfile");
    };

    if (isMobile) {
        return (
            <div className="flex flex-col h-full bg-[#1c1c1e] text-white font-roboto p-6 pt-14 overflow-y-auto select-none">
                {/* Header */}
                <div className="flex items-center justify-between py-4 border-b border-neutral-800/60 mb-8 shrink-0 relative z-50">
                    <button 
                        onClick={handleGoBack}
                        className="text-[#0a84ff] text-base font-normal flex items-center gap-1 active:opacity-75 bg-transparent border-none cursor-pointer z-50 relative pointer-events-auto"
                    >
                        <ChevronLeft size={20} className="text-[#0a84ff]" />
                        <span>Go Back</span>
                    </button>
                    <h2 className="text-white text-lg font-medium absolute left-1/2 -translate-x-1/2 pointer-events-none font-sans">Preview</h2>
                    <div className="w-16"></div>
                </div>

                {/* Text Content */}
                <div className="flex-1 space-y-6 text-neutral-300 text-[15px] leading-relaxed font-sans pb-10">
                    {Array.isArray(description) && description.length > 0 ? (
                        description.map((para, idx) => (
                            <p key={idx}>{para}</p>
                        ))
                    ) : null}
                </div>
            </div>
        );
    }

    return (
        <>
            <div id="window-header">
                <WindowControls target="txtfile" />
                <h2>{name}</h2>
            </div>

            <div className="p-5 space-y-6 bg-white">
                {image ? (
                    <div className="w-full select-none">
                        <img
                            src={image}
                            alt={name}
                            className="w-full h-auto rounded pointer-events-none select-none"
                            draggable="false"
                            onDragStart={(e) => e.preventDefault()}
                        />
                    </div>
                ) : null}

                {subtitle ? (
                    <h3 className="text-lg font-semibold">{subtitle}</h3>
                ) : null}

                {Array.isArray(description) && description.length > 0 ? (
                    <div className="space-y-3 leading-relaxed text-base text-gray-800">
                        {description.map((para, idx) => (
                            <p key={idx}>{para}</p>
                        ))}
                    </div>
                ) : null}
            </div>
        </>
    );
};

const TextWindow = WindowWrapper(Text, "txtfile");

export default TextWindow;