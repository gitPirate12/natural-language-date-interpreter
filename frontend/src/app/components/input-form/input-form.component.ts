import { Component, Output, EventEmitter, OnDestroy, Injectable } from '@angular/core'; 
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgForm, FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

interface ApiResponse {
  date: string;
  request: string;
}

@Injectable({ 
  providedIn: 'root',
})
export class RequestService {
  
  requestCreated$ = new Subject<void>();

  notifyRequestCreated() {
    this.requestCreated$.next();
  }

  createRequest(requestText: string) {
    const apiUrl = 'http://localhost:3000/api/requests';
    return this.http.post<ApiResponse>(apiUrl, { request: requestText });
  }

  constructor(private http: HttpClient) {}
}

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss']
})
export class InputFormComponent implements OnDestroy {
  loading = false;
  errorMessage: string = '';
  private destroy$ = new Subject<void>();
  @Output() formSubmit = new EventEmitter<{ request: string; response: ApiResponse }>();
  response: ApiResponse | null = null;
  private apiUrl = 'http://localhost:3000/api/requests';

  constructor(private http: HttpClient, private requestService: RequestService) { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.response = null;
    const requestText = form.value.request;

    this.requestService.createRequest(requestText)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Request created:', response);
          this.response = response;
          this.formSubmit.emit({ request: requestText, response: response });
          this.loading = false;
          this.requestService.notifyRequestCreated();
          form.resetForm();
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.loading = false;
          console.error('Error creating request:', error);
        }
      });
  }
}

