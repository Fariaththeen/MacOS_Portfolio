import { useState, useEffect } from "react";
import {WindowControls} from "#components";
import {Search, ChevronLeft} from "lucide-react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import useLocationStore from "#store/location.js";
import {locations} from "#constants";
import clsx from "clsx";
import useWindowStore from "#store/window.js";

const Finder = () => {
    const {openWindow, closeWindow} = useWindowStore();
    const {activeLocation, setActiveLocation} = useLocationStore();
    const [isMobile, setIsMobile] = useState(false);
    const [currentFolder, setCurrentFolder] = useState(null); // null means root "Portfolio" view

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const openItem = (item) => {
        if (item.fileType === "pdf") return openWindow("resume");
        if (item.kind === "folder") {
            if (isMobile) {
                setCurrentFolder(item);
            } else {
                setActiveLocation(item);
            }
            return;
        }
        if (["fig", "url"].includes(item.fileType) && item.href)
            return window.open(item.href, "_blank");

        openWindow(`${item.fileType}${item.kind}`, item)
    };

    const handleGoBack = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (currentFolder === null) {
            closeWindow("finder");
        } else {
            // If we are inside a subfolder, go up to its parent or root
            // For simplicity, since the structure is 2 levels, we can check if currentFolder has a parent type or go to root
            if (["work", "about", "resume", "trash"].includes(currentFolder.type)) {
                setCurrentFolder(null);
            } else {
                // If we are inside a project folder (like PCB-Defect...), go back to Work folder
                setCurrentFolder(locations.work);
            }
        }
    };

    if (isMobile) {
        const favorites = Object.values(locations);
        const folderTitle = currentFolder ? currentFolder.name : "Portfolio";
        const displayItems = currentFolder ? currentFolder.children : favorites;

        return (
            <div className="flex flex-col h-full bg-[#1c1c1e] text-white font-roboto p-6 pt-14 overflow-y-auto select-none">
                {/* Header */}
                <div className="flex items-center justify-between py-4 border-b border-neutral-800/60 mb-4 shrink-0 relative z-50">
                    <button 
                        onClick={handleGoBack}
                        className="text-[#0a84ff] text-base font-normal flex items-center gap-1 active:opacity-75 bg-transparent border-none cursor-pointer z-50 relative pointer-events-auto"
                    >
                        <ChevronLeft size={20} className="text-[#0a84ff]" />
                        <span>Go Back</span>
                    </button>
                    
                    {currentFolder ? (
                        <h2 className="text-white text-lg font-medium font-sans truncate max-w-[220px] text-right z-50">{folderTitle}</h2>
                    ) : (
                        <h2 className="text-white text-lg font-medium absolute left-1/2 -translate-x-1/2 pointer-events-none font-sans truncate max-w-[150px]">{folderTitle}</h2>
                    )}
                    
                    {!currentFolder && <div className="w-16"></div>}
                </div>

                {/* Folder Path Breadcrumb Bar */}
                {currentFolder && (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 py-1.5 px-2 bg-neutral-900/40 rounded-md mb-6 shrink-0 font-sans">
                        <span className="text-[#0a84ff] cursor-pointer hover:underline" onClick={() => setCurrentFolder(null)}>Portfolio</span>
                        <span className="text-neutral-600 font-bold">&gt;</span>
                        {locations.work.children.some(child => child.id === currentFolder.id) ? (
                            <>
                                <span className="text-[#0a84ff] cursor-pointer hover:underline" onClick={() => setCurrentFolder(locations.work)}>Work</span>
                                <span className="text-neutral-600 font-bold">&gt;</span>
                                <span className="text-neutral-300 truncate max-w-[150px]">{currentFolder.name}</span>
                            </>
                        ) : (
                            <span className="text-neutral-300 truncate max-w-[150px]">{currentFolder.name}</span>
                        )}
                    </div>
                )}

                {/* Grid of Folders / Files */}
                <div className="flex-1">
                    <ul className="grid grid-cols-3 gap-y-8 gap-x-4 justify-items-center align-content-start pb-10">
                        {displayItems.map((item) => (
                            <li 
                                key={item.id} 
                                className="flex flex-col items-center gap-2 cursor-pointer w-20 text-center active:scale-95 transition-transform"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={() => openItem(item)}
                            >
                                <img 
                                    src={item.kind === "folder" || !item.icon ? "/images/folder.png" : item.icon} 
                                    alt={item.name} 
                                    className="w-16 h-16 object-contain"
                                />
                                <p className="text-xs text-neutral-200 font-sans leading-tight break-words w-full px-1">{item.name}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }

    const renderList = (name, items) => (
        <div>
            <h3>{name}</h3>
            <ul>
                {items.map((item) => (
            <li
                key={item.id}
                onClick={() => setActiveLocation(item)}
                className={clsx(
                    item.id === activeLocation?.id ? "active" : "not-active"
                )}
            >
                <img src={item.icon} className="w-4" alt={item.name}/>
                <p className="text-sm font-medium truncate">{item.name}</p>
            </li>
                ))}
            </ul>
        </div>
    );

    return <>
        <div id="window-header">
            <WindowControls target="finder" />
            <Search className="icon" />
        </div>

        <div className="bg-white flex h-full">
            <div className="sidebar">
                {renderList('Favorites', Object.values(locations))}
                {renderList('My Projects', locations.work.children)}
            </div>


            <ul className="content">
                {activeLocation ?.children.map((item) => (
                    <li key={item.id} className={item.position} onPointerDown={(e) => e.stopPropagation()} onClick={() => openItem(item)}>
                        <img src={item.icon} alt={item.name}/>
                        <p>{item.name}</p>
                    </li>
                ))}
            </ul>
        </div>

    </>
}

const FinderWindow = WindowWrapper(Finder, "finder");

export default FinderWindow
