import { Injectable } from "@angular/core";
import { HttpClient, HttpRequest, HttpEvent, HttpEventType, HttpDownloadProgressEvent } from '@angular/common/http';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { map, tap, concatMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { SearchParams } from '../models/search-params.model';
import { FlightResult } from '../models/flight-result.model';
import { Country } from '../models/country.model';
import { Currency } from '../models/currency.model';
import { SkyscannerPlace } from '../models/skyscanner-place.model';

@Injectable({providedIn: 'root'})
export class TravelPlannerService {

  private lastSearch: SearchParams;
  private lastResults: FlightResult[] = []; 
  private currentCountry = 'UK';
  private currentCurrency = 'GBP';
  private basePath = environment.travelPlannerAPI;

  resultsChanged = new BehaviorSubject<FlightResult[]>([]);
  resultsFinished = new Subject<boolean>();
  responseError = new Subject<boolean>();
  progress = new BehaviorSubject<number>(0);

  constructor(protected httpClient: HttpClient,
              private ngbDateAdapter: NgbDateParserFormatter) {}

  setSearchParams(search: SearchParams) {
    this.lastSearch = search;
  }

  getSearchParams() : SearchParams {
    return this.lastSearch;
  }

  fetchCountries() : Observable<Country[]> {
    return this.httpClient
      .get<Country[]>(`${this.basePath}/countries?locale=${navigator.language}`);
  }

  fetchCurrencies() : Observable<Currency[]> {
    return this.httpClient
      .get<Currency[]>(`${this.basePath}/currencies`);
  }

  fetchPlaces(query: string) : Observable<SkyscannerPlace[]> {
    return this.httpClient
      .get<SkyscannerPlace[]>(`${this.basePath}/queryPlace?country=${this.getCurrentCountry()}&currency=${this.getCurrentCurrency()}&locale=${navigator.language}&query=${query}`);
  }

  getFlights() {
    this.progress.next(0);
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

    let responseSize = 0;
    let chunkIndex = 0;
    let results: FlightResult[] = [];

    let processChunkedResponse = async (response: Response) => {
      if (!response.ok) {
        this.responseError.next(true);
        return;
      }

      let text = '';
      let reader = response.body.getReader()
      let decoder = new TextDecoder();
  
      let appendChunks = (result: any) => {
        let chunk = decoder.decode(result.value || new Uint8Array, {stream: !result.done});
        text += chunk;
        let index = this.searchEscape(text, 0);
        
        if (index != 0) {
          const newChunk = text.substring(0, index);
          text = text.substring(index+1);
          if (newChunk.length < 3) { // case for the first chunk with the response size (number of chunks)
            responseSize = parseInt(newChunk);
          } else { // case for the chunks with the results
            chunkIndex++;
            if (newChunk !== 'null') {
              results.push(...JSON.parse(newChunk));
              this.changeResults(results);
              this.progress.next(chunkIndex/responseSize*100);
            }
          }
        }

        if (result.done) {
          return text;
        } else {
          return reader.read().then(appendChunks);;
        }
      }
      const result = await reader.read();
      return appendChunks(result);
    }

    let onChunkedResponseComplete = (result: any) => {
      this.resetProgress();
      this.lastSearch = null;
      this.resultsFinished.next(true);
    }

    fetch(`${this.basePath}/flights?${params}`)
      .then(processChunkedResponse)
      .then(onChunkedResponseComplete)
      .catch(err => console.error(err));

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
    this.progress.next(0);
  }
}