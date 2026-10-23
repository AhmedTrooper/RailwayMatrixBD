import { create } from "zustand";
import { useTrainStore } from "./trainStore";
import { SeatType } from "@/interface/store/SeatTypeInterface";
import { MatrixStore } from "@/interface/store/MatrixStoreInterface";
import { useJourneyStore } from "./journeyStore";
import { appFetch as fetch, railwayAuthHeaders } from "@/utils/http";
import { addToast } from "@heroui/react";
import { SeatTypeObject } from "@/interface/SeatTypesArray";
import { isEmpty } from "lodash";
import { useAuthorizationStore } from "./AuthorizationStore";

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const humanPauseMs = (): number => 2000 + Math.floor(Math.random() * 1500);

const shouldStopForStatus = (status: number): boolean =>
  status === 401 || status === 403 || status === 429;

export const useMatrixStore = create<MatrixStore>((set, get) => ({
  segmentedRouteFound: true,
  setSegmentedRouteFound: (srf: boolean) => set({ segmentedRouteFound: srf }),
  segmentedOriginStation: null,
  setSegmentedOriginStation: (s: string | null) =>
    set({ segmentedOriginStation: s }),
  segmentedDestinationStation: null,
  setSegmentedDestinationStation: (s: string | null) =>
    set({ segmentedDestinationStation: s }),
  segmentedSeatArray: [],
  setSegmentedSeatArray: (segArray: SeatTypeObject[]) =>
    set({ segmentedSeatArray: segArray }),
  setTicketFound: (status: boolean) => set({ ticketFound: status }),
  ticketFound: false,
  isLoadingTicketFetching: false,
  setIsLoadingTicketFetching: (status: boolean) =>
    set({ isLoadingTicketFetching: status }),
  trainData: [],
  setTrainData: (list: SeatType[][] | []) => set({ trainData: list }),
  showTicketFoundBox: false,
  setShowTicketFoundBox: (status: boolean) =>
    set({ showTicketFoundBox: status }),
  showTicketNotFoundBox: false,
  setShowTicketNotFoundBox: (status: boolean) =>
    set({ showTicketNotFoundBox: status }),
  numberOfTicketFound: 0,
  setNumberOfTicketFound: (ticket: number) =>
    set({ numberOfTicketFound: ticket }),
  hasSearchedForTicket: false,
  setHasSearchedForTicket: (status: boolean) =>
    set({ hasSearchedForTicket: status }),
  dummyMatrixVisible: true,
  setDummyMatrixVisible: (status: boolean) =>
    set({ dummyMatrixVisible: status }),
  matrixProgress: null,
  setMatrixProgress: (progress) => set({ matrixProgress: progress }),

  createMatrix: async () => {
    try {
      const matrixStore = get();
      const trainStore = useTrainStore.getState();
      const journeyStore = useJourneyStore.getState();
      const authorizationStore = useAuthorizationStore.getState();
      const setSegmentedRouteFound = matrixStore.setSegmentedRouteFound;
      const setSegmentedSeatArray = matrixStore.setSegmentedSeatArray;

      let ticketNumber = 0;
      const {
        setIsLoadingTicketFetching,
        setHasSearchedForTicket,
        setDummyMatrixVisible,
        setShowTicketNotFoundBox,
        setShowTicketFoundBox,
        setTicketFound,
        setTrainData,
        setNumberOfTicketFound,
        setMatrixProgress,
      } = matrixStore;

      setIsLoadingTicketFetching(true);
      setHasSearchedForTicket(true);
      setDummyMatrixVisible(false);
      setShowTicketNotFoundBox(false);
      setShowTicketFoundBox(false);
      setSegmentedRouteFound(false);
      setSegmentedSeatArray([]);
      setTicketFound(false);
      matrixStore.setSearchedForSegmentedRoute(false);

      const routeList = trainStore.routeList;
      const size = routeList.length;
      const selectedTrainName = trainStore.userTrainName;
      const originStation = journeyStore.originStation;
      const destinationStation = journeyStore.destinationStation;

      const dataMatrix: SeatType[][] = Array.from({ length: size }, () =>
        Array(size).fill(null)
      );

      const pairs: Array<{ i: number; j: number; from: string; to: string }> =
        [];
      for (let i = 0; i < size - 1; i++) {
        for (let j = i + 1; j < size; j++) {
          pairs.push({
            i,
            j,
            from: routeList[i],
            to: routeList[j],
          });
        }
      }

      const preferredIndex = pairs.findIndex(
        (pair) =>
          pair.from === originStation && pair.to === destinationStation
      );
      if (preferredIndex > 0) {
        const [preferredPair] = pairs.splice(preferredIndex, 1);
        pairs.unshift(preferredPair);
      }

      let stoppedEarly = false;

      for (let index = 0; index < pairs.length; index++) {
        const { i, j, from, to } = pairs[index];
        setMatrixProgress({
          current: index + 1,
          total: pairs.length,
          from,
          to,
        });

        const url = `https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2?from_city=${encodeURIComponent(from)}&to_city=${encodeURIComponent(to)}&date_of_journey=${encodeURIComponent(journeyStore.formattedJourneyDate || "")}&seat_class=SHULOV`;

        try {
          const res = await fetch(url, {
            headers: railwayAuthHeaders(authorizationStore),
          });

          if (shouldStopForStatus(res.status)) {
            stoppedEarly = true;
            addToast({
              title: "Stopped to protect account",
              description:
                res.status === 429
                  ? "Railway rate-limited the search. Try again later."
                  : "Auth failed. Refresh token/SSDK/UUDID and try again.",
              color: "danger",
              timeout: 6000,
            });
            break;
          }

          if (res.status !== 200) {
            addToast({
              title: "Route skipped",
              description: `${from} -> ${to} returned ${res.status}`,
              color: "warning",
              timeout: 1500,
            });
          } else {
            const json = await res.json();
            const train = json?.data?.trains?.find(
              (t: any) => t?.trip_number === selectedTrainName
            );

            const availableSeats = (train?.seat_types || []).filter(
              (s: any) => s.seat_counts.online + s.seat_counts.offline > 0
            );

            dataMatrix[i][j] = availableSeats;
            setTrainData(dataMatrix.map((row) => [...row]));

            if (availableSeats.length > 0) {
              setTicketFound(true);
              ticketNumber++;
              addToast({
                title: "Seat Available",
                description: `Seats found for route ${from} -> ${to}`,
                color: "success",
                timeout: 2000,
              });
            }
          }
        } catch {
          addToast({
            title: "Failed for this route",
            description: `Error fetching ${from} -> ${to}`,
            color: "warning",
            timeout: 1500,
          });
        }

        if (index < pairs.length - 1 && !stoppedEarly) {
          await sleep(humanPauseMs());
        }
      }

      setTrainData(dataMatrix);
      setNumberOfTicketFound(ticketNumber);
    } catch (e) {
      addToast({
        title: "Total fetching error",
        description: `Error to fetch matrix...`,
        color: "danger",
        timeout: 1000,
      });
    } finally {
      const matrixStore = useMatrixStore.getState();
      matrixStore.setIsLoadingTicketFetching(false);
      matrixStore.setMatrixProgress(null);

      if (!matrixStore.ticketFound) {
        matrixStore.setDummyMatrixVisible(true);
        matrixStore.setShowTicketNotFoundBox(true);
      } else {
        matrixStore.setShowTicketFoundBox(true);
      }
    }
  },
  segmentedRouteFinder: () => {
    const matrixStore = get();
    const dataMatrix = matrixStore.trainData;
    const segmentedDestinationStation = matrixStore.segmentedDestinationStation;
    const segmentedOriginStation = matrixStore.segmentedOriginStation;
    const setSegmentedRouteFound = matrixStore.setSegmentedRouteFound;
    matrixStore.setSearchedForSegmentedRoute(true);
    try {
      setSegmentedRouteFound(false);
      addToast({
        title: "Request sent",
        description: "Segmented route requested",
        color: "primary",
        timeout: 300,
      });
      matrixStore.showSegmentedRoute(
        segmentedOriginStation as string,
        segmentedDestinationStation as string,
        dataMatrix
      );
    } catch (e: any) {
      // console.log(e);
      addToast({
        title: "Error Occurred",
        description: "Segmented route requested failed",
        color: "danger",
        timeout: 1000,
      });
    }
  },
  findSegmentedRoute: (
    start: number,
    end: number,
    dataMatrix: any[][]
  ): number[] => {
    const queue: number[][] = [[start]];
    const visited: Set<string> = new Set();

    while (queue.length > 0) {
      const path = queue.shift()!;
      const last = path[path.length - 1];

      if (last === end) return path;

      for (let next = 0; next < dataMatrix.length; next++) {
        const edge = dataMatrix[last][next];

        if (
          edge &&
          Array.isArray(edge) &&
          edge.length > 0 &&
          !path.includes(next)
        ) {
          const newPath = [...path, next];
          const key = newPath.join("-");
          if (!visited.has(key)) {
            queue.push(newPath);
            visited.add(key);
          }
        }
      }
    }

    return []; // No path found
  },
  showSegmentedRoute(fromCity: string, toCity: string, dataMatrix: any[][]) {
    let segmentedArray = [];
    const matrixStore = get();
    const setSegmentedRouteFound = matrixStore.setSegmentedRouteFound;
    const trainStore = useTrainStore.getState();
    const routeList = trainStore.routeList;
    const setSegmentedSeatArray = matrixStore.setSegmentedSeatArray;
    const startIndex = routeList.indexOf(fromCity);
    const endIndex = routeList.indexOf(toCity);
    setSegmentedSeatArray([]);

    if (startIndex === -1 || endIndex === -1) {
      // console.error("Invalid city name");
      addToast({
        title: "City Error",
        description: "Invalid city name",
        color: "warning",
        timeout: 1000,
      });
      return;
    }

    const path = matrixStore.findSegmentedRoute(
      startIndex,
      endIndex,
      dataMatrix
    );

    if (path.length === 0) {
      setSegmentedRouteFound(false);
      // console.log(`No segmented route found from ${fromCity} to ${toCity}.`);
      addToast({
        title: "Not Found",
        description: `No segmented route found from ${fromCity} to ${toCity}.`,
        color: "danger",
        timeout: 1000,
      });
      return;
    }

    // console.log(`Segmented route from ${fromCity} to ${toCity}:`);
    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
      // console.log(`- ${routeList[from]} → ${routeList[to]}`);
      // console.log("  Available seats:", dataMatrix[from][to]);
      // console.log("<-----Start------>\n\n\n");
      // console.log(dataMatrix[from][to])
      // console.log("\n\n\n<-----End----->");
      const segmentedObject: SeatTypeObject = {
        fromCity: routeList[from],
        toCity: routeList[to],
        seatsArr: dataMatrix[from][to],
      };
      segmentedArray.push(segmentedObject);
    }
    setSegmentedSeatArray(segmentedArray);
    if (!isEmpty(segmentedArray)) {
      setSegmentedRouteFound(true);
      addToast({
        title: "Found",
        description: `segmented route found successfully for ${fromCity} to ${toCity}.`,
        color: "success",
        timeout: 1000,
      });
    } else {
      setSegmentedRouteFound(false);
      addToast({
        title: "No Route Found",
        description: `No route found`,
        color: "warning",
        timeout: 2000,
      });
    }
  },
  searchedForSegmentedRoute: false,
  setSearchedForSegmentedRoute: (value) =>
    set({ searchedForSegmentedRoute: value }),
}));
