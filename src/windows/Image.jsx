import WindowWrapper from "#hoc/WindowWrapper.jsx";
import { WindowControls } from "#components";
import useWindowStore from "#store/window.js";

const ImageWindowContent = () => {
    const { windows } = useWindowStore();
    const data = windows.imgfile?.data;

    if (!data) return null;

    const { name, imageUrl } = data;

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