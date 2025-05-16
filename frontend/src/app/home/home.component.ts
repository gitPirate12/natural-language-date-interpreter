import { Component, OnInit, OnDestroy } from '@angular/core';
import { RequestService, RequestData  } from '../services/request.service';
import { takeUntil, Subject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { InputFormComponent } from '../components/input-form/input-form.component';
import { RequestListComponent } from '../components/request-list/request-list.component';

@Component({
  selector: 'app-home',
  imports: [FormsModule, InputFormComponent, RequestListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy{
requests: RequestData[] = [];
    loading = true;
    error: string = '';
    private destroy$ = new Subject<void>();

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
}
