import { Component, Input } from '@angular/core';
import { RequestData } from '../../services/request.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-request-list',
  imports: [DatePipe],
  templateUrl: './request-list.component.html',
  styleUrl: './request-list.component.scss'
})
export class RequestListComponent {
  @Input() requests: RequestData[] = [];
}
