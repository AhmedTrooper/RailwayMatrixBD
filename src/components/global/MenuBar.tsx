import { Maximize2, Minus, X } from "lucide-react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { useState } from "react";

export default function MenuBar() {
  const [isFullScreen, setIsFullScreen] = useState<boolean | null>(null);
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
      if (isFullScreen === true) {
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
    <div className="menu-bar fixed top-0 grid  grid-cols-3 w-[100vw]  bg-red-500">
      <div className="flex window-control  grid-cols-3 items-start gap-4  p-1">
        <X
          onClick={handleWindowClose}
          className="cursor-pointer w-5 text-white"
        />
        <Minus onClick={hideWindow} className="cursor-pointer w-5 text-white" />
        <Maximize2
          onClick={handleFullScreen}
          className="cursor-pointer w-5 text-white"
        />
      </div>
      <div
        onMouseDown={startDraggingWindow}
        className="window-drag-area col-span-2 flex items-center justify-center cursor-grabbing"
      ></div>
    </div>
  );
}
