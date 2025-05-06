import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from './models/login-request.model';
import { LoginResponse } from './models/login-response';
import { RegisterRequest } from './models/register-request';
import { RegisterResponse } from './models/register-response';
import { UserDto } from '../../../shared/models/user.dto';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private readonly sessionKey = 'session';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map((response: LoginResponse) => {
          if (response.token) {
            localStorage.setItem(
              this.sessionKey,
              JSON.stringify({
                token: response.token,
                user: response.user,
              })
            );
          }
          return response;
        })
      );
  }

  register(details: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, details);
  }

  logout(): void {
    localStorage.removeItem(this.sessionKey);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.sessionKey);
  }

  getToken(): string | null {
    return (
      JSON.parse(localStorage.getItem(this.sessionKey) || '{}').token || null
    );
  }

  getLoggedInUser(): UserDto | null {
    return (
      JSON.parse(localStorage.getItem(this.sessionKey) || '{}').user || null
    );
  }
}
