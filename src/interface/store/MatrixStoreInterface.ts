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
}
