import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

export interface Student {
  id: number;
  name: string;
  email: string;
  grade: string;
  course: string;
  enrollmentDate: Date;
  department: string;
  status: 'Active' | 'Inactive' | 'Graduated';
}


@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = 'Data/students.json';

  private _students = signal<Student[]>([]);

  dialogVisible = signal(false);
  selectedStudentId = signal<number | null>(null);

  readonly students = this._students.asReadonly();

  readonly totalStudents = computed(() => this._students().length);

  readonly selectedStudent = computed(() =>
    this._students().find(s => s.id === this.selectedStudentId()) ?? null
  );

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.http.get<Student[]>(this.apiUrl).subscribe({
      next: (data) => this._students.set(data),
      error: (err) => {
        console.error('Failed loading students', err);
        this._students.set([]);
      }
    });
  }

  addStudent(student: Student): Student {
    const nextId = this._students().length > 0
      ? Math.max(...this._students().map(s => s.id)) + 1 : 1;
    const newStudent = { ...student, id: nextId };
    this._students.update(list => [...list, newStudent]);
    return newStudent;
  }

  updateStudent(updated: Student) {
    this._students.update(list =>
      list.map(s => (s.id === updated.id ? { ...updated } : s))
    );
  }


  //delete single student
  deleteStudent(id: number) {
    this._students.update(list => list.filter(s => s.id !== id));
  }


  //delete multiple students

  deleteStudents(ids: number[]) {
    this._students.update(list => list.filter(s => !ids.includes(s.id)));
  }

  getStudentById(id: number) {
    return this._students().find(s => s.id === id) ?? null;
  }


  openDialog(id: number) {
    debugger;
    this.selectedStudentId.set(id);
    this.dialogVisible.set(true);
  }

  closeDialog() {
    this.dialogVisible.set(false);
    this.selectedStudentId.set(null);
  }


}
