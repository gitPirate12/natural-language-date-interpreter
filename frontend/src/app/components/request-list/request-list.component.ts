
import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RequestData } from '../../services/request.service';
import { DatePipe, CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment'; 

interface ApiResponse { 
  data: RequestData[];
  message: string;
}

@Component({
  selector: 'app-request-list',
  imports: [DatePipe, CommonModule, HttpClientModule],
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.scss'
})
export class RequestListComponent  implements OnInit {
  requests: RequestData[] = [];
  loading = false;
  error: string | null = null;
  expandedRequestId: number | null = null; // To track expanded request

  constructor(private http: HttpClient) {} // Inject HttpClient

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.loading = true;
    this.http.get<ApiResponse>(environment.apiUrl).subscribe( 
      (response) => {
        this.requests = response.data;
        this.loading = false;
      },
      (error) => {
        this.error = error.message || 'Failed to fetch requests';
        this.loading = false;
      }
    );
  }

  toggleRequest(requestId: number): void {
    this.expandedRequestId = this.expandedRequestId === requestId ? null : requestId;
  }
}
