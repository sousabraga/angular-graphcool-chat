import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';

import { Apollo } from 'apollo-angular';

import { AUTHENTICATE_USER_MUTATION, SIGNUP_USER_MUTATION, LOGGED_IN_USER_QUERY, LoggedInUserQuery } from './auth.graphql';
import { StorageKeys } from 'src/app/storage.keys';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  redirectUrl: string;
  keepSigned: boolean;
  private authenticationObserver = new ReplaySubject<boolean>(1);

  constructor(
    private apollo: Apollo
  ) {
    this.isAuthenticated.subscribe(isAuthenticated => console.log('AuthState', isAuthenticated));
    this.init();

    this.validateToken().subscribe(
      res => console.log('Res', res),
      err => console.log('Err', err)
    );
  }

  init(): void {
    this.keepSigned = JSON.parse(window.localStorage.getItem(StorageKeys.KEEP_SIGNED));
  }

  get isAuthenticated(): Observable<boolean> {
    return this.authenticationObserver.asObservable();
  }

  signinUser(variables: {email: string, password: string}): Observable<{id: string, token: string}> {
    return this.apollo.mutate({
      mutation: AUTHENTICATE_USER_MUTATION,
      variables
    }).pipe(
      tap(res => {
        const authenticateUser = res.data.authenticateUser;
        this.setAuthState({ token: authenticateUser && authenticateUser.token, isAuthenticated: res !== null });
      }),
      catchError(err => {
        this.setAuthState({ token: null, isAuthenticated: false });
        return throwError(err);
      })
    );
  }

  signupUser(variables: {name: string, email: string, password: string}): Observable<{id: string, token: string}> {
    return this.apollo.mutate({
      mutation: SIGNUP_USER_MUTATION,
      variables
    }).pipe(
      tap(res => {
        const authenticateUser = res.data.authenticateUser;
        this.setAuthState({ token: authenticateUser && authenticateUser.token, isAuthenticated: res !== null });
      }),
      catchError(err => {
        this.setAuthState({ token: null, isAuthenticated: false });
        return throwError(err);
      })
    );
  }

  toggleKeepSigned(): void {
    this.keepSigned = !this.keepSigned;
    window.localStorage.setItem(StorageKeys.KEEP_SIGNED, this.keepSigned.toString());
  }

  private validateToken(): Observable<{id: string, isAuthenticated: boolean}> {
    return this.apollo.query<LoggedInUserQuery>({
      query: LOGGED_IN_USER_QUERY
    }).pipe(
      map(res => {
        const user = res.data.loggedInUser;

        return {
          id: user && user.id,
          isAuthenticated: user !== null
        };
      })
    );
  }

  private setAuthState(authData: {token: string, isAuthenticated: boolean}): void {
    if (authData.isAuthenticated) {
      window.localStorage.setItem(StorageKeys.AUTH_TOKEN, authData.token);
    }

    this.authenticationObserver.next(authData.isAuthenticated);
  }

}
