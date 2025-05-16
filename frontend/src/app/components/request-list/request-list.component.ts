import { Component, Input, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RequestData } from '../../services/request.service';
import { DatePipe, CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

interface ApiResponse {
  data: RequestData[];
  message: string;
}

@Component({
  selector: 'app-request-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent implements OnInit {
  @Input() requests: RequestData[] = [];
  @Output() requestsChanged = new EventEmitter<RequestData[]>();
  loading = false;
  error: string | null = null;
  expandedRequestId: number | null = null;
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.loading = true;
    this.http.get<ApiResponse>(environment.apiUrl).subscribe({
      next: (response) => {
        this.requests = response.data;
        this.requestsChanged.emit(this.requests); 
        this.loading = false;
      },
      error: (error) => {
        this.error = error.message || 'Failed to fetch requests';
        this.loading = false;
      },
    });
  }

  toggleRequest(requestId: number): void {
    this.expandedRequestId = this.expandedRequestId === requestId ? null : requestId;
  }
}
