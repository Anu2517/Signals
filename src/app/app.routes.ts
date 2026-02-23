import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'signin', pathMatch: 'full' },
    {
        path: 'signin',
        loadComponent: () =>
            import('./components/auth/signin/signin')
                .then(m => m.Signin),
        data: { showSidebar: false }
    },
    {
        path: 'signup',
        loadComponent: () =>
            import('./components/auth/signup/signup')
                .then(m => m.Signup),
        data: { showSidebar: false }
    },
    {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard')
        .then(m => m.Dashboard),
    canActivate: [authGuard],
    data: { showSidebar: true }
  },

  {
    path: 'student-list',
    loadComponent: () =>
      import('./components/student-list/student-list')
        .then(m => m.StudentList),
    canActivate: [authGuard]
  },

  {
    path: 'teachers-list',
    loadComponent: () =>
      import('./components/teachers-list/teachers-list')
        .then(m => m.TeachersList),
    canActivate: [authGuard]
  },

  {
    path: 'workers-list',
    loadComponent: () =>
      import('./components/workers-list/workers-list')
        .then(m => m.WorkersList),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'signin' }
];
