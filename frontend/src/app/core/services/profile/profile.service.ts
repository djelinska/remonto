import { Observable, Subject, tap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserDto } from '../../../shared/models/user.dto';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private apiUrl = `${environment.apiUrl}/user/profile`;
  private userUpdated = new Subject<void>();

  constructor(private http: HttpClient) {}

  getUserProfile(): Observable<UserDto> {
    return this.http.get<UserDto>(this.apiUrl);
  }

  updateUserProfile(user: UserDto): Observable<UserDto> {
    return this.http.patch<UserDto>(this.apiUrl, user).pipe(
      tap(() => {
        this.userUpdated.next();
      })
    );
  }

  getUserUpdatedListener(): Observable<void> {
    return this.userUpdated.asObservable();
  }

  deleteUserProfile(): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(this.apiUrl);
  }
}
