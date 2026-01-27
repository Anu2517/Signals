import { Component, EventEmitter, inject, Output } from '@angular/core';
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
  enrollmentDate = '';
  status = 'Active';

  display = this.service.addDialogVisible;

  student: Partial<Student> = {
    id: 0,
    name: '',
    email: '',
    grade: '',
    course: '',
    enrollmentDate: new Date(),
    department: '',
    status: undefined
  };

  cancel() {
    this.service.closeAddDialog();
  }

  add() {
    if (!this.student.name || !this.student.email ) return;

    this.service.addStudent({
      id: 0,
      name: this.student.name,
      email: this.student.email,
      grade: this.student.grade ?? '',
      course: this.student.course ?? '',
      enrollmentDate: this.student.enrollmentDate ?? new Date(),
      department: this.student.department ?? '',
      status: this.student.status ?? 'Active',
    });

    this.service.closeAddDialog();
  }

}
