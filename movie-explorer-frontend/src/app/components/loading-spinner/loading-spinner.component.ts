import { Component } from '@angular/core';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: false,
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css'],
})
export class LoadingSpinnerComponent {
  constructor(public loadingService: LoadingService) {}
}