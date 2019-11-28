import { SearchResultListComponent } from './search-result/search-result-list/search-result-list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlightSearchComponent } from './flight-search/flight-search.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ApiResponseErrorComponent } from './api-response-error/api-response-error.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/flight-search', pathMatch: 'full' },
  { path: 'flight-search', component: FlightSearchComponent },
  { path: 'search-result', component: SearchResultComponent, children: 
    [
      { path: '', component: SearchResultListComponent },
      { path: 'api-response-error', component: ApiResponseErrorComponent }
    ]
  },
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
