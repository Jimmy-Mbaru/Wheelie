import { ProfileComponent } from './shared/components/profile.component/profile.component';
import { Routes } from '@angular/router';
import { AdminHomeComponent } from './dashboard/admin/home/home.component';
import { AuthGuard } from './core/auth.guard';
import { VehicleListComponent } from './dashboard/admin/vehicle-list/vehicle-list.component';
import { AdminGuard } from './core/admin.guard';
import { UserDashboardComponent } from './dashboard/user/home/user-dashboard.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes)
  },

  // 🚗 User dashboard with nested routes
  {
    path: 'dashboard/user',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: UserDashboardComponent
      },
      {
        path: 'car/:id',
        loadComponent: () =>
          import('./dashboard/user/car-details/car-details.component').then(m => m.CarDetailsComponent)
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./dashboard/user/bookings/bookings.component').then(m => m.BookingsComponent)
      },
       {
        path: 'user-profile',
        loadComponent: () =>
          import('./shared/components/profile.component/profile.component').then(m => m.ProfileComponent)
      }

    ]
  },

  // 🛠 Admin dashboard with child routes
  {
    path: 'dashboard/admin',
    component: AdminHomeComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: 'vehicles',
        component: VehicleListComponent
      },
      {
        path: 'add-vehicle',
        loadComponent: () =>
          import('./dashboard/admin/add-vehicle.component').then(m => m.AddVehicleComponent)
      },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      }
    ]
  },

  // Admin shortcut route
  {
    path: 'admin/home',
    component: AdminHomeComponent,
    canActivate: [AuthGuard, AdminGuard]
  },

  // Default & fallback
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login', pathMatch: 'full' }
];
