import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadComponent: () => import('./features/auth/welcome/welcome.page').then(m => m.WelcomePage),
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./features/auth/sign-up/sign-up.page').then(m => m.SignUpPage),
  },
  {
    path: 'sign-in',
    loadComponent: () => import('./features/auth/sign-in/sign-in.page').then(m => m.SignInPage),
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./features/home/home.page').then(m => m.HomePage),
      },
      {
        path: 'news',
        loadComponent: () => import('./features/news/news.page').then(m => m.NewsPage),
      },
      {
        path: 'catalog',
        loadComponent: () => import('./features/catalog/catalog.page').then(m => m.CatalogPage),
      },
      {
        path: 'database',
        loadComponent: () => import('./features/database/database.page').then(m => m.DatabasePage),
      },
      {
        path: 'inventory',
        loadComponent: () => import('./features/inventory/inventory.page').then(m => m.InventoryPage),
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/profile/profile.page').then(m => m.ProfilePage),
      },
      {
        path: 'notifications',
        loadComponent: () => import('./features/notifications/notifications.page').then(m => m.NotificationsPage),
      },
      {
        path: 'sneaker-details/:id',
        loadComponent: () => import('./features/sneaker-details/sneaker-details.page').then(m => m.SneakerDetailsPage),
      },
    ]
  }
];
