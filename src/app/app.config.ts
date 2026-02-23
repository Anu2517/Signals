import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { MessageService } from 'primeng/api';
import { provideEchartsCore } from 'ngx-echarts';
import * as echarts from 'echarts';
import { authInterceptor } from './interceptors/auth-interceptor';
import { GlobalErrorHandler } from './services/global-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.p-dark',
          lightModeSelector: '.p-light'
        }
      }
    }),
    provideEchartsCore({
      echarts
    }),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }

  ]
};
