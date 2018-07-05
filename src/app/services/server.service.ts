import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {User} from '../entities/user';
import {Observable} from 'rxjs';
import {Youtube} from '../entities/youtube';
import {Playlist} from '../entities/playlist';

export class UserServer {
  constructor(private server: ServerService) {
  }

  public signUp(user: User): Observable<Response<User>> {
    return new Observable<Response<User>>(subscriber => {
      this.server.post<User>('users/signup', user)
        .forEach((response: HttpResponse<User>) => {
          subscriber.next(new Response<User>(0, <User>response.body));
        })
        .catch(reason => {
          subscriber.next(new Response<User>(reason.error.statuscode));
        });
    });
  }

  public login(user: User): Observable<Response<User>> {
    return new Observable<Response<User>>(subscriber => {
      this.server.post('users/login', user)
        .forEach((response: HttpResponse<User>) => {
          subscriber.next(new Response<User>(0, <User>response.body));
        })
        .catch(reason => {
          subscriber.next(new Response<User>(reason.error.statuscode));
        });
    });
  }
}

export class YoutubeServer {
  constructor(private server: ServerService) {
  }

  public fetch(youtube: Youtube): Observable<Response<string>> {
    return new Observable<Response<string>>(subscriber => {
      this.server.post<string>('youtube/fetch', {
        apikey: this.server.apiKey,
        id: youtube.id,
        addhistory: true
      }, 'text')
        .forEach((urlResponse: HttpResponse<string>) => {
          const ytfetcherId = urlResponse.headers.get('ytfetcher-id');
          const url = urlResponse.body.trim();

          if (url.indexOf('googlevideo') > 0) {
            const forwardUrl = new URLSearchParams();
            forwardUrl.set('id', ytfetcherId);
            forwardUrl.set('url', url);
            subscriber.next(new Response<string>(0,
              ServerService.buildUrl('youtube/get?') + forwardUrl.toString()));
          } else {
            const urlParser = new URL(url);
            subscriber.next(new Response<string>(0, urlParser.pathname + urlParser.search));
          }
        })
        .catch(reason => {
          subscriber.next(new Response<string>(JSON.parse(reason.error).statuscode));
        });
    });
  }

  public search(query: string): Observable<Response<Youtube[]>> {
    return new Observable<Response<Youtube[]>>(subscriber => {
      this.server.post<Youtube[]>('youtube/search', {
        searchquery: query,
        apikey: this.server.apiKey
      })
        .forEach((response: HttpResponse<Youtube[]>) => {
          subscriber.next(new Response<Youtube[]>(0, <Youtube[]>response.body));
        })
        .catch(reason => {
          subscriber.next(new Response<Youtube[]>(reason.error.statuscode));
        });
    });
  }

  public charts(): Observable<Response<Youtube[]>> {
    return new Observable<Response<Youtube[]>>(subscriber => {
      this.server.post<Youtube[]>('youtube/getcharts', {
        apikey: this.server.apiKey
      })
        .forEach((response: HttpResponse<Youtube[]>) => {
          subscriber.next(new Response<Youtube[]>(0, <Youtube[]>response.body));
        })
        .catch(reason => {
          subscriber.next(new Response<Youtube[]>(reason.error.statuscode));
        });
    });
  }

  info(id: string): Observable<Response<Youtube>> {
    return new Observable<Response<Youtube>>(subscriber => {
      this.server.post<Youtube>('youtube/getinfo', {
        apikey: this.server.apiKey,
        id: id
      })
        .forEach((response: HttpResponse<Youtube>) => {
          subscriber.next(new Response<Youtube>(0, response.body));
        })
        .catch(reason => {
          subscriber.next(new Response<Youtube>(reason.error.statuscode));
        });
    });
  }

}

export class PlaylistServer {
  constructor(private server: ServerService) {
  }

