import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { Student, StudentService } from '../../../services/student-service';

@Component({
  selector: 'app-add-students',
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, InputNumberModule],
  templateUrl: './add-students.html',
  styleUrl: './add-students.css',
})
export class AddStudents {
  private service = inject(StudentService);

  phone = '';
  guardianName = '';
  address = '';

  display = this.service.addDialogVisible;

  student: Partial<Student> = {
    id: 0,
    firstName: '',
    lastName: '',
    age: 0,
    email: '',
    course: '',
    year: 0,
    rollNumber: '',
    enrollmentDate: new Date(),
  };

  cancel() {
    this.service.closeAddDialog();
  }

  add() {
  if (!this.student.firstName || !this.student.lastName || !this.student.email || !this.student.rollNumber) {
    console.warn('Missing required fields');
    return;
  }

  const payload: Student = {
    id: 0,
    firstName: this.student.firstName.trim(),
    lastName: this.student.lastName.trim(),
    age: this.student.age ?? 0,
    email: this.student.email.trim(),
    course: this.student.course ?? '',
    year: this.student.year ?? 0,
    rollNumber: this.student.rollNumber.trim(),
    enrollmentDate: this.student.enrollmentDate
      ? new Date(this.student.enrollmentDate)
      : new Date()
  };

  this.service.addStudentApi(payload);
}


}
