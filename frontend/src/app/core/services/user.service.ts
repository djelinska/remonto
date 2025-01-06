import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`, {
      withCredentials: true,
    });
  }

  updateUserProfile(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, user, {
      withCredentials: true,
    });
  }
}
