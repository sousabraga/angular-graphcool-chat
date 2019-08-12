import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private API_URL = 'https://api.graph.cool/simple/v1/cjz2vgfcp672201734p37zaqz';

  constructor(
    private http: HttpClient
  ) {
    this.createUser('Ivo Fernandes', 'ivofernandes@gmail.com', '123456');
    this.allUsers();
  }

  allUsers(): void {
    const body = {
      query: `
        query {
          allUsers {
            id
            name
            email
          }
        }
      `
    };

    this.http.post(this.API_URL, body)
      .subscribe(response => console.log(`Query: ${JSON.stringify(response)}`));
  }

  createUser(name: string, email: string, password: string): void {
    const body = {
      query: `
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
    };

    this.http.post(this.API_URL, body).subscribe(response => console.log(`Mutation: ${JSON.stringify(response)}`));
  }

}
