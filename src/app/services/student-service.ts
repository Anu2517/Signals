import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  course: string;
  year: number;
  rollNumber: string;
  enrollmentDate: Date;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  // private apiUrl = 'http://localhost:4001/students';
  private GetAllStudentsUrl = 'http://192.168.5.13:5078/api/students'

  private _students = signal<Student[]>([]);

  dialogVisible = signal(false);
  addDialogVisible = signal(false);
  selectedStudentId = signal<number | null>(null);

  readonly students = this._students.asReadonly();

  readonly totalStudents = computed(() => this._students().length);

  readonly selectedStudent = computed(() =>
    this._students().find(s => s.id === this.selectedStudentId()) ?? null
  );

  constructor() {
    this.loadInitialData();
  }

  // private getAuthHeaders(): HttpHeaders | null {
  //   const token = localStorage.getItem('token');

  //   if (!token) {
  //     console.error('No token found');
  //     return null;
  //   }

  //   return new HttpHeaders({
  //     Authorization: `Bearer ${token}`,
  //     'Content-Type': 'application/json'
  //   });
  // }

  // Get all the students
  loadInitialData(): void {
    // const headers = this.getAuthHeaders();
    // if (!headers) return;

    this.http.get<Student[]>(this.GetAllStudentsUrl).subscribe({
      next: students => {
        this._students.set(students);
      },
      error: err => {
        console.error('Failed loading students', err);
      }
    });
  }

  //Get student by ID

  getStudentByIdApi(id: number): void {
    // const headers = this.getAuthHeaders();
    // if (!headers) return;

    this.http.get<Student>(`${this.GetAllStudentsUrl}/${id}`).subscribe({
      next: student => {
        this._students.set([student]);
        this.selectedStudentId.set(student.id);
      },
      error: err => {
        console.error(`Failed loading student with id ${id}`, err);
        this._students.set([]);
      }
    });
  }

  // Adds a new Student

  addStudent(student: Student): void {
    // const headers = this.getAuthHeaders();
    // if (!headers) return;

    const { id, ...newStudent } = student;

    const apiPayload: any = {
      ...newStudent,
      RollNumber: newStudent.rollNumber,
      enrollmentDate: new Date(newStudent.enrollmentDate).toISOString()
    };

    this.http.post<Student>(this.GetAllStudentsUrl, apiPayload)
      .subscribe({
        next: createdStudent => {
          this._students.update(list => [...list, createdStudent]);
          this.closeAddDialog();
        },
        error: err => {
          const message =
            err?.error?.message ??
            'Failed to add student';

          alert(message);
          console.error('Add student failed:', err);
        }
      });
  }

  // UPDATE student
  updateStudentApi(student: Student): void {
    // const headers = this.getAuthHeaders();
    // if (!headers) return;

    const apiPayload: any = {
      ...student,
      RollNumber: student.rollNumber,
      enrollmentDate: new Date(student.enrollmentDate).toISOString()
    };

    this.http.put<Student>(
      `${this.GetAllStudentsUrl}/${student.id}`,
      apiPayload
    ).subscribe({
      next: updatedStudent => {
        this._students.update(list =>
          list.map(s => s.id === updatedStudent.id ? updatedStudent : s)
        );
        this.closeDialog();
      },
      error: err => {
        alert(err?.error?.message ?? 'Failed to update student');
        console.error('Update student failed:', err);
      }
    });
  }

  //delete single student

  deleteStudentApi(id: number): void {
  // const headers = this.getAuthHeaders();
  // if (!headers) return;

  this.http
    .delete(`${this.GetAllStudentsUrl}/${id}`)
    .subscribe({
      next: () => {
        this._students.update(list =>
          list.filter(s => s.id !== id)
        );
      },
      error: err => {
        alert(err?.error?.message ?? 'Failed to delete student');
        console.error('Delete student failed:', err);
      }
    });
}

  //delete multiple students

  deleteStudentsApi(ids: number[]): void {
    ids.forEach(id => this.deleteStudentApi(id));
  }

  openDialog(id: number) {
    this.selectedStudentId.set(id);
    this.dialogVisible.set(true);
  }

  closeDialog() {
    this.dialogVisible.set(false);
    this.selectedStudentId.set(null);
  }

  openAddDialog() {
    this.addDialogVisible.set(true);
  }

  closeAddDialog() {
    this.addDialogVisible.set(false);
  }

}
