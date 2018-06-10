import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {
  MatCardModule, MatIconModule, MatProgressSpinnerModule,
  MatDialogModule, MatListModule, MatSliderModule, MatFormFieldModule,
  MatInputModule, MatButtonModule, MatMenuModule
} from '@angular/material';

import {ViewMusicGridComponent} from './view-music-grid.component';
import {ViewMusicPlayerComponent} from './view-music-player.component';
import {ViewMusicComponent} from './view-music.component';
import {ViewMusicPlayerDialogComponent} from './view-music-player-dialog.component';
import {ViewTextSelectDialogComponent} from './view-text-select-dialog.component';
import {ViewErrorDialogComponent} from './view-error-dialog.component';
import {ViewConfirmDialogComponent} from './view-confirm-dialog.component';
import {ViewListDialogComponent} from './view-list-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule, MatIconModule, MatProgressSpinnerModule,
    MatDialogModule, MatListModule, MatSliderModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatMenuModule,
    FormsModule
  ],
  declarations: [
    ViewMusicComponent,
    ViewMusicGridComponent,
    ViewMusicPlayerComponent,
    ViewMusicPlayerDialogComponent,
    ViewTextSelectDialogComponent,
    ViewErrorDialogComponent,
    ViewConfirmDialogComponent,
    ViewListDialogComponent
  ],
  exports: [
    ViewMusicComponent,
    ViewMusicGridComponent,
    ViewMusicPlayerComponent,
    ViewTextSelectDialogComponent,
    ViewErrorDialogComponent,
    ViewConfirmDialogComponent,
    ViewListDialogComponent
  ],
  entryComponents: [
    ViewMusicPlayerDialogComponent,
    ViewTextSelectDialogComponent,
    ViewErrorDialogComponent,
    ViewConfirmDialogComponent,
    ViewListDialogComponent
  ]
})
export class ViewsModule {
}
