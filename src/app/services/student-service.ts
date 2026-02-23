import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';
import { forkJoin, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { ErrorhandlerService } from './errorhandler-service';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { CreateStudentDto } from '../models/student.dto';
import { MessageService } from 'primeng/api';

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
  phone?: string;
  guardianName?: string;
  address?: string;

  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private http = inject(HttpClient);
  private sanitizer = inject(DomSanitizer);
  private errorHandler = inject(ErrorhandlerService);
  private messageService = inject(MessageService);

  private GetAllStudentsUrl = `${environment.apiUrl}/students`;

  private _students = signal<Student[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  readonly students = this._students.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  dialogVisible = signal(false);
  addDialogVisible = signal(false);
  selectedStudentId = signal<number | null>(null);

  readonly totalStudents = computed(() => this._students().length);

  readonly selectedStudent = computed(() =>
    this._students().find(s => s.id === this.selectedStudentId()) ?? null
  );

  constructor() {
    this.loadInitialData();
  }

  sanitizeInput(value: string): string {
    return this.sanitizer.sanitize(SecurityContext.HTML, value) ?? '';
  }

  // Get all the students
  loadInitialData(): void {
    this._loading.set(true);
    this._error.set(null);

    this.http.get<Student[]>(this.GetAllStudentsUrl)
      .pipe(
        finalize(() => this._loading.set(false))
      )
      .subscribe({
        next: students => {
          this._students.set(
            students.map(s => ({
              ...s,
              fullName: `${s.firstName} ${s.lastName}`
            }))
          );
        },

        error: err => {
          this._error.set('Failed to load students');
          console.error(err);
        }
      });
  }

  //Get student by ID
  getStudentByIdApi(id: number): void {
    this.http.get<Student>(`${this.GetAllStudentsUrl}/${id}`).subscribe({
      next: student => {
        this._students.set([{
          ...student,
          fullName: `${student.firstName} ${student.lastName}`
        }] as any);
        this.selectedStudentId.set(student.id);
      },
      error: err =>
        this.errorHandler.handleError(err, `Failed to load student with id ${id}`)
    });
  }

  // Adds a new Student
  addStudentApi(student: Student): void {
    const { id, ...newStudent } = student;

    const dto = CreateStudentDto.fromStudent(student, (val) => this.sanitizeInput(val));
    this.http.post<Student>(this.GetAllStudentsUrl, dto)
      .subscribe({
        next: createdStudent => {
          this._students.update(list => {
            const studentWithFullName = {
              ...createdStudent,
              fullName: `${createdStudent.firstName} ${createdStudent.lastName}`
            };
            return [...list, studentWithFullName];
          });
          this.messageService.add({
            severity: 'success',
            summary: 'Confirmed',
            detail: 'Student added successfully'
          });
          this.closeAddDialog();
        },
        error: err =>
          this.errorHandler.handleError(err, 'Failed to add student')
      });
  }

  // UPDATE student
  updateStudentApi(student: Student): void {
    const dto = CreateStudentDto.fromStudent(student, (val) => this.sanitizeInput(val));
    this.http.put<Student>(
      `${this.GetAllStudentsUrl}/${student.id}`,
      dto
    ).subscribe({
      next: updatedStudent => {
        this._students.update(list =>
          list.map(s =>
            s.id === updatedStudent.id
              ? {
                ...updatedStudent,
                rollNumber: student.rollNumber,
                fullName: `${updatedStudent.firstName} ${updatedStudent.lastName}`
              }
              : s
          )
        );
        this.messageService.add({
          severity: 'success',
          summary: 'Confirmed',
          detail: 'Student updated successfully'
        });
        this.closeDialog();
      },
      error: err =>
        this.errorHandler.handleError(err, 'Failed to update student')
    });
  }

  //delete single student
  deleteStudentApi(id: number): void {
    this.http
      .delete(`${this.GetAllStudentsUrl}/${id}`)
      .subscribe({
        next: () => {
          this._students.update(list =>
            list.filter(s => s.id !== id)
          );
        },
        error: err =>
          this.errorHandler.handleError(err, 'Failed to delete student')
      });
  }

  //delete multiple students
  deleteStudentsApi(ids: number[]): void {
    if (!ids.length) return;
    const deleteRequests = ids.map(id =>
      this.http.delete(`${this.GetAllStudentsUrl}/${id}`)
        .pipe(
          catchError(err => {
            this.errorHandler.handleError(err, `Failed to delete student with id ${id}`);
            return of(null);
          })
        )
    );

    forkJoin(deleteRequests).subscribe(() => {
      this._students.update(list =>
        list.filter(s => !ids.includes(s.id))
      );
    });
  }

  openDialog(id: number): void {
    this.selectedStudentId.set(id);
    this.dialogVisible.set(true);
  }

  closeDialog(): void {
    this.dialogVisible.set(false);
    this.selectedStudentId.set(null);
  }

  openAddDialog(): void {
    this.addDialogVisible.set(true);
  }

  closeAddDialog(): void {
    this.addDialogVisible.set(false);
  }

}
