import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'book',
    loadComponent: () => import('./features/book/form/book').then(m => m.BookComponent)
  },
  { path: '', redirectTo: 'book', pathMatch: 'full' },
  { path: '**', redirectTo: 'book' }
];
