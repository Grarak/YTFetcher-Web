import {NgModule} from '@angular/core';
import {ServerService} from './server.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {Title} from '@angular/platform-browser';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    HttpClient,
    ServerService,
    Title
  ]
})
export class ServicesModule {

}
