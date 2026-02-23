import { inject, Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ErrorhandlerService {
  private messageService = inject(MessageService);

  constructor() {
    const show = () => this.messageService.add({
      severity: 'warn',
      summary: 'Offline',
      detail: 'You are currently offline. Please check your internet connection.'
    });
    if (!navigator.onLine) show();
    window.addEventListener('offline', show);
  }

  handleError(error: any, userMessage?: string): void {
    if (!navigator.onLine) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Offline',
        detail: 'You are currently offline. Please check your internet connection.',
        life: 5000
      });
      console.error('Network Offline:', error);
      return;
    }

    const message =
      userMessage ??
      this.extractErrorMessage(error) ??
      'An unexpected error occurred';
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 5000
    });

    console.error('Error:', error);
  }

  private extractErrorMessage(error: any): string {
    return error?.error?.message || error?.message || 'An unknown error occurred';
  }

}
