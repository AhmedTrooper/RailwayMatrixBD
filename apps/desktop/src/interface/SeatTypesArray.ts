import { SeatType } from "./store/SeatTypeInterface";

export interface SeatTypeObject {
    fromCity: string;
    toCity: string;
    seatsArr:  SeatType[];
}