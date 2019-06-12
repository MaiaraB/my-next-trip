import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Country } from './country.model';
import { Currency } from './currency.model';

@Injectable({providedIn: 'root'})
export class SkyscannerService {
  private url = 'https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/reference/v1.0';
  private host_key = 'X-RapidAPI-Host';
  private host_value = 'skyscanner-skyscanner-flight-search-v1.p.rapidapi.com';
  private authentication_key = 'X-RapidAPI-Key';
  private authentication_value = '4d135256f6msha2ac48e92c97ee4p123afejsnd4237d1df729';

  constructor(private http: HttpClient) {}

  fetchCountries() {
    return this.http
      .get<Country[]>(this.url + '/countries/en-US', {
        headers: new HttpHeaders({
          [this.host_key]: this.host_value, 
          [this.authentication_key]: this.authentication_value
        })
      })
      .pipe(map((responseData: any) => {
        return responseData.Countries
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
        return responseData.Currencies
      }));
  }

}