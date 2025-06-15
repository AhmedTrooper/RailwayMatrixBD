import { SeatTypeObject } from "../SeatTypesArray";
import { SeatType } from "./SeatTypeInterface";

export interface MatrixStore {
  ticketFound: boolean;
  setTicketFound: (status: boolean) => void;
  createMatrix: () => void;
  isLoadingTicketFetching: boolean;
  setIsLoadingTicketFetching: (status: boolean) => void;
  trainData:SeatType[][] | [];
  setTrainData:(list:SeatType[][] | [])=>void;
  hasSearchedForTicket:boolean;
  setHasSearchedForTicket:(status:boolean)=>void;
 numberOfTicketFound:number;
  setNumberOfTicketFound:(ticket:number)=>void;
  dummyMatrixVisible:boolean;
  setDummyMatrixVisible:(status:boolean)=>void;
  showTicketFoundBox:boolean;
  setShowTicketFoundBox:(status:boolean)=>void;
   showTicketNotFoundBox:boolean;
  setShowTicketNotFoundBox:(status:boolean)=>void;
  segmentedSeatArray: SeatTypeObject[];
  setSegmentedSeatArray:(segArray:SeatTypeObject[])=>void;
  findSegmentedRoute: (
    start: number,
    end: number,
    dataMatrix: any[][]
)=> number[];
showSegmentedRoute(fromCity: string, toCity: string, dataMatrix: any[][]):void;
segmentedOriginStation:string | null;
setSegmentedOriginStation:(s:string | null)=>void;
segmentedDestinationStation:string | null;
setSegmentedDestinationStation:(s:string | null)=>void;
segmentedRouteFinder: () =>void;
segmentedRouteFound:boolean;
setSegmentedRouteFound:(srf:boolean)=>void;
}
