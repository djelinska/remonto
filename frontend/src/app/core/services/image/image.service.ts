import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<string | null> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http
      .post<{ filename: string }>(`${this.apiUrl}/images/upload`, formData)
      .pipe(map((response) => response.filename || null));
  }

  getImage(imageUrl: string): Observable<string> {
    return this.http
      .get(imageUrl, { responseType: 'blob' })
      .pipe(map((blob) => URL.createObjectURL(blob)));
  }

  deleteImage(imageUrl: string): Observable<{ message: string }> {
    const filename = imageUrl.split('/').pop() || '';
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/images/${filename}`
    );
  }
}
