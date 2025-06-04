import { useEffect, useState } from "react";
import "./App.css";
import MenuBar from "./components/global/MenuBar";
import { platform } from "@tauri-apps/plugin-os";
import BusForm from "./components/home/BusForm";
import { DataContext } from "./context/DataContext";
import RouteDetails from "./components/home/RouteDetails";
import MatrixContainer from "./components/home/MatrixContainer";
import Footer from "./components/global/Footer";
import { isEmpty } from "lodash";

export default function App() {
  const currentOS = platform();
  const [isMobileOS, setIsMobileOS] = useState<boolean>(false);
  const [selectedTrainName, setSelectedTrainName] = useState<string | null>(
    null
  );
  const [selectedTrainModel, setSelectedTrainModel] = useState<string | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [routeData, setRouteData] = useState(null);
  const [formatedDate, setFormatedDate] = useState<string | null>(null);
  const [routeList, setRouteList] = useState([]);
  const [cityMatrix, setCityMatrix] = useState([]);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [trainData, setTrainData] = useState<any[][] | null>(null);
  const [routeListInfo, setRouteListInfo] = useState([]);
  const [isMatrixCreated, setIsMatrixCreated] = useState(false);
  const [ticketFound, setTicketFound] = useState(false);
  const [numberOfSeatsFound, setNumberOfSeatsFound] = useState(0);

  useEffect(() => {
    if (currentOS === "android" || currentOS === "ios") setIsMobileOS(true);
  }, [selectedTrainName, routeList]);

  return (
    <DataContext.Provider
      value={{
        setSelectedTrainName,
        selectedTrainName,
        setSelectedTrainModel,
        setSelectedDate,
        selectedTrainModel,
        selectedDate,
        routeData,
        setRouteData,
        formatedDate,
        setFormatedDate,
        routeList,
        setRouteList,
        cityMatrix,
        setCityMatrix,
        shouldFetch,
        setShouldFetch,
        trainData,
        setTrainData,
        routeListInfo,
        setRouteListInfo,
        isMatrixCreated,
        setIsMatrixCreated,
        ticketFound,
        setTicketFound,
        numberOfSeatsFound,
        setNumberOfSeatsFound,
      }}
    >
      <div className="grid w-full min-h-screen">
        {!isMobileOS && <MenuBar />}

        <BusForm />

        <div className="w-full grid">
          {!isEmpty(routeListInfo) && <RouteDetails />}
        </div>

        {!isEmpty(routeListInfo) && <MatrixContainer />}

        <Footer />
      </div>
    </DataContext.Provider>
  );
}
