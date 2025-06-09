import { create } from "zustand";
import { useTrainStore } from "./trainStore";
import { SeatType } from "@/interface/SeatTypeInterface";
import { MatrixStore } from "@/interface/MatrixStoreInterface";
import { useJourneyStore } from "./journeyStore";
import { fetch } from "@tauri-apps/plugin-http";
import { addToast } from "@heroui/react";

export const useMatrixStore = create<MatrixStore>((set, get) => ({
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
  createMatrix: async () => {
    try {
      const matrixStore = get();
      const trainStore = useTrainStore.getState();
      const journeyStore = useJourneyStore.getState();
      let ticketNumber = 0;
      matrixStore.setIsLoadingTicketFetching(true);
      matrixStore.setHasSearchedForTicket(true);
      matrixStore.setDummyMatrixVisible(false);
      matrixStore.setShowTicketNotFoundBox(false);

      if (matrixStore.hasSearchedForTicket) {
        matrixStore.setHasSearchedForTicket(false);
      }

      let showTicketFoundBox = matrixStore.showTicketFoundBox;
      let setShowTicketFoundBox = matrixStore.setShowTicketFoundBox;

      if (showTicketFoundBox) {
        setShowTicketFoundBox(false);
      }
      const routeList = trainStore.routeList;
      const size = routeList.length;
      const setTicketFound = matrixStore.setTicketFound;
      const ticketFound = matrixStore.ticketFound;
      if (ticketFound) {
        setTicketFound(false);
      }
      const dataMatrix: SeatType[][] = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => null as any)
      );
      const selectedTrainName = trainStore.userTrainName;
      const fetchTasks: Promise<void>[] = [];

      for (let i = 0; i < size - 1; i++) {
        for (let j = i + 1; j < size; j++) {
          const from = routeList[i];
          const to = routeList[j];

          if (from === to) continue;

          const tempUrl = `https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2?from_city=${from}&to_city=${to}&date_of_journey=${journeyStore.formattedJourneyDate}&seat_class=SHULOV`;

          const task = fetch(tempUrl)
            .then((res) => res.json())
            .then((jsonData) => {
              const trainList = jsonData?.data?.trains || [];
              const train = trainList.find(
                (t: any) => t?.trip_number === selectedTrainName
              );
              const seatTypes = train?.seat_types || [];

              const availableSeats = seatTypes.filter(
                (item: any) =>
                  item.seat_counts.online + item.seat_counts.offline > 0
              );

              dataMatrix[i][j] = availableSeats;

              if (availableSeats.length > 0) {
                setTicketFound(true);
                ticketNumber++;

                addToast({
                  title: "Seat Available",
                  description: `Seats found for route ${from} -> ${to}`,
                  color: "success",
                  timeout: 30,
                });
              }
            })
            .catch((err) => {
              console.error(`Error fetching ${from} -> ${to}:`, err);
              addToast({
                title: "Failed for this route",
                description: `Error fetching ${from} -> ${to}:`,
                color: "warning",
                timeout: 1000,
              });
            });

          fetchTasks.push(task);
        }
      }

      await Promise.all(fetchTasks);
      matrixStore.setTrainData(dataMatrix);
      matrixStore.setNumberOfTicketFound(ticketNumber);
    } catch (e) {
      console.error("Matrix fetch error:", e);
    } finally {
      let matrixStore = useMatrixStore.getState();
      matrixStore.setIsLoadingTicketFetching(false);
      let setShowTicketFoundBox = matrixStore.setShowTicketFoundBox;
      if (!matrixStore.ticketFound) {
        matrixStore.setDummyMatrixVisible(true);
        matrixStore.setShowTicketNotFoundBox(true);
      } else {
        setShowTicketFoundBox(true);
      }
    }
  },
}));
