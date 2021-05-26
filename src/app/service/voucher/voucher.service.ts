import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Utilitie} from '../../model/utilitie';
import {environment} from '../../../environments/environment';
import {Voucher} from '../../model/voucher';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  constructor(private http: HttpClient) {
  }

  getAllVoucher(): Observable<Voucher[]> {
    return this.http.get<Voucher[]>(API_URL + '/vouchers');
  }

  getAll(): Observable<Voucher[]> {
    return this.http.get<Voucher[]>(API_URL + '/vouchers/getAll');
  }

  createVoucher(voucher: Voucher): Observable<Utilitie> {
    return this.http.post<Voucher>(API_URL + '/vouchers', voucher);
  }

  getVoucher(id: number): Observable<Voucher> {
    return this.http.get<Voucher>(API_URL + `/vouchers/${id}`);
  }

  updateVoucher(id: number, voucher: Voucher): Observable<Utilitie> {
    return this.http.put<Voucher>(API_URL + `/vouchers/${id}`, voucher);
  }

  deleteVoucher(id: number): Observable<Voucher> {
    return this.http.delete<Voucher>(API_URL + `/vouchers/${id}`);
  }

  deleteListVoucher(id: number[]): Observable<Voucher> {
    return this.http.post<Voucher>(API_URL + '/vouchers/deleteList', id);
  }

  addVoucherToUser(voucher: Voucher): Observable<Voucher> {
    return this.http.post<Voucher>(API_URL + '/vouchers/addVouchers', voucher);
  }
}
