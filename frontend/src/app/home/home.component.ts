import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestService, RequestData } from '../services/request.service';
import { takeUntil, Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputFormComponent } from '../components/input-form/input-form.component';
import { RequestListComponent } from '../components/request-list/request-list.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    InputFormComponent,
    RequestListComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  requests: RequestData[] = [];
  loading = false;
  error: string | null = null;
  response: any = null;
  requestText: string = '';
  
  private destroy$ = new Subject<void>();

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.fetchRequests();
    
    // Subscribe to new request notifications
    this.requestService.requestCreated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchRequests();
      });
  }

  fetchRequests(): void {
    this.loading = true;
    this.error = null;
    
    this.requestService.getRequests()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (requests) => {
          this.requests = requests;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'Failed to load requests';
          this.loading = false;
          console.error('Error fetching requests:', err);
        }
      });
  }

  onSubmit(data: { request: string; response: any }): void {
    this.loading = true;
    this.error = null;
    
    try {
      this.requestText = data.request;
      this.response = data.response;
      
      // The request creation is already handled by InputFormComponent
      // The history will update automatically via the requestCreated$ observable
    } catch (err) {
      this.error = 'Failed to process response';
      console.error('Response processing error:', err);
    } finally {
      this.loading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}