import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ApolloModule, Apollo } from 'apollo-angular';
import { ApolloLink } from 'apollo-link';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { environment } from 'src/environments/environment.prod';

@NgModule({
  imports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class ApolloConfigModule {

    constructor(
      private apollo: Apollo,
      private httpLink: HttpLink
    ) {
      const uri = 'https://api.graph.cool/simple/v1/cjz2vgfcp672201734p37zaqz';
      const http = this.httpLink.create({ uri });

      const linkError = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
          );
        }

        if (networkError) {
          console.log(`[Network error]: ${networkError}`);
        }
      });

      this.apollo.create({
        link: ApolloLink.from([linkError, http]),
        cache: new InMemoryCache(),
        connectToDevTools: !environment.production
      });
    }

}
