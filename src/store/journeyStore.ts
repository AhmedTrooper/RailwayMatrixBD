import { StationListForDropdown } from "@/interface/StationInterfaceForDropdown";
import { DateValue } from "@heroui/calendar";
import { create } from "zustand";

interface JourneyState {
  journeyDate: string | null;
  setJourneyDate: (date: string | null) => void;
  formattedJourneyDate: string | null;
  setFormattedJourneyDate: (date: string | null) => void;
  journeyDateGenerator: (date: DateValue | null) => void;
  selectedDate: DateValue | null;
  monthList: string[];
  seatClass: "SHULOV";
  originStation: string | null;
  destinationStation: string | null;
  setOriginStation: (station: string | null) => void;
  setDestinationStation: (station: string | null) => void;
  originStationList: StationListForDropdown | [];
  setOriginStationList: (list: any) => void;
  destinationStationList: StationListForDropdown | [];
  setDestinationStationList: (list: any) => void;
  isReadyToFetchUserTrainList: boolean;
  setIsReadyToFetchUserTrainList: (status: boolean) => void;
  formattedTrainList: StationListForDropdown | [];
  setFormattedTrainList: (list: any) => void;
  pickedDate: DateValue | null;
  setPickedDate: (date: DateValue | null) => void;
  showProperJourneyInformationAlert :boolean;
  setShowProperJourneyInformationAlert:(status:boolean)=>void;
}

export const useJourneyStore = create<JourneyState>((set, get) => ({
  showProperJourneyInformationAlert :false,
  setShowProperJourneyInformationAlert:(status:boolean)=>set({showProperJourneyInformationAlert:status}),
  pickedDate: null,
  setPickedDate: (date: DateValue | null) => set({ pickedDate: date }),
  journeyDate: null,
  setJourneyDate: (date: string | null) => set({ journeyDate: date }),
  formattedJourneyDate: null,
  setFormattedJourneyDate: (date: string | null) =>
    set({ formattedJourneyDate: date }),
  originStation: null,
  destinationStation: null,
  setOriginStation: (station: string | null) => set({ originStation: station }),
  setDestinationStation: (station: string | null) =>
    set({ destinationStation: station }),
  selectedDate: null,
  seatClass: "SHULOV",
  originStationList: [],
  isReadyToFetchUserTrainList: false,
  setIsReadyToFetchUserTrainList: (status: boolean) =>
    set({ isReadyToFetchUserTrainList: status }),
  setOriginStationList: (originStationList: any) =>
    set({ originStationList: originStationList }),
  destinationStationList: [],
  setDestinationStationList: (destinationStationList: any) =>
    set({ destinationStationList: destinationStationList }),
  formattedTrainList: [],
  setFormattedTrainList: (formattedTrainList: any) =>
    set({ formattedTrainList: formattedTrainList }),
  monthList: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  journeyDateGenerator: (date: DateValue | null) => {
    if (!date) return;
    const tempDate = `${date.year}-${date.month}-${date.day}`;
    const { monthList } = get();
    const tempFormatedDate = `${date.day}-${monthList[date.month - 1]}-${
      date.year
    }`;
    set({ formattedJourneyDate: tempFormatedDate, journeyDate: tempDate });
  },
  
}));
