import {
  UserTrainRouteInformation,
  UserTrainRouteInformationList,
} from "@/interface/userTrainRouteInformation";
import { create } from "zustand";
import { useJourneyStore } from "./journeyStore";
import { fetch } from "@tauri-apps/plugin-http";
import { addToast } from "@heroui/react";
import isOnline from "is-online";
import { isEmpty } from "lodash";
import { TrainInformation } from "@/interface/TrainInfo";

type UserTrainStore = {
  userTrainList: string[] | [];
  routeList: string[];
  userTrainModel: string | null;
  userTrainName: string | null;
  setUserTrainList: (trainList: string[] | []) => void;
  setUserRouteList: (routeList: string[] | []) => void;
  setUserTrainModel: (model: string | null) => void;
  setUserTrainName: (trainName: string | null) => void;
  userTrainRouteInformationList: UserTrainRouteInformationList | [];
  hasTrainBeenSearchedOnce: boolean;
  isTrainFetchingLoading: boolean;
  offDays: string[] | [];
  setOffDays: (list: [] | string[]) => void;
  trainInformaton: TrainInformation | null;
  setTrainInformation: (trInfo: TrainInformation | null) => void;

  setUserTrainRouteInformationList: (
    userTrainRouteInformation: UserTrainRouteInformation[] | []
  ) => void;
  fetchUserTrainList: () => void;
  setHasTrainBeenSearchedOnce: (status: boolean) => void;
  setIsTrainFetchingLoading: (status: boolean) => void;
  fetchUserTrainInformation: () => void;
  extractTrainModel: (train: string) => void;
  validateAndFetchTrain: () => void;
  showRouteInformation: boolean;
  setShowRouteInformation: (status: boolean) => void;
  calculateOffDays: () => void;
};

