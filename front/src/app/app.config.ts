import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideCloudinaryLoader } from '@angular/common';
import { authInterceptor } from './auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withComponentInputBinding()), provideClientHydration(),
  provideAnimationsAsync(), provideHttpClient(withFetch(), withInterceptors([authInterceptor])), provideCloudinaryLoader("http://res.cloudinary.com/ddvbcm1vl/")]
};
