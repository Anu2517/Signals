import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { WorkerService, Worker } from '../../../services/worker-service';

@Component({
  selector: 'app-update-workers',
  imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule],
  templateUrl: './update-workers.html',
  styleUrl: './update-workers.css',
})
export class UpdateWorkers {
  private service = inject(WorkerService);

  visible = this.service.dialogVisible;

  private selectedWorkerSignal = this.service.selectedWorker;

  worker: Worker | null = null;

  constructor() {
    effect(() => {
      const s = this.selectedWorkerSignal();
      this.worker = s ? { ...s } : null;
    });
  }

  save() {
    if (this.worker) {
      this.service.updateWorker(this.worker);
      this.service.closeDialog();
    }
  }

  cancel() {
    this.service.closeDialog();
  }

}
