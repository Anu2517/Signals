import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';

export interface Worker {
  id: number;
  name: string;
  email: string;
  department: string;
  experience: number;
  status: 'Active' | 'Inactive' | 'On-Leave';
}

@Injectable({
  providedIn: 'root',
})
export class WorkerService {

  private http = inject(HttpClient);
  private apiUrl = 'Data/workers.json';

  private _workers = signal<Worker[]>([]);

  dialogVisible = signal(false);
  selectedWorkerId = signal<number | null>(null);

  readonly workers = this._workers.asReadonly();

  readonly totalWorkers = computed(() => this._workers().length);

  readonly selectedWorker = computed(() =>
    this._workers().find(w => w.id === this.selectedWorkerId()) ?? null
  );

  constructor() {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    this.http.get<Worker[]>(this.apiUrl).subscribe({
      next: (data) => this._workers.set(data),
      error: (err) => {
        console.error('Failed loading workers', err);
        this._workers.set([]);
      }
    });
  }

  addWorker(worker: Worker): Worker {
    const nextId = this._workers().length > 0
       ? Math.max(...this._workers().map(w => w.id)) + 1: 1;
    const newWorker = { ...worker, id: nextId };
    this._workers.update(list => [...list, newWorker]);
    return newWorker;
  }

  updateWorker(updated: Worker) {
    this._workers.update(list => 
      list.map(w => (w.id === updated.id ? { ...updated } : w))
    );
  }

  deleteWorker(id: number) {
    this._workers.update(list => list.filter(w => w.id !== id));
  }

  deleteWorkers(ids: number[]) {
    this._workers.update(list => list.filter(w => !ids.includes(w.id)));
  }

  getWorkerById(id: number) {
    return this._workers().find(w => w.id === id) ?? null;
  }

  openDialog(id: number) {
    this.selectedWorkerId.set(id);
    this.dialogVisible.set(true);
  }

  closeDialog() {
    this.dialogVisible.set(false);
    this.selectedWorkerId.set(null);
  }
  
}
