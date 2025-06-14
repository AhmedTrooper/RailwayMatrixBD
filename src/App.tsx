import { useEffect } from "react";
import "./App.css";
import MenuBar from "./components/global/menubar/MenuBar";
import useThemeStore from "./store/themeStore";
import { Outlet } from "react-router-dom";
import useOsInfoStore from "./store/osInfoStore";
import { useStationStore } from "./store/stationListStore";
import { useJourneyStore } from "./store/journeyStore";
import { useTrainListStore } from "./store/trainListStore";
import MobileMenuBar from "./components/global/menubar/MobileMenuBar";
import clsx from "clsx";
import Footer from "./components/global/footer/Footer";
import { Button } from "@heroui/react";
import { useMatrixStore } from "./store/matrixStore";

function App() {
  const dark = useThemeStore((state) => state.dark);
  const setDark = useThemeStore((state) => state.setDark);
  const detectOS = useOsInfoStore((state) => state.detectMobileOS);
  const isMobileOS = useOsInfoStore((state) => state.isMobileOS);
  const stationList = useStationStore((state) => state.stationList);
  const trainList = useTrainListStore((state) => state.trainList);
   const object = useMatrixStore(state => state.trainData);
  const setOriginStationList = useJourneyStore(
    (state) => state.setOriginStationList
  );
  const setDestinationStationList = useJourneyStore(
    (state) => state.setDestinationStationList
  );
  const setFormattedTrainList = useJourneyStore(
    (state) => state.setFormattedTrainList
  );

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") setDark(true);
  }, [setDark]);

  useEffect(() => {
    detectOS();
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
    detectOS,
  ]);

  // useEffect(() => {
  //   const handleContextMenu = (event: MouseEvent) => {
  //     event.preventDefault();
  //   };
  //   document.addEventListener("contextmenu", handleContextMenu);
  //   return () => {
  //     document.removeEventListener("contextmenu", handleContextMenu);
  //   };
  // }, []);



 const showObjectDetails = () => {
 console.log(object)

  function recurse(obj:any, prefix = '') {
    let str = '';
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'object' && value !== null) {
        str += recurse(value, `${prefix}${key}.`);
      } else {
        str += `${prefix}${key}: ${value}\n`;
      }
    }
    return str;
  }

  const detailsString = recurse(object);
  console.log(detailsString);
};


  return (
    <div
      className={clsx(
        "grid min-h-screen text-black dark:bg-zinc-900 dark:text-white transition-colors select-none",
        {
          "pt-10": !isMobileOS,
        }
      )}
    >
      {!isMobileOS && <MenuBar />}
      {isMobileOS && <MobileMenuBar />}
      <Outlet />
      <Button onPress={ showObjectDetails}>Get Object Info</Button>
      {!isMobileOS && <Footer />}
    </div>
  );
}

export default App;
