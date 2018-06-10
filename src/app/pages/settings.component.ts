import {Component, OnInit} from '@angular/core';
import {ViewConfirmDialogComponent} from '../views/view-confirm-dialog.component';
import {MatDialog} from '@angular/material';
import {MusicService} from '../services/music.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-settings',
  template: `
    <div style="padding: 16px">
      <button mat-raised-button color="warn" style="width: 100%;" (click)="onSignOut()">Sign out</button>
    </div>
  `
})
export class SettingsComponent {

  constructor(private dialog: MatDialog, private music: MusicService,
              private router: Router) {
  }

  onSignOut() {
    const dialogRef = ViewConfirmDialogComponent.open('Do you want to sign out?', this.dialog);

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.music.pause();
        localStorage.removeItem('apiKey');
        this.router.navigate(['login']);
      }
    });
  }

}