export const useTrainStore = create<UserTrainStore>((set, get) => ({
  offDays: [],
  setOffDays: (list: [] | string[]) => set({ offDays: list }),

  setTrainInformation: (trInfo: TrainInformation | null) =>
    set({
      trainInformaton: trInfo,
    }),

  trainInformaton: null,

  showRouteInformation: false,

  setShowRouteInformation: (status: boolean) =>
    set({ showRouteInformation: status }),

  userTrainList: [],

  userTrainModel: null,

  userTrainName: null,

  routeList: [],

  userTrainRouteInformationList: [],

  hasTrainBeenSearchedOnce: false,

  isTrainFetchingLoading: false,

  setIsTrainFetchingLoading: (status: boolean) =>
    set({ isTrainFetchingLoading: status }),

  setHasTrainBeenSearchedOnce: (status: boolean) =>
    set({ hasTrainBeenSearchedOnce: status }),

  setUserTrainRouteInformationList: (
    userTrainRouteInformation: UserTrainRouteInformation[] | []
  ) => set({ userTrainRouteInformationList: userTrainRouteInformation }),

  setUserTrainList: (trainList) => set({ userTrainList: trainList }),

  setUserRouteList: (allRoutes) => set({ routeList: allRoutes }),

  setUserTrainModel: (model: string | null) => set({ userTrainModel: model }),

  setUserTrainName: (name: string | null) =>
    set({
      userTrainName: name,
    }),

  fetchUserTrainList: async () => {
    try {
      const journeyStore = useJourneyStore.getState();

      const tempUrl = `https://railspaapi.shohoz.com/v1.0/web/bookings/search-trips-v2?from_city=${journeyStore.originStation}&to_city=${journeyStore.destinationStation}&date_of_journey=${journeyStore.formattedJourneyDate}&seat_class=SHULOV`;
      let response = await fetch(tempUrl);
      if (response.status === 200) {
        addToast({
          title: "Request successfull",
          description: "Request is sent without any error",
          color: "success",
          timeout: 200,
        });

        let responseObject = await response.json();
        let trains = responseObject!.data!.trains.map((train: any) =>
          train!.trip_number.trim()
        );

        if (isEmpty(trains)) {
          addToast({
            title: "No train found",
            description: "No train is found in your route.....",
            color: "warning",
            timeout: 3000,
          });
        } else {
          addToast({
            title: "Congrats",
            description: "Train is available for this route",
            color: "success",
            timeout: 3000,
          });
        }

        set({ userTrainList: trains });
      } else {
        addToast({
          title: "Request not successfull",
          description: "Request is not sent to server",
          color: "danger",
          timeout: 300,
        });
      }
    } catch (e: any) {
      addToast({
        title: "Request error",
        description: e.toString(),
        color: "danger",
        timeout: 300,
      });
    } finally {
      const setIsTrainFetchingLoading = get().setIsTrainFetchingLoading;
      setIsTrainFetchingLoading(false);
    }
  },

  fetchUserTrainInformation: async () => {
    try {
      addToast({
        title: "Ticket Request",
        description: "Request sent successfully",
        color: "primary",
        timeout: 300,
      });

      const trainStore = get();
      const journeyStore = useJourneyStore.getState();
      const userTrainModel = trainStore.userTrainModel;
      const journeyDate = journeyStore.journeyDate;
      trainStore.trainInformaton = null;
      trainStore.setOffDays([]);
      trainStore.setUserTrainRouteInformationList([]);
      const response = await fetch(
        "https://railspaapi.shohoz.com/v1.0/web/train-routes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: userTrainModel,
            departure_date_time: journeyDate,
          }),
        }
      );

      if (response.status === 200) {
        addToast({
          title: "Successful response",
          description: "Server responded successfully",
          color: "success",
          timeout: 300,
        });
        const routeDataObject = await response.json();
        trainStore.setTrainInformation(routeDataObject.data);
        // console.log(routeDataObject.data)

        set({ userTrainRouteInformationList: routeDataObject!.data!.routes });
        if (!routeDataObject?.data?.routes) return;
        const cityList = routeDataObject.data.routes.map(
          (route: { city: any }) => route.city
        );
        set({ routeList: cityList });
      } else {
        addToast({
          title: "Request Error",
          description: "Check if train name, date  is ok...or try again...",
          color: "warning",
          timeout: 300,
        });
      }
    } catch (error) {
      if (!(await isOnline())) {
        addToast({
          title: "Check Internet connection",
          description: "Check if internet connection is ok...",
          color: "danger",
          timeout: 1000,
        });
      } else {
        addToast({
          title: "Error occurred",
          description: "Try again...",
          color: "danger",
          timeout: 300,
        });
      }
    }
  },
  extractTrainModel: (train: string) => {
    let match = train.match(/\((\d+)\)/);
    let numberString = match![1];
    set({ userTrainModel: numberString });
  },
  validateAndFetchTrain: async () => {
    const journeyStore = useJourneyStore.getState();
    const trainStore = get();
    const journeyDate = journeyStore.journeyDate;
    const originStation = journeyStore.originStation;
    const destinationStation = journeyStore.destinationStation;
    const setHasTrainBeenSearchedOnce = trainStore.setHasTrainBeenSearchedOnce;
    const setUserTrainName = trainStore.setUserTrainName;
    const setUserTrainList = trainStore.setUserTrainList;
    const setIsTrainFetchingLoading = trainStore.setIsTrainFetchingLoading;
    const fetchUserTrainList = trainStore.fetchUserTrainList;
    const setShowProperJourneyInformationAlert =
      journeyStore.setShowProperJourneyInformationAlert;
    const setIsReadyToFetchUserTrainList =
      journeyStore.setIsReadyToFetchUserTrainList;

    if (!journeyDate) {
      addToast({
        title: "Date error",
        description: `Journey date must be selected`,
        color: "warning",
        timeout: 1000,
      });

      return;
    }

    if (originStation === destinationStation) {
      addToast({
        title: "Station Error",
        description: `Origin Station and Destination station can't be same....`,
        color: "warning",
        timeout: 1000,
      });

      return;
    }

    const isJourneyInfoValid =
      (journeyDate && originStation && destinationStation && originStation) !==
      destinationStation;
    setShowProperJourneyInformationAlert(!isJourneyInfoValid);
    setIsReadyToFetchUserTrainList(isJourneyInfoValid);

    if (!(await isOnline())) {
      addToast({
        title: "Internet Error",
        description: `Check if internet connection is ok`,
        color: "danger",
        timeout: 1000,
      });

      return;
    }

    if (isJourneyInfoValid) {
      setUserTrainName(null);
      setUserTrainList([]);
      setIsTrainFetchingLoading(true);
      setHasTrainBeenSearchedOnce(true);

      addToast({
        title: "Request sent",
        description: `Trying to fetch train list`,
        color: "primary",
        timeout: 500,
      });

      fetchUserTrainList();
    } else {
      addToast({
        title: "Invalid Journey Info",
        description: "Fix journey information correctly....",
        color: "danger",
        timeout: 800,
      });
      setHasTrainBeenSearchedOnce(false);
    }
  },

  calculateOffDays: () => {
    const { trainInformaton, setOffDays } = get();

    const allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const activeDays = (trainInformaton?.days || []).map((day) =>
      day.toLowerCase()
    );

    const offDays = allDays.filter(
      (day) => !activeDays.includes(day.toLowerCase())
    );
    setOffDays(offDays);
  },
}));
