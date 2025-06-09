import { ArrowLeft, ArrowRight, Maximize2, Minus, X } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useState } from "react";
import ThemeToggleButton from "@/ui/ThemeToggleButton";
import { useNavigate } from "react-router-dom";

export default function MenuBar() {
  const [isFullScreen, setIsFullScreen] = useState<boolean | null>(null);
  const navigate = useNavigate();
  const startDraggingWindow = async () => {
    await getCurrentWindow().startDragging();
  };

  const hideWindow = async () => {
    try {
      await getCurrentWindow().minimize();
    } catch (e) {
      console.log(e);
    }
  };

  const handleFullScreen = async () => {
    try {
      let screenStatus = await getCurrentWindow().isFullscreen();
      setIsFullScreen(screenStatus);
      console.log(screenStatus);
      if (isFullScreen) {
        await getCurrentWindow().setFullscreen(false);
        setIsFullScreen(false);
      } else {
        await getCurrentWindow().setFullscreen(true);
        setIsFullScreen(true);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleWindowClose = async () => {
    try {
      await getCurrentWindow().close();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="menu-bar fixed z-50 top-0 grid left-0 grid-cols-3 w-full   bg-[#191f1f] dark:bg-zinc-900">
      <div className="flex window-control  grid-cols-3 items-start gap-4 p-1 ">
        <X
          onClick={handleWindowClose}
          className="cursor-pointer w-5 text-white"
        />
        <Minus
          onClick={hideWindow}
          className="cursor-pointer w-5 text-white"
        />
        <Maximize2
          onClick={handleFullScreen}
          className="cursor-pointer w-5 text-white"
        />
      </div>
      <ul
        className="window-drag-area col-span-2 grid items-center w-full   grid-cols-12 bg-[#191f1f] dark:bg-zinc-900
"
      >
        {/* Dragging window section.... */}
        <li
          className="col-span-6  w-full h-full cursor-grabbing"
          onMouseDown={startDraggingWindow}
        ></li>

        {/* Navigation section.... */}
        <li className="grid grid-cols-2 w-fit col-span-4 gap-5 md:gap-15 lg:gap-24 cursor-pointer justify-items-center content-center text-white">
          <p onClick={() => navigate(-1)}>
            <ArrowLeft />
          </p>
          <p onClick={() => navigate(1)}>
            {" "}
            <ArrowRight />
          </p>
        </li>

        <li className="w-full col-span-2 pr-3 grid items-center justify-items-center">
          <ThemeToggleButton />
        </li>
      </ul>
    </div>
  );
}
