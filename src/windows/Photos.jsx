import { useState, useEffect } from "react";
import { Mail, Search, ChevronLeft } from "lucide-react";

import WindowWrapper from "#hoc/WindowWrapper";
import WindowControls from "#components/WindowControls";
import { gallery, photosLinks } from "#constants";
import useWindowStore from "#store/window";

const Photos = () => {
    const { openWindow, closeWindow } = useWindowStore();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleGoBack = (e) => {
        e.stopPropagation();
        e.preventDefault();
        closeWindow("photos");
    };

    if (isMobile) {
        return (
            <div className="flex flex-col h-full bg-[#1c1c1e] text-white font-roboto p-6 pt-14 overflow-y-auto select-none">
                {/* Header */}
                <div className="flex items-center justify-between py-4 border-b border-neutral-800/60 mb-6 shrink-0 relative z-50">
                    <button 
                        onClick={handleGoBack}
                        className="text-[#0a84ff] text-base font-normal flex items-center gap-1 active:opacity-75 bg-transparent border-none cursor-pointer z-50 relative pointer-events-auto"
                    >
                        <ChevronLeft size={20} className="text-[#0a84ff]" />
                        <span>Go Back</span>
                    </button>
                    <h2 className="text-white text-lg font-medium absolute left-1/2 -translate-x-1/2 pointer-events-none font-sans">All Photos</h2>
                    <div className="w-16"></div>
                </div>

                {/* Gallery Grid */}
                <div className="flex-1 pb-10">
                    <ul className="grid grid-cols-2 gap-4">
                        {gallery.map(({ id, img }) => (
                            <li
                                key={id}
                                className="cursor-pointer active:scale-[0.98] transition-transform overflow-hidden rounded-2xl shadow-md aspect-square"
                                onClick={() =>
                                    openWindow("imgfile", {
                                        id,
                                        name: "Preview",
                                        icon: "/images/image.png",
                                        kind: "file",
                                        fileType: "img",
                                        imageUrl: img,
                                    })
                                }
                            >
                                <img src={img} alt={`Gallery ${id}`} className="w-full h-full object-cover rounded-2xl" />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <>
            <div id="window-header">
                <WindowControls target="photos" />

                <div className="w-full flex justify-end items-center gap-3 text-gray-500">
                    <Mail className="icon" />
                    <Search className="icon" />
                </div>
            </div>

            <div className="flex w-full">
                <div className="sidebar">
                    <h2>Photos</h2>

                    <ul>
                        {photosLinks.map(({ id, icon, title }) => (
                            <li key={id}>
                                <img src={icon} alt={title} />
                                <p>{title}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="gallery">
                    <ul>
                        {gallery.map(({ id, img }) => (
                            <li
                                key={id}
                                onClick={() =>
                                    openWindow("imgfile", {
                                        id,
                                        name: "Gallery image",
                                        icon: "/images/image.png",
                                        kind: "file",
                                        fileType: "img",
                                        imageUrl: img,
                                    })
                                }
                            >
                                <img src={img} alt={`Gallery image ${id}`} />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

const PhotosWindow = WindowWrapper(Photos, "photos");

export default PhotosWindow;