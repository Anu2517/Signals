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
  ) { }

  title = 'Students';

  students = this.service.students;
  selectedStudents: Student[] = []; //delete multiple students
  globalFilter = '';

  // to add 1000 columns
  columns = computed(() => {
    const data = this.students(); 
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

  // Get student by name,email,course......
  onSearchChange(value: string, table: any) {
    const trimmed = value.trim();
    if (!trimmed) {
      table.clear();
      this.service.loadInitialData();
      return;
    }
    table.filterGlobal(trimmed, 'contains');
  }

  // Get student by id
  searchById(table: any) {
    const trimmed = this.globalFilter.trim();

    if (/^\d+$/.test(trimmed)) {
      table.clear();
      this.service.getStudentByIdApi(Number(trimmed));
    }
  }


  editStudent(student: Student) {
    this.service.openDialog(student.id);
  }

  //delete single student

  deleteStudent(id: number) {
    const student = this.students().find(s => s.id === id);
    if (!student) return;

    if (confirm(`Delete ${student.firstName}?`)) {
      this.service.deleteStudentApi(id);

      this.messageService.add({
        severity: 'success',
        summary: 'Deleted',
        detail: `${student.firstName} deleted successfully`,
        life: 3000
      });
    }
  }

  //delete multiple students
  deleteSelected() {
    if (!this.selectedStudents.length) return;

    if (confirm(`Delete ${this.selectedStudents.length} student(s)?`)) {
      const ids = this.selectedStudents.map(s => s.id);
      this.service.deleteStudentsApi(ids);

      this.messageService.add({
        severity: 'success',
        summary: 'Deleted',
        detail: `${ids.length} student(s) deleted successfully`,
        life: 3000
      });
      this.selectedStudents = [];
    }
  }

  // Years
  getSeverity(year: number): 'success' | 'danger' | 'info' | 'warn' | 'secondary' {
    switch (year) {
      case 1:
        return 'danger';

      case 2:
        return 'success';

      case 3:
        return 'info';

      case 4:
        return 'warn';

      default:
        return 'secondary';
    }
  }

  //Years

  yearsOptions = [
    { label: 'All Years', value: null },
    { label: 'Year 1', value: '1' },
    { label: 'Year 2', value: '2' },
    { label: 'Year 3', value: '3' },
    { label: 'Year 4', value: '4' },
    { label: 'Year 5', value: '5' },
  ];

  selectedYear: number | null = null;

  //Course

  courseOptions = [
    { label: 'All Courses', value: null },
    { label: 'CS', value: 'CS' },
    { label: 'IT', value: 'IT' },
    { label: 'English', value: 'English' },
    { label: 'Sci', value: 'Sci' },
    { label: 'ECE', value: 'ECE' }
  ];

  selectedCourse: string | null = null;

  //CSV file

  exportCSV() {
    const data = this.students();
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


