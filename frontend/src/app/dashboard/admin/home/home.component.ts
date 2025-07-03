import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { SidebarComponent } from '../../../shared/components/sidebar.component';
import { TopbarComponent } from '../../../shared/components/topbar.component';
import { StatCardComponent } from '../../../shared/components/stat-card.component';
import { AdminService } from '../../../core/services/admin.service';
import { RecentBookingsComponent } from '../../../shared/components/recent-bookings.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SidebarComponent,
    TopbarComponent,
    StatCardComponent,
    RecentBookingsComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  stats: { label: string; value: string | number; color?: string }[] = [];
  bookings: any[] = [];
  topVehicles: any[] = [];
  loading = false;
  error: string | null = null;
  Math = Math;
  showDashboardContent = true;

  constructor(
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadData();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const url = event.urlAfterRedirects;
      this.showDashboardContent =
        url === '/dashboard/admin' || url === '/dashboard/admin/home';
    });
  }

  loadData(): void {
    this.loading = true;
    this.error = null;

    this.adminService.getDashboardStats().subscribe({
      next: (res) => {
        this.stats = [
          { label: 'Total Revenue', value: `${res.totalRevenue}`, color: 'text-green-600' },
          { label: 'Total Bookings', value: res.totalBookings, color: 'text-blue-600' },
          { label: 'Active Vehicles', value: res.activeVehicles, color: 'text-purple-600' },
          { label: 'Total Users', value: res.totalUsers, color: 'text-orange-600' },
        ];
        this.topVehicles = res.topVehicles || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load dashboard data';
        this.loading = false;
      }
    });

    this.adminService.getRecentBookings().subscribe((res) => {
      this.bookings = res;
    });
  }

  trackVehicle(index: number, vehicle: any): string {
    return vehicle.id;
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

  getActiveVehiclesCount(): number {
    const activeVehiclesStat = this.stats.find(s => s.label === 'Active Vehicles');
    return activeVehiclesStat ? Number(activeVehiclesStat.value) : 0;
  }

  navigateToAddVehicle(): void {
    this.router.navigate(['/dashboard/admin/add-vehicle']);
  }
}
