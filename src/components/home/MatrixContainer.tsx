import { useContext, useEffect } from "react";
import { DataContext } from "../../context/DataContext";
import MatrixBox from "./MatrixBox";

export default function MatrixContainer() {
  const { routeData, setRouteList } = useContext(DataContext);

  const routeListCalculation = () => {
    if (!routeData?.data?.routes) return;
    const cityList = routeData.data.routes.map(
      (route: { city: any }) => route.city
    );
    setRouteList(cityList);
  };

  useEffect(() => {
    if (routeData?.data?.routes?.length > 0) {
      routeListCalculation();
    }
  }, [routeData]);

  return (
    <div className="w-inherit  grid justify-center justify-items-center">
      <div className="matrix-box w-inherit pt-10 grid">
        <MatrixBox />
      </div>
    </div>
  );
}
