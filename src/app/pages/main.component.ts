import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {MatSidenav} from '@angular/material';
import {ServerService} from '../services/server.service';

@Component({
  selector: 'app-main',
  template: `
    <div class="example-container">
      <mat-toolbar color="primary">
        <button mat-icon-button
                (click)="snav.toggle()"
                style="margin-right: 16px"
                [style.visibility]="mobileQuery.matches ? 'visible' : 'hidden'">
          <mat-icon>menu</mat-icon>
        </button>

        <span style="flex: 1 1 auto;"></span>
        <mat-form-field floatLabel="never"
                        style="transform: translate(0%, 5%);"
                        [style.width]="mobileQuery.matches ? '100%' : '500px'">
          <input #search matInput type="text" (keyup.enter)="onSearch(search.value)"/>
          <button mat-button matSuffix mat-icon-button aria-label="Search" (click)="onSearch(search.value)">
            <mat-icon>search</mat-icon>
          </button>
        </mat-form-field>
      </mat-toolbar>

      <mat-sidenav-container class="example-sidenav-container">
        <mat-sidenav #snav
                     [opened]="!mobileQuery.matches"
                     [mode]="mobileQuery.matches ? 'over' : 'side'"
                     [style.width]="mobileQuery.matches ? '70%' : '20%'"
                     [fixedInViewport]="mobileQuery.matches">
          <mat-nav-list style="margin-top: 60px">
            <a mat-list-item
               [routerLink]="'/main' + item.path"
               *ngFor="let item of navItems"
               (click)="onDismiss(snav)">{{item.title}}</a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content
          [style.width]="!mobileQuery.matches ? '80%' : ''"
          [style.float]="!mobileQuery.matches ? 'right' : ''"
          [style.margin-left]="!mobileQuery.matches ? '0' : ''">
          <div style="margin-bottom: 75px;">
            <router-outlet></router-outlet>
            <app-view-music-player
              style="z-index: 2"
              [style.width]="!mobileQuery.matches ? '80%' : ''"
              class="music-player"></app-view-music-player>
          </div>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .example-container {
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    .example-sidenav-container {
      flex: 1;
    }

    .music-player {
      overflow: hidden;
      width: 100%;
      height: 75px;
      position: fixed;
      bottom: 0;
    }
  `
  ]
})
export class MainComponent implements OnInit, OnDestroy {

  navItems: NavigationItems[] = [
    {title: 'Home', path: '/'},
    {title: 'Playlists', path: '/playlists'},
    {title: 'Settings', path: '/settings'}
  ];

  mobileQuery: MediaQueryList;
  _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, private router: Router, private server: ServerService) {
    this.mobileQuery = matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    const apiKey = localStorage.getItem('apiKey');
    if (!apiKey) {
      this.router.navigate(['/login']);
    }
    this.server.apiKey = apiKey;
  }

  onDismiss(snav: MatSidenav) {
    if (this.mobileQuery.matches) {
      snav.toggle();
    }
  }

  onSearch(query: string) {
    this.router.navigate(['main', 'search', query]);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

}

interface NavigationItems {
  title: string;
  path: string;
}
