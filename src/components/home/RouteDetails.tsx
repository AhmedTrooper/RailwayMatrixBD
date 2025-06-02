
import { useContext, Fragment, useState } from "react";
import { DataContext } from "../../context/DataContext";

export default function RouteDetails() {
  const { routeData } = useContext(DataContext);
  const [isOpen, setIsOpen] = useState(false);

  if (!routeData || !routeData.data) {
    return <p className="text-center text-gray-500 py-4 text-sm">No route data available.</p>;
  }

  const { train_name, days, total_duration, routes } = routeData.data;

  return (
    <Fragment>
      <div className="w-4/5 justify-self-center box-border p-4 bg-white rounded shadow overflow-x-hidden">
        <header
          className="text-center p-2 cursor-pointer select-none"
          onClick={() => setIsOpen(!isOpen)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (["Enter", " "].includes(e.key) ? setIsOpen(!isOpen) : null)}
        >
          <h1 className="text-xl font-bold text-blue-700 flex justify-center items-center gap-1">
            {train_name}
            <svg
              className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </h1>
          <p className="text-gray-600 text-sm">
            <span className="font-semibold">Days:</span> {days.join(", ")}
          </p>
          <p className="text-gray-600 text-sm">
            <span className="font-semibold">Duration:</span> {total_duration}
          </p>
        </header>

        {isOpen && (
          <div className="relative border-l-2 border-blue-500 pl-3 mt-3 overflow-x-hidden">
            {routes.map((stop: any, index: number) => {
              const isLast = index === routes.length - 1;
              return (
                <div key={index} className="relative py-3 px-1">
                  <span className="absolute -left-3 top-4 w-3 h-3 bg-blue-500 rounded-full border border-white shadow"></span>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm w-full">
                    <h2 className="font-semibold text-gray-800">{stop.city}</h2>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-gray-600">
                      <div><span className="font-semibold">Arrival:</span> {stop.arrival_time ?? <i className="text-gray-400">N/A</i>}</div>
                      <div><span className="font-semibold">Departure:</span> {stop.departure_time ?? <i className="text-gray-400">N/A</i>}</div>
                      <div><span className="font-semibold">Halt:</span> {stop.halt ?? <i className="text-gray-400">-</i>} min</div>
                      <div><span className="font-semibold">Duration:</span> {stop.duration ?? <i className="text-gray-400">-</i>}</div>
                    </div>
                  </div>
                  {!isLast && <div className="absolute left-0 top-6 w-px bg-blue-300 h-full"></div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Fragment>
  );
}
