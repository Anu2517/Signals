import { Component, inject } from '@angular/core';
import { Teacher, TeacherService } from '../../../services/teacher-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-add-teachers',
  imports: [CommonModule, FormsModule,DialogModule, ButtonModule, InputTextModule, InputNumberModule],
  templateUrl: './add-teachers.html',
  styleUrl: './add-teachers.css',
})
export class AddTeachers {
  private service = inject(TeacherService);

  display = false;

  teacher: Partial<Teacher> = {
    id: 0,
    name: '',
    age: 0,
    email: '',
    subject: '',
    department: '',
    status: undefined
  };

  show() {
    this.display = true;
    this.teacher = { id: 0, name: '', age: 0, email: '', subject: '', department: '', status: 'Active' };
  }

  cancel() {
    this.display = false;
  }

  add() {
    if (!this.teacher.name || !this.teacher.email) return;

    this.service.addTeacher({
      id: 0,
      name: this.teacher.name,
      age: this.teacher.age ?? 0,
      email: this.teacher.email,
      subject: this.teacher.subject ?? '',
      department: this.teacher.department ?? '',
      status: this.teacher.status ?? 'Active'
    });

    this.display = false;
  }


}
