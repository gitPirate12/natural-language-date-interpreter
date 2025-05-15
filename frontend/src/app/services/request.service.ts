import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface RequestData {
  id: number;
  originalRequest: string;
  structuredResponse: string; 
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {

   private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }

    // Get all requests
    getRequests(): Observable<RequestData[]> {
        return this.http.get<RequestData[]>(this.apiUrl).pipe(
            catchError(this.handleError)
        );
    }

    // Get a single request by ID
    getRequest(id: number): Observable<RequestData> {
        const url = `${this.apiUrl}/${id}`;
        return this.http.get<RequestData>(url).pipe(
            catchError(this.handleError)
        );
    }

    // Create a new request
    createRequest(request: string): Observable<any> {
        return this.http.post(this.apiUrl, { request }).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: HttpErrorResponse): Observable<any> {
        let errorMessage = 'An error occurred';
        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Server-side error
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(() => new Error(errorMessage));
    }

}
