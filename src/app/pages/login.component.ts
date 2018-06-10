import {Component, OnDestroy, OnInit} from '@angular/core';
import {Response, ServerService} from '../services/server.service';
import {User} from '../entities/user';
import {Observable} from 'rxjs';
import {Status} from '../entities/status';
import {Router} from '@angular/router';
import {DeviceDetectorService} from 'ngx-device-detector';

@Component({
  selector: 'app-page-login',
  template: `
    <div style="display: table;margin: 2em auto; background-color: #424242">
      <mat-card id="display: inline-block;">
        <mat-card-title>
          {{isSignUp ? "Sign up" : "Login"}}
        </mat-card-title>
        <mat-card-content>
          <div>
            <mat-form-field>
              <input matInput placeholder="Username" [(ngModel)]="username" [ngModelOptions]="{standalone: true}">
            </mat-form-field>
            <br/>
            <mat-form-field>
              <input matInput type="password" placeholder="Password" [(ngModel)]="password" [ngModelOptions]="{standalone: true}">
            </mat-form-field>
            <br/>
            <mat-form-field [style.visibility]="isSignUp ? 'visible' : 'hidden'">
              <input type="password" matInput placeholder="Confirm Password" [(ngModel)]="confirmPassword"
                     [ngModelOptions]="{standalone: true}">
            </mat-form-field>

            <i style="text-align: center;"><p style="color: red;min-height: 1em">{{errorText}}</p></i>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <mat-button-toggle-group #group="matButtonToggleGroup" [value]="isSignUp ? 'signUp' : 'login'">
            <mat-button-toggle value="signUp" (click)="isSignUp = true">Sign up</mat-button-toggle>
            <mat-button-toggle value="login" (click)="isSignUp = false">Login</mat-button-toggle>
          </mat-button-toggle-group>
          <button mat-raised-button color="primary" style="margin-left: 2em" (click)="onSubmit()">Submit</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
    }
  `]
})
export class LoginComponent implements OnInit, OnDestroy {

  isSignUp = true;

  username = '';
  password = '';
  confirmPassword = '';

  errorText = '';

  serverSubscription: any;

  constructor(private server: ServerService, private router: Router,
              private deviceService: DeviceDetectorService) {
  }

  onSubmit() {
    if (this.username.length <= 3) {
      this.errorText = 'Username must be at least 4 characters long!';
      return;
    } else if (!/^[a-zA-Z0-9_]*$/.test(this.username)) {
      this.errorText = 'Username must be at least 4 characters long!';
      return;
    }

    if (this.password.length <= 4) {
      this.errorText = 'Password must be at least 5 characters long!';
      return;
    }

    if (this.isSignUp && this.confirmPassword !== this.password) {
      this.errorText = 'Passwords don\'t match!';
      return;
    }

    const user = <User>{name: this.username, password: btoa(this.password)};
    const observable: Observable<Response<User>> = this.isSignUp ? this.server.user.signUp(user) : this.server.user.login(user);
    this.serverSubscription = observable.subscribe((response: Response<User>) => {
      if (response.status === Status.NoError) {
        if (!response.body.verified) {
          this.errorText = 'Your account isn\'t verified yet. Please contact the host!';
        } else {
          this.signIn(response.body.apikey);
        }
      } else if (response.status === Status.UserAlreadyExists) {
        this.errorText = 'This username already exists!';
      } else if (response.status === Status.InvalidPassword) {
        this.errorText = 'Your login credentials are wrong!';
      } else {
        this.errorText = 'Something went wrong :(';
      }
    });
  }

  ngOnInit(): void {
    const apiKey = localStorage.getItem('apiKey');
    if (apiKey) {
      this.signIn(apiKey);
    }
  }

  signIn(apiKey: string) {
    localStorage.setItem('apiKey', apiKey);
    this.server.apiKey = apiKey;
    this.router.navigate(['/main']).catch(() => {
      this.errorText = 'Something went wrong :(';
    });
  }

  ngOnDestroy(): void {
    if (this.serverSubscription != null) {
      this.serverSubscription.unsubscribe();
    }
  }
}
