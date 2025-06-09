import { create } from 'zustand';
import { trainList as initialTrainList } from '../constants/TrainList';

type TrainListStore = {
  trainList: string[];
};

export const useTrainListStore = create<TrainListStore>(() => ({
  trainList: initialTrainList,
}));