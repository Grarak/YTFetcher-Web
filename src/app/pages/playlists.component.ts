import {Component, OnInit} from '@angular/core';
import {ServerService, Response} from '../services/server.service';
import {Playlist} from '../entities/playlist';
import {MatDialog, MatSlideToggleChange} from '@angular/material';
import {ViewTextSelectDialogComponent} from '../views/view-text-select-dialog.component';
import {Status} from '../entities/status';
import {ViewErrorDialogComponent} from '../views/view-error-dialog.component';
import {ViewConfirmDialogComponent} from '../views/view-confirm-dialog.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-playlists',
  template: `
    <div>
      <table mat-table [dataSource]="dataSource" class="mat-elevation-z8" style="width: 100%">

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let element">
            <span style="cursor: pointer" (click)="onPlaylistClick(element)">{{element.name}}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="public">
          <th mat-header-cell *matHeaderCellDef>Public</th>
          <td mat-cell *matCellDef="let element">
            <div style="display: flex">
              <mat-slide-toggle style="width: 100%"
                                [checked]="element.public"
                                (change)="togglePublic(element, $event)"></mat-slide-toggle>
              <mat-icon style="cursor: pointer" [matMenuTriggerFor]="menu">more_vert</mat-icon>
              <mat-menu #menu="matMenu">
                <button mat-menu-item (click)="deletePlaylist(element)">Delete</button>
              </mat-menu>
            </div>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
      <div style="height: 80px"></div>
      <button mat-fab color="accent" style="position: fixed; right: 16px; bottom: 90px" (click)="addPlaylist()">
        <mat-icon>add</mat-icon>
      </button>
    </div>
  `
})
export class PlaylistsComponent implements OnInit {

  displayedColumns = ['name', 'public'];
  dataSource: Playlist[] = [];

  subscription: any;

  constructor(private server: ServerService, private dialog: MatDialog, private router: Router) {
  }

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.subscription = this.server.playlist.list().subscribe((response: Response<Playlist[]>) => {
      this.dataSource = response.body;
    });
  }

  addPlaylist() {
    const dialogRef = ViewTextSelectDialogComponent.open('Playlist name', this.dialog);
    dialogRef.afterClosed().subscribe(value => {
      if (value == null || value === '') {
        return;
      }
      this.server.playlist.create(value).subscribe((response: Response) => {
        if (response.status === Status.NoError) {
          this.reload();
        } else {
          ViewErrorDialogComponent.open('Playlist already exists', this.dialog);
        }
      });
    });
  }

  togglePublic(playlist: Playlist, change: MatSlideToggleChange) {
    this.server.playlist.setPublic(playlist.name, change.checked).subscribe(() => {
    });
  }

  deletePlaylist(playlist: Playlist) {
    const dialogRef = ViewConfirmDialogComponent.open('Delete ' + playlist.name + '?', this.dialog);
    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.server.playlist.delete(playlist.name).subscribe(() => {
          this.reload();
        });
      }
    });
  }

  onPlaylistClick(playlist: Playlist) {
    this.router.navigate(['main', 'playlists', playlist.name]);
  }

}
