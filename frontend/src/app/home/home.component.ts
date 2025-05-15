import { Component } from '@angular/core';
import { InputFormComponent } from '../components/input-form/input-form.component';
import { RequestListComponent } from '../components/request-list/request-list.component';

@Component({
  selector: 'app-home',
  imports: [InputFormComponent, RequestListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
