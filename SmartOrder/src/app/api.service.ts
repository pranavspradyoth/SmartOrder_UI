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
  return this.http.get<any[]>(`${this.apiUrl}/api/orders`);

}
getCategories() {
    return this.http.get<any[]>(`${this.apiUrl}/api/categories`);
}
 
updateOrderStatus(orderId: string, status: string, user_id: string, order_id: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/api/orders/${orderId}`, { status, user_id, order_id });
}
getItems() {
  return this.http.get<any[]>(`${this.apiUrl}/api/items`);
}
 
addItem(item: any) {
  return this.http.post(`${this.apiUrl}/api/items`, item);
}
 
updateItem(id: string, item: any) {
  return this.http.put(`${this.apiUrl}/api/items`, item);
}
 
deleteItem(id: string) {
  return this.http.delete(`${this.apiUrl}/api/items/${id}`);
}

}
