export interface SeatType {
  type: string;
  fare: string;
  vat_amount: number;
  seat_counts: {
    online: number;
    offline: number;
  };
}