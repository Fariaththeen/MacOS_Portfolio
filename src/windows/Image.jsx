import { useState, useEffect } from "react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components";
import useWindowStore from "#store/window.js";
import { ChevronLeft } from "lucide-react";

const ImageWindowContent = () => {
    const { windows, closeWindow } = useWindowStore();
    const data = windows.imgfile?.data;
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

    const { name, imageUrl } = data;

    const handleGoBack = (e) => {
        e.stopPropagation();
        e.preventDefault();
        closeWindow("imgfile");
    };

    if (isMobile) {
        return (
            <div className="flex flex-col h-full bg-[#1c1c1e] text-white font-roboto p-6 pt-14 select-none">
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

                {/* Image Content Centered */}
                <div className="flex-1 flex justify-center items-center overflow-auto pb-10">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={name}
                            className="max-w-full max-h-[75vh] object-contain rounded pointer-events-none"
                            draggable="false"
                            onDragStart={(e) => e.preventDefault()}
                        />
                    ) : null}
                </div>
            </div>
        );
    }

    return (
        <>
            <div id="window-header">
                <WindowControls target="imgfile" />
                <h2>{name}</h2>
            </div>

            <div className="p-5 bg-white select-none">
                {imageUrl ? (
                    <div className="w-full">
                        <img
                            src={imageUrl}
                            alt={name}
                            className="w-full h-auto max-h-[70vh] object-contain rounded pointer-events-none select-none"
                            draggable="false"
                            onDragStart={(e) => e.preventDefault()}
                        />
                    </div>
                ) : null}
            </div>
        </>
    );
};

const ImageWindow = WindowWrapper(ImageWindowContent, "imgfile");

export default ImageWindow;