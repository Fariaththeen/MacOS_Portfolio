import { useState, useEffect } from "react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components/index.js";
import { Download, ChevronLeft } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import useWindowStore from "#store/window.js";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const Resume = () => {
    const [isMobile, setIsMobile] = useState(false);
    const { closeWindow } = useWindowStore();

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
        closeWindow("resume");
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
                    <h2 className="text-white text-lg font-medium absolute left-1/2 -translate-x-1/2 pointer-events-none font-sans">Resume</h2>
                    <div className="w-16"></div>
                </div>

                {/* PDF Content */}
                <div className="flex-1 overflow-auto flex justify-center items-start pt-2">
                    <Document file="files/resume.pdf" >
                        <Page
                            pageNumber={1}
                            renderTextLayer
                            renderAnnotationLayer
                        />
                    </Document>
                </div>
            </div>
        );
    }

    return (
        <>
            <div id="window-header">
                <WindowControls target="resume" />
                <h2>Resume.pdf</h2>

                <a
                    href="files/resume.pdf"
                    download
                    className="cursor-pointer"
                    title="Download Resume"
                >
                    <Download className="icon" />
                </a>
            </div>

            <Document file="files/resume.pdf" >
                <Page
                    pageNumber={1}
                    renderTextLayer
                    renderAnnotationLayer
                />
            </Document>
        </>
    )
}

const ResumeWindow = WindowWrapper(Resume, "resume")

export default ResumeWindow
