import { Routes } from '@angular/router';
import { StudentList } from './components/student-list/student-list';
import { TeachersList } from './components/teachers-list/teachers-list';
import { WorkersList } from './components/workers-list/workers-list';
import { Dashboard } from './components/dashboard/dashboard';
import { Signin } from './components/auth/signin/signin';
import { Signup } from './components/auth/signup/signup';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {path: '', redirectTo: 'signin', pathMatch: 'full'},
    {path: 'signin', component: Signin, data: { showSidebar: false }},
    {path: 'signup', component: Signup, data: { showSidebar: false }},
    {path: 'dashboard', component: Dashboard, canActivate: [authGuard], data: { showSidebar: true }},
    {path: 'student-list', component: StudentList, canActivate: [authGuard]},
    {path: 'teachers-list', component: TeachersList, canActivate: [authGuard]},
    {path: 'workers-list', component: WorkersList, canActivate: [authGuard]}
];
