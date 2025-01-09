import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';

import { ModalModule } from 'ngx-bootstrap/modal';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule, ModalModule.forRoot()),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
