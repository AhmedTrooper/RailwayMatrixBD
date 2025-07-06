import { useEffect } from "react";
import "./App.css";
import MenuBar from "./components/global/menubar/MenuBar";
import useThemeStore from "./store/themeStore";
import { Outlet } from "react-router-dom";
import useOsInfoStore from "./store/osInfoStore";
import { useStationStore } from "./store/stationListStore";
import { useJourneyStore } from "./store/journeyStore";
import { useTrainListStore } from "./store/trainListStore";
import clsx from "clsx";
import Footer from "./components/global/footer/Footer";
import { useApplicationStore } from "./store/ApplicationStore";
import MobileMenuBar from "./components/global/menubar/MobileMenuBar";
import { Download, X } from "lucide-react";
import { Button } from "@heroui/react";

function App() {
  const dark = useThemeStore((state) => state.dark);
  const setDark = useThemeStore((state) => state.setDark);
  const detectOS = useOsInfoStore((state) => state.detectMobileOS);
  const isMobileOS = useOsInfoStore((state) => state.isMobileOS);
  const stationList = useStationStore((state) => state.stationList);
  const trainList = useTrainListStore((state) => state.trainList);
  const detectUpdate = useApplicationStore((state) => state.detectUpdate);
  const setOriginStationList = useJourneyStore(
    (state) => state.setOriginStationList
  );
  const setDestinationStationList = useJourneyStore(
    (state) => state.setDestinationStationList
  );
  const setFormattedTrainList = useJourneyStore(
    (state) => state.setFormattedTrainList
  );

  const fetchApplicationVersion = useApplicationStore(
    (state) => state.fetchApplicationVersion
  );

  const updateMetadata = useApplicationStore((state) => state.updateMetadata);
  const isUpdateAvailable = useApplicationStore(
    (state) => state.isUpdateAvailable
  );
  const setShowWarningDialog = useApplicationStore(
    (state) => state.setShowWarningDialog
  );
  const showWarningDialog = useApplicationStore(
    (state) => state.showWarningDialog
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDark(true);
  }, [setDark]);

  useEffect(() => {
    detectOS();
  }, []);

  useEffect(() => {
    fetchApplicationVersion();
  }, []);

  useEffect(() => {
    detectUpdate();
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    const items = stationList.map((station: string, index: number) => ({
      key: index,
      label: station,
    }));
    setOriginStationList(items);
    setDestinationStationList(items);
    const formatedTrainItems = trainList.map(
      (station: string, index: number) => ({
        key: index,
        label: station,
      })
    );
    setFormattedTrainList(formatedTrainItems);
  }, [
    dark,
    stationList,
    setOriginStationList,
    setDestinationStationList,
    setFormattedTrainList,
    trainList,
  ]);

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      event.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <div
      className={clsx(
        "grid min-h-screen text-black dark:bg-zinc-900 dark:text-white transition-colors ",
        {
          "pt-10": !isMobileOS,
        }
      )}
    >
      {!isMobileOS && <MenuBar />}
      {isMobileOS && <MobileMenuBar />}
      {isUpdateAvailable &&
        updateMetadata?.severity === "high" &&
        showWarningDialog && (
          <div className="w-60 h-fit sm:w-80 grid gap-4  dark:bg-zinc-900 shadow-lg p-4 shadow-black  z-50 mt-10 justify-self-center rounded-lg">
            <p onClick={() => setShowWarningDialog(!showWarningDialog)}>
              <X className="cursor-pointer text-red-600" />
            </p>
            <h1 className="font-bold text-green-600">
              Application Update Required
            </h1>
            <p>
              This version of the application is no longer supported. A critical
              update is available.
              <br />
              Please update to the latest version to continue using the app.{" "}
              {String(showWarningDialog)}
            </p>

            <Button
              color="danger"
              className="p-6"
            >
              {updateMetadata?.severity.toUpperCase()}
            </Button>
            <a
              target="_blank"
              href={
                updateMetadata.release_url ? updateMetadata.release_url : "/"
              }
              className="flex gap-2 w-fir p-3 shadow-lg shadow-black font-bold justify-center bg-green-600 text-white rounded-lg"
            >
              <Download /> Download Now
            </a>
          </div>
        )}

      <Outlet />
      {!isMobileOS && <Footer />}
    </div>
  );
}

export default App;
