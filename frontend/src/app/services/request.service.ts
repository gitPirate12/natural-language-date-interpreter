import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

// Interface for GET responses (used by getRequests, getRequest)
export interface RequestData {
    id: number;
    originalRequest: string;
    structuredResponse: {
        date: string;
        request: string;
        [key: string]: any;
    };
    createdAt: string;
}

// Interface for POST response (used by createRequest)
export interface ResponseData {
    date: string;
    request: string;
    [key: string]: any;
}

@Injectable({
    providedIn: 'root'
})
export class RequestService {
    private apiUrl = `${environment.apiUrl}/requests`;
    private requestCreatedSource = new Subject<void>();
    requestCreated$ = this.requestCreatedSource.asObservable();

    constructor(private http: HttpClient) { }

    getRequests(): Observable<RequestData[]> {
        return this.http.get<{ data: RequestData[] }>(this.apiUrl).pipe(
            map(response => response.data),
            catchError(this.handleError)
        );
    }

    createRequest(request: string): Observable<ResponseData> {
        return this.http.post<ResponseData>(this.apiUrl, { request }).pipe(
            catchError(this.handleError)
        );
    }

    getRequest(id: number): Observable<RequestData> {
        return this.http.get<RequestData>(`${this.apiUrl}/${id}`).pipe(
            catchError(this.handleError)
        );
    }

    notifyRequestCreated(): void {
        this.requestCreatedSource.next();
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        let errorMessage = 'An unknown error occurred';
        if (error.error instanceof ErrorEvent) {
            errorMessage = `Request error: ${error.error.message}`;
        } else {
            errorMessage = `Server returned ${error.status}: ${error.statusText}`;
            if (error.error?.message) {
                errorMessage += ` - ${error.error.message}`;
            }
        }
        console.error('API Error:', errorMessage);
        return throwError(() => new Error(errorMessage));
    }
}