import { Injectable } from '@angular/core';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

import { Apollo } from 'apollo-angular';

import { AUTHENTICATE_USER_MUTATION, SIGNUP_USER_MUTATION } from './auth.graphql';

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
      tap(res => this.setAuthState(res !== null)),
      catchError(err => {
        this.setAuthState(false);
        return throwError(err);
      })
    );
  }

  signupUser(variables: {name: string, email: string, password: string}): Observable<{id: string, token: string}> {
    return this.apollo.mutate({
      mutation: SIGNUP_USER_MUTATION,
      variables
    }).pipe(
      tap(res => this.setAuthState(res !== null)),
      catchError(err => {
        this.setAuthState(false);
        return throwError(err);
      })
    );
  }

  private setAuthState(isAuthenticated: boolean): void {
    this.authenticationObserver.next(isAuthenticated);
  }

}
