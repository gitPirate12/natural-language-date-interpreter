import { Component, Output, EventEmitter, OnDestroy } from '@angular/core';
import { RequestService } from '../../services/request.service'; 
import { NgForm, FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.scss'
})
export class InputFormComponent  implements OnDestroy{
 loading = false;
    errorMessage: string = '';
    private destroy$ = new Subject<void>();

  constructor(private requestService: RequestService) { }

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
        const requestText = form.value.request;

        this.requestService.createRequest(requestText)
            .pipe(takeUntil(this.destroy$)) 
            .subscribe({
                next: (response) => {
                    console.log('Request created:', response);
                    this.loading = false;
                    this.requestService.notifyRequestCreated(); 
                    form.resetForm();
                },
                error: (error) => {
                    this.errorMessage = error;
                    this.loading = false;
                    console.error('Error creating request:', error);
                }
            });
    }
}
