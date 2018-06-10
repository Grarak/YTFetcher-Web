import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ServerService, Response} from '../services/server.service';
import {Playlist} from '../entities/playlist';
import {Status} from '../entities/status';
import {ViewErrorDialogComponent} from './view-error-dialog.component';

@Component({
  selector: 'app-view-list-dialog',
  template: `
    <mat-dialog-content>
      <mat-list>
        <mat-list-item *ngFor="let item of data; let i = index">
          <button mat-button (click)="onClick(i)">{{item}}</button>
        </mat-list-item>
      </mat-list>
    </mat-dialog-content>
  `
})
export class ViewListDialogComponent {

  static openPlaylistAdd(idToAdd: string, dialog: MatDialog, server: ServerService) {
    server.playlist.list().subscribe((response: Response<Playlist[]>) => {
      if (response.status !== Status.NoError || response.body.length === 0) {
        ViewErrorDialogComponent.open('No playlists found', dialog);
      } else {
        const list: string[] = [];
        for (const playlist of response.body) {
          list.push(playlist.name);
        }
        const dialogRef = ViewListDialogComponent.open(list, dialog);
        dialogRef.afterClosed().subscribe(value => {
          if (value != null) {
            server.playlist.addId(list[value], idToAdd).subscribe((addResponse: Response) => {
              if (addResponse.status !== 0) {
                ViewErrorDialogComponent.open('Already in playlist!', dialog);
              }
            });
          }
        });
      }
    });
  }

  static open(list: string[], dialog: MatDialog): MatDialogRef<ViewListDialogComponent, number> {
    return dialog.open<ViewListDialogComponent, string[], number>(ViewListDialogComponent, {
      data: list
    });
  }

  constructor(private dialogRef: MatDialogRef<ViewListDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string[]) {
  }

  onClick(index: number) {
    this.dialogRef.close(index);
  }

}
