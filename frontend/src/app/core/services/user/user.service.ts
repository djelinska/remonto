import { Observable, Subject, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../../shared/models/user';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private userUpdated = new Subject<void>();

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/user/profile`);
  }

  updateUserProfile(user: User): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/user/profile`, user).pipe(
      tap(() => {
        this.userUpdated.next();
      })
    );
  }

  getUserUpdatedListener(): Observable<void> {
    return this.userUpdated.asObservable();
  }

  deleteUserProfile(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/user/profile`);
  }
}
