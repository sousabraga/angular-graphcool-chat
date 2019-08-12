import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { ApolloModule, Apollo } from 'apollo-angular';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
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

      this.apollo.create({
        link: http,
        cache: new InMemoryCache(),
        connectToDevTools: !environment.production
      });
    }

}
