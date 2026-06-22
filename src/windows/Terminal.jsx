import { useState, useEffect } from "react";
import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { techStack } from "#constants";
import { Check, Flag, ChevronLeft, ChevronRight } from "lucide-react";
import WindowControls from "#components/WindowControls.jsx";
import useWindowStore from "#store/window.js";

const Terminal = () => {
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
        console.log("Terminal Go Back clicked!");
        e.stopPropagation();
        e.preventDefault();
        closeWindow("terminal");
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
                    <h2 className="text-white text-lg font-medium absolute left-1/2 -translate-x-1/2 pointer-events-none font-sans">Terminal</h2>
                    <div className="w-16"></div>
                </div>

                {/* Prompt */}
                <div className="text-base font-mono mb-8 mt-2">
                    <span className="font-bold text-white">@farid % </span>
                    <span className="text-neutral-300">show tech stack</span>
                </div>

                {/* Categories */}
                <div className="flex-1 space-y-8 pb-10">
                    {techStack.map(({ category, items }) => (
                        <div key={category} className="space-y-3">
                            <div className="flex items-center gap-2 text-[#00A154] font-semibold text-lg font-sans">
                                <ChevronRight size={18} className="text-[#00A154]" />
                                <h3>{category}</h3>
                            </div>
                            <ul className="pl-8 space-y-2 text-[15px] text-neutral-300 font-mono">
                                {items.map((item, i) => (
                                    <li key={i}>
                                        - {item}{i < items.length - 1 ? "," : ""}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Footnote / Footer */}
                    <div className="mt-12 pt-6 border-t border-dashed border-neutral-800 text-[14px] text-[#00A154] space-y-2.5 font-mono">
                        <p className="flex items-center gap-2">
                            <Check size={18} /> 5 of 5 stacks loaded successfully (100%)
                        </p>
                        <p className="flex items-center gap-2 text-neutral-400">
                            <Flag size={15} fill="gray" className="text-neutral-400 border-none" />
                            Render time: 6ms
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return <>
        <div id="window-header">
            <WindowControls target="terminal" />
            <h2>Tech Stack</h2>
        </div>

        <div className="techstack">
            <p>
                <span className="font-bold">@farid % </span>
                show tech stack
            </p>

            <div className="label">
                <p className="w-32">Category</p>
                <p>Technologies</p>
            </div>

            <ul className="content">
                {techStack.map(({ category, items }) => (
                    <li key={category} className="flex items-center">
                        <Check className="check" size={20} />
                        <h3>{category}</h3>
                        <ul>
                            {items.map((item, i) => (
                                <li key={i}>
                                    {item}
                                    {i < items.length - 1 ? "," : ""}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>

            <div className="footnote">
                <p>
                    <Check size={20} /> 5 of 5 stacks loaded successfully (100%)
                </p>

                <p className="text-black">
                    <Flag size={15} fill="black" />
                    Render time: 6ms
                </p>
            </div>
        </div>
    </>
}

const TerminalWindow = WindowWrapper(Terminal, "terminal")

export default TerminalWindow;