  public list(): Observable<Response<Playlist[]>> {
    return new Observable<Response<Playlist[]>>(subscriber => {
      this.server.post<Playlist[]>('users/playlist/list', {
        apikey: this.server.apiKey
      })
        .forEach((response: HttpResponse<Playlist[]>) => {
          subscriber.next(new Response<Playlist[]>(0, response.body));
        })
        .catch(reason => {
          subscriber.next(new Response<Playlist[]>(reason.error.statusCode));
        });
    });
  }

  public create(name: string): Observable<Response> {
    return new Observable<Response>(subscriber => {
      this.server.post('users/playlist/create', {
        apikey: this.server.apiKey,
        name: name
      })
        .forEach(() => {
          subscriber.next(new Response<Playlist[]>(0));
        })
        .catch(reason => {
          subscriber.next(new Response<Playlist[]>(reason.error.statusCode));
        });
    });
  }

  public setPublic(name: string, isPublic: boolean): Observable<Response> {
    return new Observable<Response>(subscriber => {
      this.server.post('users/playlist/setpublic', {
        apikey: this.server.apiKey,
        name: name,
        public: isPublic
      })
        .forEach(() => {
          subscriber.next(new Response(0));
        })
        .catch(reason => {
          subscriber.next(new Response(reason.error.statusCode));
        });
    });
  }

  public delete(name: string): Observable<Response> {
    return new Observable<Response>(subscriber => {
      this.server.post('users/playlist/delete', {
        apikey: this.server.apiKey,
        name: name
      })
        .forEach(() => {
          subscriber.next(new Response(0));
        })
        .catch(reason => {
          subscriber.next(new Response(reason.error.statusCode));
        });
    });
  }

  public addId(playlist: string, id: string): Observable<Response> {
    return new Observable<Response>(subscriber => {
      this.server.post('users/playlist/addid', {
        apikey: this.server.apiKey,
        name: playlist,
        id: id
      })
        .forEach(() => {
          subscriber.next(new Response(0));
        })
        .catch(reason => {
          subscriber.next(new Response(reason.error.statusCode));
        });
    });
  }

  public deleteId(playlist: string, id: string): Observable<Response> {
    return new Observable<Response>(subscriber => {
      this.server.post('users/playlist/deleteid', {
        apikey: this.server.apiKey,
        name: playlist,
        id: id
      })
        .forEach(() => {
          subscriber.next(new Response(0));
        })
        .catch(reason => {
          subscriber.next(new Response(reason.error.statusCode));
        });
    });
  }

  public listIds(name: string): Observable<Response<string[]>> {
    return new Observable<Response<string[]>>(subscriber => {
      this.server.post<string[]>('users/playlist/listids', {
        apikey: this.server.apiKey,
        name: name
      })
        .forEach((response: HttpResponse<string[]>) => {
          subscriber.next(new Response<string[]>(0, response.body));
        })
        .catch(reason => {
          subscriber.next(new Response(reason.error.statusCode));
        });
    });
  }

  public setIds(name: string, ids: string[]): Observable<Response> {
    return new Observable<Response>(subscriber => {
      this.server.post('users/playlist/setids', {
        apikey: this.server.apiKey,
        name: name,
        ids: ids
      })
        .forEach(() => {
          subscriber.next(new Response(0));
        })
        .catch(reason => {
          subscriber.next(new Response(reason.error.statusCode));
        });
    });
  }

}

export class Response<T = any> {
  constructor(public status: number, public body: T = null) {
  }
}

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  public user: UserServer;
  public youtube: YoutubeServer;
  public playlist: PlaylistServer;

  public apiKey = '';

  constructor(private http: HttpClient) {
    this.user = new UserServer(this);
    this.youtube = new YoutubeServer(this);
    this.playlist = new PlaylistServer(this);
  }

  static buildUrl(path: string): string {
    return '/api/v1/' + path;
  }

  post<T = any>(path: string, body: any, responseType: any = 'json'): Observable<HttpResponse<T>> {
    return this.http.post<T>(ServerService.buildUrl(path), body, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response',
      responseType: responseType
    });
  }

}
