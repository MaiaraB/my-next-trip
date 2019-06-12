import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { SearchResultListComponent } from './search-result/search-result-list/search-result-list.component';
import { SearchResultItemComponent } from './search-result/search-result-list/search-result-item/search-result-item.component';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightSearchFormComponent } from './flight-search/flight-search-form/flight-search-form.component';
import { DropdownDirective } from './shared/dropdown.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchResultComponent,
    SearchResultListComponent,
    SearchResultItemComponent,
    FlightSearchComponent,
    FlightSearchFormComponent,
    DropdownDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
