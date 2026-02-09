import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input, signal, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { Student, StudentService } from '../../../services/student-service';

@Component({
  selector: 'app-update-student',
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './update-student.html',
  styleUrl: './update-student.css',
})
export class UpdateStudent {

  private service = inject(StudentService);

  visible = this.service.dialogVisible;

  private selectedStudentSignal = this.service.selectedStudent;

  student: Student | null = null;

  constructor() {
    effect(() => {
      const selected = this.service.selectedStudent();
      this.student = selected ? { ...selected } : null;
    });
  }

  save() {
    if (!this.student) return;

    const s = this.student;

    if (!s.firstName || !s.lastName || !s.email || !s.rollNumber) {
      alert('Required fields missing');
      return;
    }

    this.service.updateStudentApi({
      ...s,
      enrollmentDate: new Date(s.enrollmentDate)
    });
  }

  cancel() {
    this.service.closeDialog();
  }

}
