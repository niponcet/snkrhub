import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.page').then(m => m.HomePage),
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
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'registro',
    loadComponent: () => import('./features/auth/registro/registro.page').then(m => m.RegistroPage),
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
];
