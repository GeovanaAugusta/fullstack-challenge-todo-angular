import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private apiUrl = environment.urlBase;

    constructor(private http: HttpClient) { }

    addUser(user: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/users/`, user);
    }
}