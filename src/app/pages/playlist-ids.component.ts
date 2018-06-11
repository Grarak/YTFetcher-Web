import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {ServerService, Response} from '../services/server.service';
import {Youtube} from '../entities/youtube';
import {Status} from '../entities/status';
import {ViewErrorDialogComponent} from '../views/view-error-dialog.component';
import {MatDialog} from '@angular/material';
import {Observable, zip} from 'rxjs';
import {ViewConfirmDialogComponent} from '../views/view-confirm-dialog.component';
import {MusicService} from '../services/music.service';

@Component({
  selector: 'app-playlist-ids',
  template: `
    <mat-list *ngIf="ids.length > 0 && !showLoading">
      <mat-list-item *ngFor="let id of ids; let i = index">
        <div style="display: flex; align-items: center; width: 100%">
          <span style="flex: 1; cursor: pointer; font-size: 15px" (click)="onPlay(id)">{{id.title}}</span>
          <mat-icon style="cursor: pointer" [matMenuTriggerFor]="menu">more_vert</mat-icon>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="swap(i, i - 1)">Move up</button>
            <button mat-menu-item (click)="swap(i, i + 1)">Move down</button>
            <button mat-menu-item (click)="deleteId(i)">Delete from playlist</button>
          </mat-menu>
        </div>
      </mat-list-item>
    </mat-list>
    <div style="position: absolute; width: 100%; height: 100%;
    justify-content: center; align-items: center;"
         [style.display]="ids.length === 0 ? 'flex' : 'none' || showLoading">
      <mat-progress-spinner
        mode="indeterminate"
        [diameter]="50"></mat-progress-spinner>
    </div>
    <div style="height: 80px"></div>
    <div style="position: fixed; right: 32px; bottom: 90px"
         [style.display]="ids.length > 0 && !showLoading">
      <button mat-fab style="margin-right: 16px" color="accent" (click)="onShuffle()">
        <mat-icon>shuffle</mat-icon>
      </button>
      <button mat-fab color="accent" (click)="onPlayIds()">
        <mat-icon>play_arrow</mat-icon>
      </button>
    </div>
  `
})
export class PlaylistIdsComponent implements OnInit, OnDestroy {

  name: string;
  ids: Youtube[] = [];

  showLoading: boolean;
  subscription: any;

  constructor(private router: Router, private activatedRoute: ActivatedRoute,
              private server: ServerService, private dialog: MatDialog,
              private music: MusicService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (this.subscription != null) {
        this.subscription.unsubscribe();
      }

      this.ids = [];
      this.name = params.name;
      this.server.playlist.listIds(this.name).subscribe((response: Response<string[]>) => {
        if (response.status === Status.NoError) {
          if (response.body.length === 0) {
            this.showEmptyDialog();
          } else {
            this.getInfo(response.body);
          }
        } else {
          this.showEmptyDialog();
        }
      });
    });
  }

  showEmptyDialog() {
    const dialogRef = ViewErrorDialogComponent.open('Playlist is empty', this.dialog);
    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['main', 'playlists']);
    });
  }

  getInfo(ids: string[], position: number = 0, fetchedIds: Youtube[] = []) {
    if (position >= ids.length) {
      this.ids = fetchedIds;
      return;
    }

    const requests = Math.min(50, ids.length - position);

    const observables: Observable<Response<Youtube>>[] = [];
    for (let i = 0; i < requests; i++) {
      observables.push(this.server.youtube.info(ids[i + position]));
    }

    this.subscription = zip(...observables).subscribe((response: Response<Youtube>[]) => {
      for (const id of response) {
        if (id.body != null) {
          fetchedIds.push(id.body);
        }
      }
      this.getInfo(ids, position + requests, fetchedIds);
    });
  }

  deleteId(index: number) {
    const dialogRef = ViewConfirmDialogComponent.open(
      'Delete ' + this.ids[index].title + ' from playlist?', this.dialog);

    dialogRef.afterClosed().subscribe(value => {
      if (value) {
        this.server.playlist.deleteId(this.name, this.ids[index].id).subscribe((response: Response) => {
          if (response.status === Status.NoError) {
            this.ids.splice(index, 1);
          }
        });
      }
    });
  }

  swap(x: number, y: number) {
    if (x >= this.ids.length || y >= this.ids.length || x < 0 || y < 0) {
      return;
    }

    const idsStringArray: string[] = [];
    for (const id of this.ids) {
      idsStringArray.push(id.id);
    }

    const tmpString = idsStringArray[x];
    idsStringArray[x] = idsStringArray[y];
    idsStringArray[y] = tmpString;

    this.showLoading = true;
    this.server.playlist.setIds(this.name, idsStringArray).subscribe(value => {
      if (value) {
        const tmp = this.ids[x];
        this.ids[x] = this.ids[y];
        this.ids[y] = tmp;
      }
      this.showLoading = false;
    });
  }

  shuffle(): Youtube[] {
    const array = this.ids.slice();
    for (let i = this.ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const x = array[i];
      array[i] = array[j];
      array[j] = x;
    }
    return array;
  }

  onPlay(id: Youtube) {
    this.music.play(id);
  }

  onPlayIds() {
    this.music.playQueue(this.ids, 0);
  }

  onShuffle() {
    this.music.playQueue(this.shuffle(), 0);
  }

  ngOnDestroy(): void {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }

}
