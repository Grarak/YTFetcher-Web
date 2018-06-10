import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {
  MatCardModule, MatInputModule, MatButtonModule, MatButtonToggleModule,
  MatSidenavModule, MatToolbarModule, MatIconModule, MatListModule, MatGridListModule,
  MatProgressSpinnerModule, MatTableModule, MatSlideToggleModule, MatDialogModule,
  MatMenuModule
} from '@angular/material';
import {DeviceDetectorModule} from 'ngx-device-detector';

import {ViewsModule} from '../views/views.module';

import {LoginComponent} from './login.component';
import {NotFoundComponent} from './not-found.component';
import {MainComponent} from './main.component';
import {HomeComponent} from './home.component';
import {PlaylistsComponent} from './playlists.component';
import {SearchComponent} from './search.component';
import {PlaylistIdsComponent} from './playlist-ids.component';
import { SettingsComponent } from './settings.component';

@NgModule({
  exports: [
    RouterModule
  ],
  imports: [
    RouterModule.forRoot([
      {
        path: 'main', component: MainComponent, children: [
          {path: 'home', component: HomeComponent},
          {path: 'playlists', component: PlaylistsComponent},
          {path: 'playlists/:name', component: PlaylistIdsComponent},
          {path: 'search/:query', component: SearchComponent},
          {path: 'settings', component: SettingsComponent},
          {path: '**', redirectTo: 'home'}
        ]
      },
      {path: 'login', component: LoginComponent},
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      {path: '404', component: NotFoundComponent},
      {path: '**', redirectTo: '404'}
    ]),
    MatCardModule, MatInputModule, MatButtonModule,
    MatButtonToggleModule, MatSidenavModule, MatToolbarModule,
    MatListModule, MatIconModule, MatGridListModule,
    MatProgressSpinnerModule, MatTableModule, MatSlideToggleModule,
    MatDialogModule, MatMenuModule,
    FormsModule,
    CommonModule,
    ViewsModule,
    DeviceDetectorModule.forRoot()
  ],
  declarations: [
    LoginComponent,
    NotFoundComponent,
    MainComponent,
    HomeComponent,
    PlaylistsComponent,
    SearchComponent,
    PlaylistIdsComponent,
    SettingsComponent
  ]
})
export class PagesModule {
}
