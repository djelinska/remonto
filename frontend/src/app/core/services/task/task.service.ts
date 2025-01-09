import { MOCK_PROJECTS, MOCK_TASKS } from '../../../mock-data';
import { Observable, of } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from 'zone.js/lib/zone-impl';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';

  constructor(private http: HttpClient) {}

  getTasksByProject(projectId: number): Observable<any[]> {
    // return this.http.get<Task[]>(`${this.apiUrl}?projectId=${projectId}`, {
    //   withCredentials: true,
    // });
    const tasksForProject = MOCK_TASKS.filter(
      (task) => task.projectId === projectId
    );
    return of(tasksForProject);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task, { withCredentials: true });
  }

  updateTask(id: number, task: Task): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task, {
      withCredentials: true,
    });
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true,
    });
  }
}
