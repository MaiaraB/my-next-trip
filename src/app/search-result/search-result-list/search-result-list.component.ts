import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { TravelPlannerService } from './../../shared/travel-planner.service';
import { FlightResult } from '../../models/flight-result.model';

@Component({
  selector: 'app-search-result-list',
  host: {
    class: 'd-flex flex-grow-1'
  },
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.css']
})
export class SearchResultListComponent implements OnInit {

  currentShowingFlights: FlightResult[];
  currentShowingSize = 10;
  flights: FlightResult[];
  flightsSubscription: Subscription;
  errorSubscription: Subscription;
  finishedResponseSubscription: Subscription;
  isLoading: boolean;
  hasMore: boolean;
  sortingOptions = ["Cheapest", "Earliest"];
  sortedBy = "Cheapest";
  resultsPluralMapping: 
    {[k: string]: string} = {
      '=0' : 'Sorry, no results found',
      '=1' :  '1 result',
      'other' : '# results'
    };

  constructor(private travelPlannerService: TravelPlannerService,
              private router: Router) {}

  ngOnInit() {
    this.isLoading = true;
    this.hasMore = false;
    this.currentShowingFlights = [];
    this.flightsSubscription = this.travelPlannerService.resultsChanged
      .subscribe(
        (flights: FlightResult[]) => {
          this.flights = this.sortResults(flights);
          this.currentShowingFlights = this.flights.slice(0, this.currentShowingSize);
          
          // start to load again if didn't restart component (when user does the search in the results page)
          if (this.flights.length === 0) {
            this.isLoading = true;
            this.hasMore = false;
          } else {
            this.isLoading = false;
          }
          if (this.currentShowingSize < this.flights.length) {
            this.hasMore = true;
          }
        }
      );

    this.finishedResponseSubscription = this.travelPlannerService.resultsFinished
      .subscribe(
        () => {
          this.isLoading = false;
        }
      );
    
    this.flights = this.sortResults(this.travelPlannerService.getResults());
    this.currentShowingFlights = this.flights.slice(0, this.currentShowingSize);
    if (this.flights.length > 0) {
      this.isLoading = false;
    }

    this.errorSubscription = this.travelPlannerService.responseError.subscribe(
      (responseError: boolean) => {
        if (responseError) {
          this.router.navigate(['api-response-error']);
        }
      }
    );
  }

  ngOnDestroy() {
    this.flightsSubscription.unsubscribe();
    this.finishedResponseSubscription.unsubscribe();
    this.errorSubscription.unsubscribe();
  }

  onLoadMore() {
    this.currentShowingSize += 10;
    this.currentShowingFlights = this.flights.slice(0, this.currentShowingSize);
    if (this.currentShowingSize === this.flights.length) {
      this.hasMore = false;
    }
  }

  onChangeSortedBy(sortedBy: string) {
    this.sortedBy = sortedBy;
    this.sortResults(this.flights);
    this.currentShowingFlights = this.flights.slice(0, this.currentShowingFlights.length);
  } 

  private sortResults(results: FlightResult[]): FlightResult[] {
    if (results != null) {
      switch(this.sortedBy) {
        case "Cheapest":
          results.sort((a, b) => {
            if (a.AgentsInfo[0].Price < b.AgentsInfo[0].Price) {
              return -1;
            }
            if (a.AgentsInfo[0].Price > b.AgentsInfo[0].Price) {
              return 1;
            }
            return 0;
          });
          break;
        case "Earliest":
          results.sort((a, b) => {
            if (a.OutboundLeg.Departure < b.OutboundLeg.Departure) {
              return -1;
            }
            if (a.OutboundLeg.Departure > b.OutboundLeg.Departure) {
              return 1;
            }
            return 0;
          })
          break;
      }
      
    }
    return results;
  }

}
