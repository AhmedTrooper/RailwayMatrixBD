export interface UserTrainRouteInformation {
city:string;
departure_time:string;
halt:null | string | '---';
duration:null | string | '---';
arrival_time:null | string;
}

export type UserTrainRouteInformationList = UserTrainRouteInformation[];