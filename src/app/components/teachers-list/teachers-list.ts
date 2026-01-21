import { Component, inject, signal } from '@angular/core';
import { Teacher, TeacherService } from '../../services/teacher-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, TablePageEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { IconField } from 'primeng/iconfield';
import { Tag } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { AddTeachers } from './add-teachers/add-teachers';
import { UpdateTeachers } from './update-teachers/update-teachers';
import { Select } from 'primeng/select';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-teachers-list',
  imports: [Toast, CommonModule, FormsModule, Select, TableModule, ButtonModule, InputTextModule, InputNumberModule, 
    IconField, Tag, InputIconModule, DialogModule, AddTeachers, UpdateTeachers],
  providers: [MessageService],
  templateUrl: './teachers-list.html',
  styleUrl: './teachers-list.css',
})
export class TeachersList {

  private service = inject(TeacherService);

  constructor(
    private messageService: MessageService
  ) {}


  title = 'Teachers';

  teachers = this.service.teachers;

  selectedTeacherId = signal<number | null>(null);
  displayEditDialog = signal(false);

  globalFilter = '';

  selectedTeachers: Teacher[] = [];

  onEditStart(teacher: Teacher) {
    this.selectedTeacherId.set(teacher.id);
    this.displayEditDialog.set(true);
  }

  onDialogCancel() {
    this.displayEditDialog.set(false);
    this.selectedTeacherId.set(null);
  }

  onDelete(teacher: Teacher) {
    if (confirm(`Delete ${teacher.name}?`)) {
      this.service.deleteTeacher(teacher.id);

      this.messageService.add({
      severity: 'success',
      summary: 'Deleted',
      detail: `${teacher.name} deleted successfully`,
      life: 3000
    }); 
    }
  }

  deleteSelected() {
    if (!this.selectedTeachers.length) return;

    if (confirm(`Delete ${this.selectedTeachers.length} teacher(s)?`)) {
      const ids = this.selectedTeachers.map(t => t.id);
      this.service.deleteTeachers(ids);

      this.messageService.add({
      severity: 'success',
      summary: 'Deleted',
      detail: `${ids.length} deleted successfully`,
      life: 3000
    });
      this.selectedTeachers = [];
    }
  }

  getSeverity(status: string): 'success' | 'danger' | 'info' | 'secondary' {
    switch (status) {
      case 'Inactive':
        return 'danger';

      case 'Active':
        return 'success';

      case 'On-Leave':
        return 'info';

      default:
        return 'secondary';
    }
  }

  //Status

  statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
    { label: 'On-Leave', value: 'On-Leave' }
  ];

  selectedStatus: string | null = null;

  //Grades

  departmentOptions = [
    { label: 'All Departments', value: null },
    { label: 'Science', value: 'Science' },
    { label: 'Technology', value: 'Technology' },
    { label: 'Arts', value: 'Arts' },
    { label: 'Commerce', value: 'Commerce' }
  ];

  selectedDepartment: string | null = null;


  exportCSV() {
    const data = this.teachers(); // signal → array
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(teacher =>
      Object.values(teacher).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'teachers.csv';
    link.click();
  }

  //JSON File

  exportJSON() {
    const data = this.teachers();
    if (!data || data.length === 0) return;

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: 'application/json' }
    );

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'teachers.json';
    link.click();
  }

}
