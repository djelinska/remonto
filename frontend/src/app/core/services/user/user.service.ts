import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserDto } from '../../../shared/models/user.dto';
import { UserFormDto } from './models/user-form.dto';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${this.apiUrl}/admin/users`);
  }

  createUser(user: UserFormDto): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.apiUrl}/admin/users`, user);
  }

  updateUser(id: string, user: UserFormDto): Observable<UserDto> {
    return this.http.patch<UserDto>(`${this.apiUrl}/admin/users/${id}`, user);
  }

  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/admin/users/${id}`);
  }
}
