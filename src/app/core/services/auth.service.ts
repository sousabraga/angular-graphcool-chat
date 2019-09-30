import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { Apollo } from 'apollo-angular';

import { AUTHENTICATE_USER_MUTATION, SIGNUP_USER_MUTATION } from './auth.graphql';
import { StorageKeys } from 'src/app/storage.keys';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  redirectUrl: string;
  private authenticationObserver = new ReplaySubject<boolean>(1);

  constructor(
    private apollo: Apollo
  ) {
    this.isAuthenticated.subscribe(isAuthenticated => console.log('AuthState', isAuthenticated));
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

  private setAuthState(authData: {token: string, isAuthenticated: boolean}): void {
    if (authData.isAuthenticated) {
      window.localStorage.setItem(StorageKeys.AUTH_TOKEN, authData.token);
    }

    this.authenticationObserver.next(authData.isAuthenticated);
  }

}
