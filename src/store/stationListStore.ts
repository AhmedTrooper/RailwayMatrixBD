import { create } from 'zustand';
import { stationList as initialStationList } from '../constants/StationList';

type StationStore = {
  stationList: string[];
};

export const useStationStore = create<StationStore>(() => ({
  stationList: initialStationList
}));