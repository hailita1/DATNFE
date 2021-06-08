export interface Voucher {
  id?: number;
  voucher_code?: string;
  typeVoucher?: number;
  title?: string;
  discount?: number;
  status?: boolean;
  create_at?: Date;
  startDate?: Date;
  update_at?: Date;
  expiredDate?: Date;
  checked?: boolean;
}
