import { useState, useEffect } from "react";
import windowWrapper from "#hoc/WindowWrapper.jsx";
import { socials } from "#constants";
import { WindowControls } from "#components";
import { ChevronLeft } from "lucide-react";
import useWindowStore from "#store/window.js";

const Contact = () => {
    const { closeWindow } = useWindowStore();
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
        closeWindow("contact");
    };

    if (isMobile) {
        return (
            <div className="flex flex-col h-full bg-[#1c1c1e] text-white font-roboto p-6 pt-14 overflow-y-auto select-none">
                {/* Header */}
                <div className="flex items-center justify-between py-4 mb-2 shrink-0 relative z-50">
                    <button 
                        onClick={handleGoBack}
                        className="text-[#0a84ff] text-[17px] font-normal flex items-center gap-1 active:opacity-75 bg-transparent border-none cursor-pointer z-50 relative pointer-events-auto"
                    >
                        <ChevronLeft size={22} className="text-[#0a84ff] -ml-2" />
                        <span>Go Back</span>
                    </button>
                    <h2 className="text-white text-lg font-semibold absolute left-1/2 -translate-x-1/2 pointer-events-none font-sans">Contact</h2>
                    <div className="w-16"></div>
                </div>

                {/* Profile Pic & Intro */}
                <div className="flex flex-col items-center text-center mt-4 mb-8 shrink-0">
                    <img
                        src="/images/farid.jpeg"
                        alt="Farid"
                        className="w-24 h-24 rounded-full object-cover mb-4 border border-white/5 pointer-events-none"
                    />
                    <h3 className="text-[26px] font-bold text-white mb-2 tracking-tight">Let's Connect</h3>
                    <p className="text-[15px] text-neutral-300 max-w-xs leading-relaxed px-4">
                        Got an idea? A bug to squash? Or just wanna talk tech? I'm in.
                    </p>
                </div>

                {/* Social Cards Stack */}
                <div className="flex-1 pb-10">
                    <ul className="flex flex-col gap-4">
                        {socials.map((social) => {
                            let iconSvg = null;
                            const textLower = social.text.toLowerCase();

                            if (textLower === "github") {
                                iconSvg = (
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-white stroke-[1.75]" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
                                    </svg>
                                );
                            } else if (textLower === "platform") {
                                iconSvg = (
                                    <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-6 h-6 stroke-white fill-none" strokeWidth="1.5">
                                        <circle cx="0" cy="0" r="1.5" fill="white"/>
                                        <ellipse rx="11" ry="4.2" />
                                        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
                                        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
                                    </svg>
                                );
                            } else if (textLower === "instagram") {
                                iconSvg = (
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-white stroke-[1.75]" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                                    </svg>
                                );
                            } else if (textLower === "linkedin") {
                                iconSvg = (
                                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-white stroke-[1.75]" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                                        <rect x="2" y="9" width="4" height="12"/>
                                        <circle cx="4" cy="4" r="2"/>
                                    </svg>
                                );
                            } else {
                                iconSvg = <img src={social.icon} alt={social.text} className="w-6 h-6 object-contain filter invert" />;
                            }

                            return (
                                <li key={social.id} style={{ backgroundColor: social.bg }} className="rounded-[20px] active:scale-[0.98] transition-transform duration-200">
                                    <a href={social.link || "#"} target="_blank" rel="noreferrer noopener" className="flex flex-col justify-between h-[105px] p-5 text-white decoration-none">
                                        {iconSvg}
                                        <p className="font-bold text-[19px] text-left leading-none m-0">{social.text}</p>
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        );
    }

    return (
        <>
            <div id="window-header">
                <WindowControls target="contact" />
                <h2>Contact Me</h2>
            </div>

            <div className="p-5 space-y-5">
                <img
                    src="/images/farid.jpeg"
                    alt="Farid"
                    className="w-20 rounded-full"
                />

                <h3>Let's Connect</h3>
                <p>Got an idea? A bug to squash? or just wanna talk tech? I'm in.</p>
                <p>fariaththeen@gmail.com</p>

                <ul>
                    {socials.map(({ id, bg, link, icon, text }) => (
                        <li key={id} style={{ backgroundColor: bg }}>
                            <a href={link} target="_blank" rel="noreferrer noopener" title={text}>
                                <img src={icon} alt={text} className="size-5" />
                                <p>{text}</p>
                            </a>
                        </li>
                    ))}
                </ul>

            </div>
        </>
    )
}

const ContactWindow = windowWrapper(Contact, "contact");

export default ContactWindow
