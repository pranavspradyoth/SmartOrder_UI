import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private http: HttpClient) { }

  login(username: string, password: string) {
    return this.http.post(`${environment.apiUrl}/api/login`, { username, password });
  }
  logout() {
    localStorage.removeItem('token');
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
