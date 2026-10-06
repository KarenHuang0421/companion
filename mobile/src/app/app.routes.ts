import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'chat',
    loadComponent: () => import('./pages/chat/chat.component').then((m) => m.ChatComponent),
  },
  {
    path: 'checkin',
    loadComponent: () => import('./pages/checkin/checkin.component').then((m) => m.CheckinComponent),
  },
  {
    path: 'error',
    loadComponent: () => import('./pages/error/error.component').then((m) => m.ErrorComponent),
  },
  { path: '**', redirectTo: '' },
];
