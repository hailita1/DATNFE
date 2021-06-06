import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Image} from '../../model/image';

const API_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})


export class UsageBillService {

  constructor(private http: HttpClient) {
  }

  getAllUsageBill(): Observable<object[]> {
    return this.http.get<object[]>(API_URL + '/usageBill');
  }

  createUsageBill(object: object): Observable<Image> {
    return this.http.post<object>(API_URL + '/usageBill', object);
  }

  deleteUsageBill(id: number): Observable<object> {
    return this.http.delete<object>(API_URL + `/usageBill/${id}`);
  }

  getUsageBill(id: number): Observable<object> {
    return this.http.get<object>(API_URL + `/usageBill/${id}`);
  }
}
