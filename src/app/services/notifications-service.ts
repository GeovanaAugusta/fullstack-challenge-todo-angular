import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private apiUrl = environment.urlBaseNotifications;

    constructor(private http: HttpClient) { }

    notificationSMS(phoneNumber: string, message: string): Observable<any> {
        const params = new HttpParams()
            .set('phoneNumber', phoneNumber)
            .set('message', message);

        return this.http.post<any>(`${this.apiUrl}/sms`, null, { params });
    }

    notificationEmail(subject: string, message: string): Observable<any> {
        const params = new HttpParams()
            .set('subject', subject)
            .set('message', message);

        return this.http.post<any>(`${this.apiUrl}/email`, null, { params });
    }
}
