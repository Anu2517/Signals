import { Component, inject, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { Teacher, TeacherService } from '../../../services/teacher-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-update-teachers',
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './update-teachers.html',
  styleUrl: './update-teachers.css',
})
export class UpdateTeachers {

  private service = inject(TeacherService);

  @Input() teacherId: number | null = null;
  @Input() visible = false;
  @Input() onClose!: () => void;

  teacher: Teacher | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['teacherId'] && this.teacherId != null) {
      const found = this.service.getTeachersById(this.teacherId);
      this.teacher = found ? { ...found } : null;
    }
  }

  save() {
    if (this.teacher) {
      this.service.updateTeacher(this.teacher);
      this.onClose();
    }
  }

}
