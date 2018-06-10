import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {PagesModule} from './pages/pages.module';
import {ServicesModule} from './services/services.module';

import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    PagesModule,
    ServicesModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
