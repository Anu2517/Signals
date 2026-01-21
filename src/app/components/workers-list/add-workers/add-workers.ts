import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { WorkerService, Worker } from '../../../services/worker-service';

@Component({
  selector: 'app-add-workers',
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, InputNumberModule],
  templateUrl: './add-workers.html',
  styleUrl: './add-workers.css',
})
export class AddWorkers {

  private service = inject(WorkerService);

  display = false;

  worker: Partial<Worker> = {
    id: 0,
    name: '',
    email: '',
    department: '',
    experience: 0,
    status: undefined
  };

  show() {
    this.display = true;
    this.worker = { id: 0, name: '', email: '', department: '', experience: 0, status: 'Active' };
  }

  cancel() {
    this.display = false;
  }

  add() {
    if (!this.worker.name || !this.worker.email) return;

    this.service.addWorker({
      id: 0,
      name: this.worker.name,
      email: this.worker.email,
      department: this.worker.department ?? '',
      experience: this.worker.experience ?? 0,
      status: this.worker.status ?? 'Active'
    });

    this.display = false;
  }

}
