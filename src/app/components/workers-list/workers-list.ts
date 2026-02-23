import { Component, inject, signal } from '@angular/core';
import { WorkerService, Worker } from '../../services/worker-service';
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
import { AddWorkers } from './add-workers/add-workers';
import { UpdateWorkers } from './update-workers/update-workers';
import { Select } from 'primeng/select';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-workers-list',
  imports: [Toast, Select, CommonModule, FormsModule, TableModule, ButtonModule, InputTextModule, InputNumberModule, IconField, Tag, InputIconModule, DialogModule, AddWorkers, UpdateWorkers],
  providers: [MessageService],
  templateUrl: './workers-list.html',
  styleUrl: './workers-list.css',
})
export class WorkersList {

  private service = inject(WorkerService);
  private messageService = inject(MessageService);

  title = 'Workers';

  workers = this.service.workers;

  selectedWorkerId = signal<number | null>(null);
  selectedWorkers: Worker[] = [];

  globalFilter = '';

  editWorker(worker: Worker) {
    this.service.openDialog(worker.id);
  }

  onDelete(worker: Worker) {
    if (confirm(`Delete ${worker.name}?`)) {
      this.service.deleteWorker(worker.id);

      this.messageService.add({
      severity: 'success',
      summary: 'Deleted',
      detail: `${worker.name} deleted successfully`,
      life: 3000
    });
    }
  }

  deleteSelected() {
    if (!this.selectedWorkers.length) return;

    if (confirm(`Delete ${this.selectedWorkers.length} worker(s)?`)) {
      const ids = this.selectedWorkers.map(w => w.id);
      this.service.deleteWorkers(ids);

      this.messageService.add({
      severity: 'success',
      summary: 'Deleted',
      detail: `${ids.length} deleted successfully`,
      life: 3000
    });
      this.selectedWorkers = [];
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

  //Departments

  departmentOptions = [
    { label: 'All Departments', value: null },
    { label: 'Maintenance', value: 'Maintenance' },
    { label: 'Housekeeping', value: 'Housekeeping' },
    { label: 'Security', value: 'Security' },
    { label: 'Administration', value: 'Administration' },
    { label: 'Transport', value: 'Transport' }
  ];

  selectedDepartment: string | null = null;

  exportCSV() {
    const data = this.workers(); // signal → array
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(worker =>
      Object.values(worker).join(',')
    );

    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;'
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'workers.csv';
    link.click();
  }

  //JSON File

  exportJSON() {
    const data = this.workers();
    if (!data || data.length === 0) return;

    const blob = new Blob(
      [JSON.stringify(data, null, 2)],
      { type: 'application/json' }
    );

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'workers.json';
    link.click();
  }

}
