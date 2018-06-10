import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {Youtube} from '../entities/youtube';
import {ServerService, Response} from '../services/server.service';
import {MusicService} from '../services/music.service';
import {ViewListDialogComponent} from '../views/view-list-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-search',
  template: `
    <div>
      <app-view-music style="width: 100%; height: 100%; padding: 16px"
                      [youtube]="youtube" *ngFor="let youtube of results"
                      (play)="onPlay(youtube)"
                      (addPlaylist)="addPlaylist(youtube)"></app-view-music>
    </div>
    <div style="position: absolute; width: 100%; height: 100%;
    justify-content: center; align-items: center;"
         [style.display]="results.length === 0 ? 'flex' : 'none'">
      <mat-progress-spinner
        mode="indeterminate"
        [diameter]="50"></mat-progress-spinner>
    </div>
  `
})
export class SearchComponent implements OnInit, OnDestroy {

  results: Youtube[] = [];
  subscription: any;

  constructor(private activatedRoute: ActivatedRoute, private server: ServerService,
              private music: MusicService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (this.subscription != null) {
        this.subscription.unsubscribe();
      }

      this.results = [];
      const query = params.query;

      this.subscription = this.server.youtube.search(query)
        .subscribe((response: Response<Youtube[]>) => {
          this.results = response.body;
        });
    });
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
