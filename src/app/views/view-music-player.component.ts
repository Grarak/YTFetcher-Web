import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MusicListener, MusicService} from '../services/music.service';
import {Youtube} from '../entities/youtube';
import {ViewMusicPlayerDialogComponent} from './view-music-player-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-view-music-player',
  template: `
    <div style="width: 100%; height: 100%; background-color: #424242; z-index: 2">
      <div *ngIf="current != null" style="display: flex; height: inherit;">
        <div>
          <mat-spinner style="margin: 16px;" [diameter]="50" *ngIf="playState === 1"></mat-spinner>

          <div *ngIf="playState === 2 || playState === 3" style="top: 50%;
          position: relative; transform: translateY(-50%); cursor: pointer;" (click)="playPauseToggle()">
            <mat-icon style="font-size: 50px; width: 50px">{{ playState === 2 ? 'pause' : 'play_arrow' }}</mat-icon>
          </div>
        </div>
        <div style="flex: 2; cursor: pointer; padding: 16px;" (click)="onClick()">
          <span style="width: inherit; text-align: center; position: relative;
          display: block; top: 50%; transform: translateY(-50%);"
                [style.font-size]="mobileQuery.matches ? '4vw' : ''">{{current.title}}</span>
        </div>
        <div>
          <img style="float: right" [src]="current.thumbnail" align="middle"/>
        </div>
      </div>

      <div *ngIf="current == null" style="display: flex; justify-content: center;
      align-items: center; width: inherit; height: inherit">
        <span>{{message}}</span>
      </div>
    </div>
  `
})
export class ViewMusicPlayerComponent implements OnInit, OnDestroy {

  current: Youtube;
  playState = MusicService.NONE;
  message = 'No Music';

  listener: MusicListener = {
    onFetch: (tracks: Youtube[], position: number) => {
      this.current = tracks[position];
      this.playState = this.music.state;
    },
    onPlay: (tracks: Youtube[], position: number) => {
      this.current = tracks[position];
      this.playState = this.music.state;
    },
    onPause: (tracks: Youtube[], position: number) => {
      this.current = tracks[position];
      this.playState = this.music.state;
    },
    onFailure: (tracks: Youtube[], position: number, statusCode: number) => {
      this.current = tracks[position];
      this.playState = this.music.state;
      this.message = 'Can\'t play ' + this.current.title + '\nRegion lock?';
    }
  };

  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;

  constructor(private music: MusicService, private dialog: MatDialog,
              changeDetectorRef: ChangeDetectorRef) {
    this.mobileQuery = matchMedia('(max-width: 450px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.music.addListener(this.listener);
  }

  playPauseToggle() {
    if (this.playState === 2) {
      this.music.pause();
    } else {
      this.music.resume();
    }
  }

  onClick() {
    this.dialog.open(ViewMusicPlayerDialogComponent, {
      width: '90%'
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
