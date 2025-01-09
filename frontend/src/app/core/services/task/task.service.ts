import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskRequest } from './models/task-request';
import { TaskResponse } from './models/task-response';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getTasksByProject(projectId: string): Observable<TaskResponse[]> {
    return this.http.get<TaskResponse[]>(`${this.apiUrl}/${projectId}/tasks`);
  }

  getTaskById(projectId: string, taskId: string): Observable<TaskResponse> {
    return this.http.get<TaskResponse>(
      `${this.apiUrl}/${projectId}/tasks/${taskId}`
    );
  }

  createTask(projectId: string, task: TaskRequest): Observable<TaskResponse> {
    return this.http.post<TaskResponse>(
      `${this.apiUrl}/${projectId}/tasks`,
      task
    );
  }

  updateTask(
    projectId: string,
    taskId: string,
    task: TaskRequest
  ): Observable<TaskResponse> {
    return this.http.put<TaskResponse>(
      `${this.apiUrl}/${projectId}/tasks/${taskId}`,
      task
    );
  }

  deleteTask(projectId: string, taskId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${projectId}/tasks/${taskId}`
    );
  }
}
