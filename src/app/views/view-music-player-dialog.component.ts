import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MusicListener, MusicService} from '../services/music.service';
import {MatDialogRef, MatSliderChange} from '@angular/material';
import {Youtube} from '../entities/youtube';

@Component({
  selector: 'app-view-music-player-dialog',
  template: `
    <div style="height: 300px; overflow: auto" *ngIf="currentTracks.length > 1">
      <mat-list role="list">
        <mat-list-item role="listitem" *ngFor="let youtube of currentTracks; let i = index">
          <span style="cursor: pointer;"
                [style.font-size]="mobileQuery.matches ? '4vw' : ''"
                (click)="onPlay(i)">{{youtube.title}}</span>
        </mat-list-item>
      </mat-list>
    </div>
    <div style="margin-top: 16px; text-align: center; display: block">
      <span style="display: block">{{currentTracks[currentTrackPosition].title}}</span>
      <span style="display: block; margin-top: 16px">{{getFormattedTime()}}</span>
      <mat-slider style="display: block"
                  [min]="0"
                  [max]="duration"
                  [value]="position"
                  (change)="onSeek($event)"></mat-slider>

      <div style="display: flex">
        <div style="flex: 1; cursor: pointer" (click)="onPrevious()" *ngIf="currentTracks.length > 1">
          <mat-icon>skip_previous</mat-icon>
        </div>
        <div style="flex: 1; cursor: pointer" (click)="togglePausePlay()">
          <mat-icon>{{playState === 2 ? 'pause' : 'play_arrow' }}</mat-icon>
        </div>
        <div style="flex: 1; cursor: pointer" (click)="onNext()" *ngIf="currentTracks.length > 1">
          <mat-icon>skip_next</mat-icon>
        </div>
      </div>
    </div>
  `
})
export class ViewMusicPlayerDialogComponent implements OnInit, OnDestroy {

  currentTracks: Youtube[] = [];
  currentTrackPosition: number;

  duration = 0;
  position = 0;
  playState = MusicService.NONE;

  listener: MusicListener = {
    onFetch: (tracks, position) => {
      this.currentTracks = tracks;
      this.currentTrackPosition = position;
      this.playState = this.music.state;
    },
    onPlay: (tracks, position) => {
      this.currentTracks = tracks;
      this.currentTrackPosition = position;
      this.playState = this.music.state;
      this.duration = this.music.duration();
      this.position = this.music.position();
    },
    onPause: (tracks, position) => {
      this.currentTracks = tracks;
      this.currentTrackPosition = position;
      this.playState = this.music.state;
      this.duration = this.music.duration();
      this.position = this.music.lastPosition;
    },
    onPositionChange: (tracks, trackPosition, position) => {
      this.position = position;
    },
    onFailure: (tracks, position, statusCode) => {
      this.dialogRef.close();
    }
  };

  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;

  constructor(private music: MusicService, changeDetectorRef: ChangeDetectorRef,
              public dialogRef: MatDialogRef<ViewMusicPlayerDialogComponent>) {
    this.mobileQuery = matchMedia('(max-width: 450px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.currentTracks = this.music.currentTracks;
    this.currentTrackPosition = this.music.currentTrackPosition;
    this.playState = this.music.state;

    switch (this.music.state) {
      case MusicService.FETCHING:
        this.listener.onFetch(this.music.currentTracks, this.music.currentTrackPosition);
        break;
      case MusicService.PLAYING:
        this.listener.onPlay(this.music.currentTracks, this.music.currentTrackPosition);
        break;
      case MusicService.PAUSED:
        this.listener.onPause(this.music.currentTracks, this.music.currentTrackPosition);
        break;
    }

    this.music.addListener(this.listener);
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.position / 60);
    const seconds = this.position % 60;

    const minutesText = minutes < 10 ? '0' + minutes : String(minutes);
    const secondsText = seconds < 10 ? '0' + seconds : String(seconds);

    return minutesText + ':' + secondsText;
  }

  onSeek(change: MatSliderChange) {
    this.music.seek(change.value);
  }

  onPrevious() {
    this.music.previous();
  }

  togglePausePlay() {
    if (this.playState === MusicService.PLAYING) {
      this.music.pause();
    } else {
      this.music.resume();
    }
  }

  onNext() {
    this.music.next();
  }

  onPlay(index: number) {
    this.music.playQueue(this.currentTracks, index);
  }

  ngOnDestroy(): void {
    this.music.removeListener(this.listener);
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}
