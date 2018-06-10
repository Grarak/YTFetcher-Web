import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Youtube} from '../entities/youtube';

@Component({
  selector: 'app-view-music-grid',
  template: `
    <div style="padding: 10px">
      <mat-card>
        <div mat-card-image style="height: 200px; width: inherit"
             (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
          <img style="height: 100%;width: 100%; object-fit: cover" [src]="youtube.thumbnail">

          <div style="background-color: black; opacity: .5;
           position: absolute; height: inherit; width: 100%;
           top: 0; cursor: pointer;" [style.visibility]="showPlay ? 'visible' : 'hidden'"
               (click)="onPlay()">

            <mat-icon color="#ffffff" style="position: absolute; top: 50%; left: 50%;
             transform: translate(-50%, -50%); width: 50px; height: 50px; font-size: 50px">play_arrow
            </mat-icon>
          </div>
        </div>
        <mat-card-content>
          <div style="display: flex; height: 40px; position: relative; align-items: center;">
            <span style="flex: 1">{{youtube.title}}</span>
            <mat-icon style="cursor: pointer" [matMenuTriggerFor]="menu">more_vert</mat-icon>
            <mat-menu #menu="matMenu">
              <button mat-menu-item (click)="addToPlaylist()">Add to playlist</button>
            </mat-menu>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class ViewMusicGridComponent {

  @Input() youtube: Youtube;
  @Output() play = new EventEmitter();
  @Output() addPlaylist = new EventEmitter();

  showPlay: boolean;

  constructor() {
  }

  onMouseEnter() {
    this.showPlay = true;
  }

  onMouseLeave() {
    this.showPlay = false;
  }

  onPlay() {
    this.play.emit();
  }

  addToPlaylist() {
    this.addPlaylist.emit();
  }

}
