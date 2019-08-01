import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from './../../environments/environment';

import { Country } from './country.model';
import { Currency } from './currency.model';
import { TravelPlannerService } from './travel-planner.service';
import { SkyscannerPlace } from './skyscanner-place.model';

@Injectable({providedIn: 'root'})
export class SkyscannerService {
  private url = 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/reference/v1.0';
  private urlSearchPlace = 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0';
  private host_key = 'X-RapidAPI-Host';
  private host_value = environment.skyscannerAPIHost;
  private authentication_key = 'X-RapidAPI-Key';
  private authentication_value = environment.skyscannerAPIKey;

  constructor(private http: HttpClient, private travelPlannerService: TravelPlannerService) {}

  fetchCountries() {
    return this.http
      .get<Country[]>(this.url + '/countries/en-US', {
        headers: new HttpHeaders({
          [this.host_key]: this.host_value, 
          [this.authentication_key]: this.authentication_value
        })
      })
      .pipe(map((responseData: any) => {
        return responseData.Countries;
      }));
  }

  fetchCurrencies() {
    return this.http
      .get<Currency[]>(this.url + '/currencies', {
        headers: new HttpHeaders({
          [this.host_key]: this.host_value, 
          [this.authentication_key]: this.authentication_value
        })
      })
      .pipe(map((responseData: any) => {
        return responseData.Currencies;
      }));
  }

  fetchPlaces(query: string) {
    return this.http
      .get<SkyscannerPlace[]>(
        this.urlSearchPlace + '/' + 
        this.travelPlannerService.getCurrentCountry() + '/' + 
        this.travelPlannerService.getCurrentCurrency() + '/' + 
        navigator.language + '/?query=' + query, {
        headers: new HttpHeaders({
          [this.host_key]: this.host_value, 
          [this.authentication_key]: this.authentication_value
        })
      })
      .pipe(map((responseData: any) => {
        return responseData.Places;
      }));
  }
  
}