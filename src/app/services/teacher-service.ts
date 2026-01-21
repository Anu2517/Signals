import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

export interface Teacher {
   id: number;
   name: string;
   age: number;
   email: string;
   subject: string;
   department: string;
   status: 'Active' | 'Inactive' | 'On-Leave';
}

@Injectable({
  providedIn: 'root',
})
export class TeacherService {

  private http = inject(HttpClient);
  private apiUrl = 'Data/teachers.json';

  private _teachers = signal<Teacher[]>([]);

  selectedTeacherId = signal<number | null>(null);

  readonly teachers = this._teachers.asReadonly();

  readonly totalTeachers = computed(() => this._teachers().length);

  readonly selectedTeacher = computed(() =>
    this._teachers().find(t => t.id === this.selectedTeacherId()) ?? null
  );

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.http.get<Teacher[]>(this.apiUrl).subscribe({
      next: (data) => this._teachers.set(data),
      error: (err) => {
        console.error('Failed loading teachers', err);
        this._teachers.set([]);
      }
    });
  }

  addTeacher(teacher: Teacher): Teacher {
    const nextId = this._teachers.length > 0
       ? Math.max(...this._teachers().map(t => t.id)) + 1: 1;
    const newTeacher = { ...teacher, id: nextId };
    this._teachers.update(list => [...list, newTeacher]);
    return newTeacher;
  }

  updateTeacher(updated: Teacher) {
    this._teachers.update(list =>
      list.map(t => (t.id === updated.id ? { ...updated } : t))
    );
  }

  deleteTeacher(id: number) {
    this._teachers.update(list => list.filter(t => t.id !== id));
  }

  deleteTeachers(ids: number[]) {
    this._teachers.update(list => list.filter(t => !ids.includes(t.id)));
  }

  getTeachersById(id : number) {
    return this.teachers().find(t => t.id === id) ?? null;
  }
  
}
