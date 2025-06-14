import { create } from "zustand";
import { useTrainStore } from "./trainStore";
import { SeatType } from "@/interface/store/SeatTypeInterface";
import { MatrixStore } from "@/interface/store/MatrixStoreInterface";
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
      const {
        setIsLoadingTicketFetching,
        setHasSearchedForTicket,
        setDummyMatrixVisible,
        setShowTicketNotFoundBox,
        setShowTicketFoundBox,
        setTicketFound,
        setTrainData,
        setNumberOfTicketFound,
        hasSearchedForTicket,
        showTicketFoundBox,
        ticketFound,
      } = matrixStore;

      setIsLoadingTicketFetching(true);
      setHasSearchedForTicket(true);
      setDummyMatrixVisible(false);
      setShowTicketNotFoundBox(false);

      if (hasSearchedForTicket) setHasSearchedForTicket(false);
      if (showTicketFoundBox) setShowTicketFoundBox(false);
      if (ticketFound) setTicketFound(false);

      const routeList = trainStore.routeList;
      const size = routeList.length;
      const selectedTrainName = trainStore.userTrainName;

      const dataMatrix: SeatType[][] = Array.from({ length: size }, () =>
        Array(size).fill(null)
      );

      const fetchTasks: Promise<void>[] = [];

      for (let i = 0; i < size - 1; i++) {
        for (let j = i + 1; j < size; j++) {
          const from = routeList[i];
          const to = routeList[j];

          const url = `https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2?from_city=${from}&to_city=${to}&date_of_journey=${journeyStore.formattedJourneyDate}&seat_class=SHULOV`;

          const task = (async () => {
            try {
              const res = await fetch(url);
              const json = await res.json();
              const train = json?.data?.trains?.find(
                (t: any) => t?.trip_number === selectedTrainName
              );

              const availableSeats = (train?.seat_types || []).filter(
                (s: any) => s.seat_counts.online + s.seat_counts.offline > 0
              );

              dataMatrix[i][j] = availableSeats;

              if (availableSeats.length > 0) {
                setTicketFound(true);
                ticketNumber++;

                addToast({
                  title: "Seat Available",
                  description: `Seats found for route ${from} -> ${to}`,
                  color: "success",
                  timeout: 200,
                });
              }
            } catch (err) {
              console.error(`Error fetching ${from} -> ${to}:`, err);
              addToast({
                title: "Failed for this route",
                description: `Error fetching ${from} -> ${to}`,
                color: "warning",
                timeout: 200,
              });
            }
          })();

          fetchTasks.push(task);
        }
      }

      await Promise.all(fetchTasks);

      setTrainData(dataMatrix);
      setNumberOfTicketFound(ticketNumber);
    } catch (e) {
      console.error("Matrix fetch error:", e);
      addToast({
        title: "Total fetching error",
        description: `Error to fetch matrix...`,
        color: "danger",
        timeout: 1000,
      });
    } finally {
      const matrixStore = useMatrixStore.getState();
      matrixStore.setIsLoadingTicketFetching(false);

      if (!matrixStore.ticketFound) {
        matrixStore.setDummyMatrixVisible(true);
        matrixStore.setShowTicketNotFoundBox(true);
      } else {
        matrixStore.setShowTicketFoundBox(true);
      }
    }
  },
}));
