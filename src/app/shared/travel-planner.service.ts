import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ReplaySubject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { SearchParams } from '../models/search-params.model';
import { FlightResult } from '../models/flight-result.model';
import { Country } from '../models/country.model';
import { map } from 'rxjs/operators';
import { Currency } from '../models/currency.model';
import { SkyscannerPlace } from '../models/skyscanner-place.model';

@Injectable({providedIn: 'root'})
export class TravelPlannerService {

  lastSearch: SearchParams;
  lastResults: FlightResult[] = [];
  resultsChanged = new ReplaySubject<FlightResult[]>();
  private currentCountry = 'UK';
  private currentCurrency = 'GBP';

   private progressSource = new ReplaySubject<number>(0);
   progress = this.progressSource.asObservable();

  protected basePath = environment.travelPlannerAPI;
  protected defaultHeaders = new HttpHeaders();

  constructor(protected httpClient: HttpClient,
              private ngbDateAdapter: NgbDateParserFormatter) {}

  setSearchParams(search: SearchParams) {
    this.lastSearch = search;
  }

  getSearchParams() {
    return this.lastSearch;
  }

  fetchCountries() {
    return this.httpClient
      .get<Country[]>(`${this.basePath}/countries?locale=${navigator.language}`);
  }

  fetchCurrencies() {
    return this.httpClient
      .get<Currency[]>(`${this.basePath}/currencies`);
  }

  fetchPlaces(query: string) {
    return this.httpClient
      .get<SkyscannerPlace[]>(`${this.basePath}/queryPlace?country=${this.getCurrentCountry()}&currency=${this.getCurrentCurrency()}&locale=${navigator.language}&query=${query}`);
  }

  getFlights() {
    this.progressSource.next(0);
    this.changeResults([]);
    let params = 'origin=' + this.lastSearch.originID +
                  '&destination=' + this.lastSearch.destinationID +
                  '&outboundWeekDay=' + this.lastSearch.startingDay +
                  '&locale=' + navigator.language +
                  '&country=' + this.currentCountry +
                  '&currency=' + this.currentCurrency +
                  '&adults=' + this.lastSearch.adults +
                  '&cabinClass=' + this.lastSearch.cabinClass +
                  '&fromDate=' + this.ngbDateAdapter.format(this.lastSearch.fromDate) +
                  '&toDate=' + this.ngbDateAdapter.format(this.lastSearch.toDate);
    if (this.lastSearch.roundTrip) {
      params += "&duration=" + this.lastSearch.duration;
    }
    if (this.lastSearch.children > 0) {
      params += '&children=' + this.lastSearch.children;
    }
    if (this.lastSearch.infants > 0) {
      params += '&infants' + this.lastSearch.infants;
    }

    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${this.basePath}/flights?${params}`, true);

    let lastIndex = -1;
    let responseSize = 0;
    let partIndex = 0;
    let that = this;
    let results: FlightResult[] = [];

    xhr.onprogress = function(pe) {
      let index = that.searchEscape(xhr.responseText, lastIndex);
      // case for the first chunk with the response size
      if (index != lastIndex && lastIndex == -1) {
        responseSize = parseInt(xhr.responseText.substring(lastIndex+1, index))
        lastIndex = index;
        index = that.searchEscape(xhr.responseText, lastIndex);
      }
      // case for the chunks with the results
      if (index != lastIndex) {
        partIndex++;
        results.push(...JSON.parse(xhr.responseText.substring(lastIndex+1, index)));
        that.changeResults(results);
        that.progressSource.next(partIndex/responseSize*100);
      }
      lastIndex = index;
    }

    xhr.onload = function(pe) {
      if (xhr.responseText === 'SearchIntervalTooBig') {

      }
      that.progressSource.next(0);
      that.lastSearch = null;
    }

    xhr.send();

  }

  /**
   * Returns the next appearance of escape after index in the str
   * @param str
   * @param index
   */
  private searchEscape(str: string, index: number) : number {
    const esc = '<';
    let next = index;
    for (let i = index+1; i < (str.length-esc.length+1); i++) {
      let found = true;
      for (let j = 0; j < esc.length; j++) {
        if (str[i+j] != esc[j]) {
          found = false;
          break;
        }
      }
      if (found) {
        next = i;
        break;
      }
    }
    return next;
  }

  changeResults(results: FlightResult[]) {
    this.lastResults = results;
    localStorage.setItem("lastResults", JSON.stringify(this.lastResults));
    this.resultsChanged.next(this.lastResults);
  }

  getResults(): FlightResult[] {
    if (this.lastResults == null || this.lastResults.length == 0) {
      this.lastResults = JSON.parse(localStorage.getItem('lastResults'));
    }
    return this.lastResults;
  }

  changeCountry(countryCode: string) {
    this.currentCountry = countryCode;
  }

  changeCurrency(currencyCode: string) {
    this.currentCurrency = currencyCode;
  }

  getCurrentCountry() {
    return this.currentCountry;
  }

  getCurrentCurrency() {
    return this.currentCurrency;
  }

  resetProgress() {
    this.progressSource.next(0);
  }
}