import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface RequestData {
  id: number;
  originalRequest: string;
  structuredResponse: {
    date: string;
    request: string;
    [key: string]: any; // For additional response fields
  };
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl = `${environment.apiUrl}/requests`;
  private requestCreatedSource = new Subject<void>();
  requestCreated$ = this.requestCreatedSource.asObservable();

  constructor(private http: HttpClient) { }

  // Fetch all historical requests
   
  getRequests(): Observable<RequestData[]> {
    return this.http.get<{data: RequestData[]}>(this.apiUrl).pipe(
      map(response => response.data), // Extract data from response
      catchError(this.handleError)
    );
  }

  
   //Create a new interpretation request
   
  createRequest(request: string): Observable<RequestData> {
    return this.http.post<RequestData>(this.apiUrl, { 
      request 
    }).pipe(
      catchError(this.handleError)
    );
  }

  
 //Get single request by ID
   
  getRequest(id: number): Observable<RequestData> {
    return this.http.get<RequestData>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  
   //Notify subscribers that a new request was created
   
  notifyRequestCreated(): void {
    this.requestCreatedSource.next();
  }

 // Standard error handling for API requests
   
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Request error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server returned ${error.status}: ${error.statusText}`;
      
      // Try to get server's error message if available
      if (error.error?.message) {
        errorMessage += ` - ${error.error.message}`;
      }
    }
    
    console.error('API Error:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}