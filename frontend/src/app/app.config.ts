import { importProvidersFrom } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';

export const appConfig = {
  providers: [
    importProvidersFrom(AppRoutingModule, SharedModule)
  ]
};
