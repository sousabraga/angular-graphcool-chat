import { Component } from '@angular/core';

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    private apollo: Apollo
  ) {
    this.createUser('Cesar Barbosa', 'cesar@gmail.com', '123456');
    this.allUsers();
  }

  allUsers(): void {
    this.apollo.query({
      query: gql`
        query {
          allUsers {
            id
            name
            email
          }
        }
      `
    }).subscribe(response => console.log('Query: ', response));
  }

  createUser(name: string, email: string, password: string): void {
    this.apollo.mutate({
      mutation: gql`
        mutation createNewUser($name: String!, $email: String!, $password: String!) {
          createUser(name: $name, email: $email, password: $password) {
            id
            name
            email
          }
        }
      `,
      variables: {
        name,
        email,
        password
      }
    }).subscribe(response => console.log('Mutation: ', response));
  }

}
