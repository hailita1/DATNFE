export interface Bill {
  id?: number;
  nameUser?: string;
  telephoneNumber?: string;
  email?: string;
  comment?: string;
  evaluate?: number;
  totalPrice?: number;
  bookingDate?: Date;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  voucher?: any;
  houseBill: any;
  checked: any;
  user?: any;
  service?: any[];
  bill?: any;
  idHost?: any;
}
