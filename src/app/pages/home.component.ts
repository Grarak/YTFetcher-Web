import {Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {Response, ServerService} from '../services/server.service';
import {Youtube} from '../entities/youtube';
import {MusicService} from '../services/music.service';
import {ViewListDialogComponent} from '../views/view-list-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-home',
  template: `
    <mat-grid-list [cols]="columns" rowHeight="300px">
      <mat-grid-tile style="width: 100%" *ngFor="let youtube of charts">
        <app-view-music-grid style="width: 100%; height: 100%"
                             [youtube]="youtube"
                             (play)="onPlay(youtube)"
                             (addPlaylist)="addPlaylist(youtube)"></app-view-music-grid>
      </mat-grid-tile>
    </mat-grid-list>
    <mat-progress-spinner
      [style.visibility]="charts.length == 0 ? 'visible' : 'hidden'"
      mode="indeterminate"
      style="left: 50%; position: absolute"
      [diameter]="50"></mat-progress-spinner>
  `
})
export class HomeComponent implements OnInit, OnDestroy {

  charts: Youtube[] = [];

  columns = 1;

  subscription: any;

  constructor(private server: ServerService, private music: MusicService,
              private dialog: MatDialog) {
  }

  ngOnInit() {
    this.subscription = this.server.youtube.charts().subscribe((response: Response<Youtube[]>) => {
      this.charts = response.body;
    });

    this.onWindowResize(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.onWindowResize(event.target.innerWidth);
  }

  onWindowResize(size: number) {
    const columns = Math.floor(size / 300);
    this.columns = columns === 0 ? 1 : columns;
  }

  onPlay(youtube: Youtube) {
    this.music.play(youtube);
  }

  addPlaylist(youtube: Youtube) {
    ViewListDialogComponent.openPlaylistAdd(youtube.id, this.dialog, this.server);
  }

  ngOnDestroy(): void {
    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }
  }

}
