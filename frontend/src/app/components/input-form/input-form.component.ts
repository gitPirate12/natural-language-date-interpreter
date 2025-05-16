import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgForm, FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RequestService, ResponseData } from '../../services/request.service';

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.scss']
})
export class InputFormComponent implements OnDestroy {
  @Output() formSubmit = new EventEmitter<{ request: string; response: ResponseData }>();

  request: string = '';
  response: ResponseData | null = null;
  loading = false;
  errorMessage: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(private requestService: RequestService) { }

  onSubmit(form: NgForm) {
    if (form.invalid || this.loading) {
      return;
    }

    const requestText = this.request.trim();
    if (!requestText) {
      this.errorMessage = 'Please enter a valid date request';
      return;
    }

    this.loading = true;
    this.errorMessage = null;
    this.response = null;

    this.requestService.createRequest(requestText)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newRequest: ResponseData) => {
          console.log('Backend response:', newRequest);
          console.log('Set response:', newRequest);
          this.response = newRequest;
          this.formSubmit.emit({ request: requestText, response: newRequest });

          this.requestService.notifyRequestCreated();
          this.request = '';
          form.resetForm();
        },
        error: (error) => {
          console.error('Request error:', error);
          this.handleError(error.message || 'Failed to process request');
        },
        complete: () => {
          this.loading = false;
        }
      });
  }

  private handleError(message: string): void {
    this.errorMessage = message;
    this.loading = false;
    console.error('InputForm Error:', message);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}