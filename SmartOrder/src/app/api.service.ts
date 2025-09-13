import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { environment } from './environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getOrders(): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/orders`);
}
 
updateOrderStatus(orderId: string, status: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/orders/${orderId}`, { status });
}
getItems() {
  return this.http.get<any[]>(`${this.apiUrl}/items`);
}
 
addItem(item: any) {
  return this.http.post(`${this.apiUrl}/items`, item);
}
 
updateItem(id: string, item: any) {
  return this.http.put(`${this.apiUrl}/items`, item);
}
 
deleteItem(id: string) {
  return this.http.delete(`${this.apiUrl}/items/${id}`);
}

}
