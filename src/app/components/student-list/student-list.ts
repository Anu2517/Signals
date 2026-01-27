import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Student, StudentService } from '../../services/student-service';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { IconField } from 'primeng/iconfield';
import { Tag } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { DialogModule } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { AddStudents } from './add-students/add-students';
import type { TablePageEvent } from 'primeng/table';
import { UpdateStudent } from './update-student/update-student';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-student-list',
  imports: [Toast, CommonModule, FormsModule, HttpClientModule, Select, TableModule, ButtonModule, InputTextModule, InputNumberModule, IconField, Tag, InputIconModule, DialogModule, AddStudents, UpdateStudent],
  providers: [MessageService],
  templateUrl: './student-list.html',
  styleUrl: './student-list.css',
})
export class StudentList { 

  private service = inject(StudentService);
  constructor(
    private messageService: MessageService
  ) {}

  title = 'Students';

  students = this.service.students;
  selectedStudents: Student[] = []; //delete multiple students
  globalFilter = '';

  // to add 1000 columns
  columns = computed(() => {
    const data = this.students(); // reactive
    if (!data || data.length === 0) return [];

    const customWidths: Record<string, string> = {
      id: '80px',
      age: '80px',
      email: '250px',
      status: '120px',
      enrollmentDate: '240px'
    };

    return Object.keys(data[0]).map(key => ({
      field: key,
      header: key.charAt(0).toUpperCase() + key.slice(1),
      width: customWidths[key] || '150px',
      type: key === 'status' ? 'tag' : 'text'
    }));
  });

  openAddStudent() {
    this.service.openAddDialog();
  }

  editStudent(student: Student) {
    this.service.openDialog(student.id);
  }

  //delete single student
  onDelete(student: Student) {
    if (confirm(`Delete ${student.name}?`)) {
      this.service.deleteStudent(student.id);

      this.messageService.add({
      severity: 'success',
      summary: 'Deleted',
      detail: `${student.name} deleted successfully`,
      life: 3000
    });
    }
  }

  //delete multiple students
  deleteSelected() {
    if (!this.selectedStudents.length) return;

    if (confirm(`Delete ${this.selectedStudents.length} student(s)?`)) {
      const ids = this.selectedStudents.map(s => s.id);
      this.service.deleteStudents(ids);
      
      this.messageService.add({
      severity: 'success',
      summary: 'Deleted',
      detail: `${ids.length} deleted successfully`,
      life: 3000
    });
      

      this.selectedStudents = [];
    }
  }


  // Status
  getSeverity(status: string): 'success' | 'danger' | 'info' | 'secondary' {
    switch (status) {
      case 'Inactive':
        return 'danger';

      case 'Active':
        return 'success';

      case 'Graduated':
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
    { label: 'Graduated', value: 'Graduated' }
  ];

  selectedStatus: string | null = null;

  //Grades

  gradeOptions = [
    { label: 'All Grades', value: null },
    { label: '10th', value: '10th' },
    { label: '11th', value: '11th' },
    { label: '12th', value: '12th' }
  ];

  selectedGrade: string | null = null;

  //CSV file

  exportCSV() {
    const data = this.students(); // signal → array
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(student =>
      Object.values(student).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'students.csv';
    link.click();
  }

  //JSON File

  exportJSON() {
    const data = this.students();
    if (!data || data.length === 0) return;

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: 'application/json' }
    );

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'students.json';
    link.click();
  }

}


