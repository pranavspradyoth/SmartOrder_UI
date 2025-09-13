import { ApplicationConfig, importProvidersFrom } from '@angular/core';


import { routes } from './app-routing.module';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes)
  ]
};
