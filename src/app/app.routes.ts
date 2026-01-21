import { Routes } from '@angular/router';
import { StudentList } from './components/student-list/student-list';
import { TeachersList } from './components/teachers-list/teachers-list';
import { WorkersList } from './components/workers-list/workers-list';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
    {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    {path: 'dashboard', component: Dashboard},
    {path: 'student-list', component: StudentList},
    {path: 'teachers-list', component: TeachersList},
    {path: 'workers-list', component: WorkersList}
];
