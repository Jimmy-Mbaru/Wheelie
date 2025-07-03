import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recent-bookings',
  standalone: true,
  imports: [CommonModule], // This includes NgIf, NgFor, and DatePipe
  templateUrl: './recent-bookings.component.html',
  styleUrls: ['./recent-bookings.component.css']
})
export class RecentBookingsComponent {
  @Input() bookings: any[] = [];
}