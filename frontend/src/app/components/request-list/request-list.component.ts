import { Component, Input, OnInit, OnDestroy, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RequestData, RequestService } from '../../services/request.service';
import { DatePipe, CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { takeUntil, Subject } from 'rxjs';

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
export class RequestListComponent implements OnInit, OnDestroy {
  @Input() requests: RequestData[] = [];
  loading = false;
  error: string | null = null;
  expandedRequestId: number | null = null;
  private http = inject(HttpClient);
  private destroy$ = new Subject<void>();

  constructor(private requestService: RequestService) { }

  ngOnInit(): void {
    this.fetchRequests();
    this.requestService.requestCreated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchRequests();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchRequests(): void {
    this.loading = true;
    this.requestService.getRequests().subscribe({
      next: (data: RequestData[]) => {
        this.requests = data;
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