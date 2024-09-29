import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private apiUrl = '/api/tasks';

    constructor(private http: HttpClient) { }

    searchTask(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/buscar-por-id?id=${id}`);
    }

    allTasks(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}`);
    }

    addTask(task: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, task);
    }

    updateTask(task: any, id: number): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, task);
    }

    deleteTask(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}