import { ErrorHandler, inject, Injectable } from '@angular/core';
import { ErrorhandlerService } from './errorhandler-service';

@Injectable({
  providedIn: 'root',
})
export class GlobalErrorHandler implements ErrorHandler{
   private errorHandler = inject(ErrorhandlerService);

  handleError(error: any): void {
    this.errorHandler.handleError(error);
    console.error('Global Error Caught:', error);
  }
  
}
