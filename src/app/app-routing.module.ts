import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlightSearchComponent } from './flight-search/flight-search.component';
import { SearchResultComponent } from './search-result/search-result.component';

const routes: Routes = [
  { path: '', redirectTo: '/flight-search', pathMatch: 'full' },
  { path: 'flight-search', component: FlightSearchComponent },
  { path: 'flight-result', component: SearchResultComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
