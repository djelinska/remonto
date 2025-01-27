import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskDto } from '../../../shared/models/task.dto';
import { TaskFormDto } from './models/task-form.dto';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  getTasksByProject(projectId: string): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(`${this.apiUrl}/${projectId}/tasks`);
  }

  getTaskById(projectId: string, taskId: string): Observable<TaskDto> {
    return this.http.get<TaskDto>(
      `${this.apiUrl}/${projectId}/tasks/${taskId}`
    );
  }

  createTask(projectId: string, task: TaskFormDto): Observable<TaskDto> {
    return this.http.post<TaskDto>(`${this.apiUrl}/${projectId}/tasks`, task);
  }

  updateTask(
    projectId: string,
    taskId: string,
    task: TaskFormDto
  ): Observable<TaskDto> {
    return this.http.put<TaskDto>(
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
