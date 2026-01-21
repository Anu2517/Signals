import { CommonModule } from '@angular/common';
import { Component, effect, inject, Input, SimpleChanges } from '@angular/core';
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
      const s = this.selectedStudentSignal();
      this.student = s ? { ...s } : null;
    });
  }

  save() {
    if (this.student) {
      this.service.updateStudent(this.student);
      this.service.closeDialog();
    }
  }

  cancel() {
    this.service.closeDialog();
  }

}
