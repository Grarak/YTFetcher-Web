import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Youtube} from '../entities/youtube';

@Component({
  selector: 'app-view-music',
  template: `
    <mat-card style="padding: 0; margin-left: 16px; margin-right: 16px; height: 120px">
      <div style="height: 100%; display: flex">
        <div style="width: 200px" (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
          <img #image style="height: 100%;width: inherit; object-fit: cover;" [src]="youtube.thumbnail">

          <div style="background-color: black; opacity: .5;
          position: absolute; top: 0; height: 100%; width: inherit;
          cursor: pointer;" [style.visibility]="showPlay ? 'visible' : 'hidden'"
               (click)="onPlay()">
            <mat-icon color="#ffffff" style="position: absolute; top: 50%; left: 50%;
             transform: translate(-50%, -50%); width: 50px; height: 50px; font-size: 50px">play_arrow
            </mat-icon>
          </div>
        </div>
        <p style="align-self: center; padding: 16px; flex: 1">{{youtube.title}}</p>
        <mat-icon style="cursor: pointer; position: relative;top: 50%; transform: translateY(-50%);"
                  [matMenuTriggerFor]="menu">
          more_vert
        </mat-icon>
        <mat-menu #menu="matMenu">
          <button mat-menu-item (click)="addToPlaylist()">Add to playlist</button>
        </mat-menu>
      </div>
    </mat-card>
  `
})
export class ViewMusicComponent {

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
