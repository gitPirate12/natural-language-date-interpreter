import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestService, RequestData } from '../services/request.service';
import { takeUntil, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputFormComponent } from '../components/input-form/input-form.component';
import { RequestListComponent } from '../components/request-list/request-list.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, InputFormComponent, RequestListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {
  requests: RequestData[] = [];
  loading = true;
  error: string = '';
  private destroy$ = new Subject<void>();
  response: any;
  requestText: string = '';

  constructor(private requestService: RequestService) { }

  ngOnInit() {
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

  fetchRequests() {
    this.loading = true;
    this.error = '';
    this.requestService.getRequests().subscribe({
      next: (requests) => {
        this.requests = requests;
        this.loading = false;
      },
      error: (error) => {
        this.error = error;
        this.loading = false;
        console.error('Error fetching requests:', error);
      }
    });
  }

  onSubmit(data: { request: string, response: any }) {
    this.loading = true;
    this.error = '';
    this.response = null;
    this.requestText = data.request;
    this.response = data.response;

    this.requestService.createRequest(data.request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Request created:', response);
          this.response = response.data;
          this.fetchRequests();
          this.loading = false;
        },
        error: (error) => {
          this.error = error;
          this.loading = false;
          console.error('Error creating request:', error);
        }
      });
  }

  onRequestsChanged(updatedRequests: RequestData[]) {
    this.requests = updatedRequests;
  }
}

