import {Injectable} from '@angular/core';
import {ServerService, Response} from './server.service';
import {Youtube} from '../entities/youtube';
import ogv from 'ogv';
import {interval} from 'rxjs';

export interface MusicListener {
  onFetch?: (tracks: Youtube[], position: number) => void;
  onPlay?: (tracks: Youtube[], position: number) => void;
  onPause?: (tracks: Youtube[], position: number) => void;
  onPositionChange?: (tracks: Youtube[], trackPosition: number, position: number) => void;
  onFailure?: (tracks: Youtube[], position: number, statusCode: number) => void;
}

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  static NONE = 0;
  static FETCHING = 1;
  static PLAYING = 2;
  static PAUSED = 3;

  ogvPlayer: ogv.OGVPlayer;

  firstTime = true;

  currentTracks: Youtube[] = [];
  currentTrackPosition: number;

  state = MusicService.NONE;
  lastPosition = 0;

  subscription: any;
  timerSubscription: any;

  listeners: MusicListener[] = [];

  constructor(private server: ServerService) {
    this.ogvPlayer = new ogv.OGVPlayer();
    this.ogvPlayer.addEventListener('loadedmetadata', () => {
      this.resume();
    });
    this.ogvPlayer.addEventListener('ended', () => {
      this.pause();
      this.next();
    });
  }

  play(youtube: Youtube) {
    this.playQueue([youtube], 0);
  }

  playQueue(youtube: Youtube[], position: number) {
    // Workaround: Play dummy file first so we can autoplay first track
    if (this.firstTime) {
      this.ogvPlayer.src = '/assets/dummy.ogg';
      this.ogvPlayer.play();
      this.firstTime = false;
    }

    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }

    this.pause();
    this.state = MusicService.FETCHING;
    this.currentTracks = youtube;
    this.currentTrackPosition = position;

    this.notifyFetch(this.currentTracks, this.currentTrackPosition);
    this.subscription = this.server.youtube.fetch(youtube[position])
      .subscribe((response: Response<string>) => {
        if (response.status === 0) {
          this.ogvPlayer.src = response.body;
          this.ogvPlayer.load();
        } else {
          this.state = MusicService.NONE;
          this.notifyFailure(this.currentTracks, this.currentTrackPosition, response.status);
        }
      });
  }

  resume() {
    this.timerSubscription = interval(500).subscribe(() => {
      const currentPosition = this.position();
      if (this.lastPosition !== currentPosition) {
        this.lastPosition = currentPosition;
        this.notifyPositionChange(this.currentTracks, this.currentTrackPosition, this.lastPosition);
      }
    });

    this.state = MusicService.PLAYING;
    this.ogvPlayer.play();
    this.notifyPlay(this.currentTracks, this.currentTrackPosition);
  }

  pause() {
    if (this.timerSubscription != null) {
      this.timerSubscription.unsubscribe();
    }

    this.state = MusicService.PAUSED;
    this.ogvPlayer.pause();
    this.notifyPause(this.currentTracks, this.currentTrackPosition);
  }

  seek(position: number) {
    this.ogvPlayer.currentTime = position;
  }

  position(): number {
    return Math.floor(this.ogvPlayer.currentTime);
  }

  duration(): number {
    return Math.floor(this.ogvPlayer.duration);
  }

  previous() {
    if (this.currentTrackPosition > 0) {
      this.playQueue(this.currentTracks, this.currentTrackPosition - 1);
    }
  }

  next() {
    if (this.currentTrackPosition < this.currentTracks.length - 1) {
      this.playQueue(this.currentTracks, this.currentTrackPosition + 1);
    }
  }

  addListener(listener: MusicListener) {
    this.listeners.push(listener);
  }

  removeListener(listener: MusicListener) {
    this.listeners.splice(this.listeners.indexOf(listener), 1);
  }

  notifyFetch(tracks: Youtube[], position: number) {
    for (const listener of this.listeners) {
      if (listener.onFetch != null) {
        listener.onFetch(tracks, position);
      }
    }
  }

  notifyPlay(tracks: Youtube[], position: number) {
    for (const listener of this.listeners) {
      if (listener.onPlay != null) {
        listener.onPlay(tracks, position);
      }
    }
  }

  notifyPause(tracks: Youtube[], position: number) {
    for (const listener of this.listeners) {
      if (listener.onPause != null) {
        listener.onPause(tracks, position);
      }
    }
  }

  notifyPositionChange(tracks: Youtube[], trackPosition: number, position: number) {
    for (const listener of this.listeners) {
      if (listener.onPositionChange != null) {
        listener.onPositionChange(tracks, trackPosition, position);
      }
    }
  }

  notifyFailure(tracks: Youtube[], position: number, status: number) {
    for (const listener of this.listeners) {
      if (listener.onFailure != null) {
        listener.onFailure(tracks, position, status);
      }
    }
  }

}
