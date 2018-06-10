import {NgModule} from '@angular/core';
import {ServerService} from './server.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    HttpClient,
    ServerService
  ]
})
export class ServicesModule {

}
