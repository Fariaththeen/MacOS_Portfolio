import { useState, useEffect } from "react";
import dayjs from "dayjs";

const MobileStatusBar = () => {
    const [time, setTime] = useState(dayjs().format("h:mm A"));

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(dayjs().format("h:mm A"));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="w-full flex justify-between items-center px-6 py-2 select-none text-white text-sm font-semibold z-[9999] bg-transparent absolute top-0 left-0 right-0 gap-5 pointer-events-none">
            <time>{time}</time>
            <div className="bg-black flex-1 rounded-full px-2 py-5 max-w-[110px] mx-auto"></div>
            <ul className="flex items-center gap-2">
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wifi icon" aria-hidden="true">
                        <path d="M12 20h.01"></path>
                        <path d="M2 8.82a15 15 0 0 1 20 0"></path>
                        <path d="M5 12.859a10 10 0 0 1 14 0"></path>
                        <path d="M8.5 16.429a5 5 0 0 1 7 0"></path>
                    </svg>
                </li>
                <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-battery icon" aria-hidden="true">
                        <path d="M 22 14 L 22 10"></path>
                        <rect x="2" y="6" width="16" height="12" rx="2"></rect>
                    </svg>
                </li>
            </ul>
        </div>
    );
};

export default MobileStatusBar;
