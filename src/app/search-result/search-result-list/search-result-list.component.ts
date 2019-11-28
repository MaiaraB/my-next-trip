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

  currentFlights: FlightResult[];
  flights: FlightResult[];
  flightsSubscription: Subscription;
  errorSubscription: Subscription;
  isLoading: boolean;
  hasMore = true;
  sortingOptions = ["Cheapest", "Earliest"];
  sortedBy = "Cheapest";
  resultsPluralMapping: 
    {[k: string]: string} = {
      '=1' :  '1 result',
      'other' : '# results'
    };

  constructor(private travelPlannerService: TravelPlannerService,
              private router: Router) {}

  ngOnInit() {
    this.isLoading = true;
    this.currentFlights = [];
    this.flightsSubscription = this.travelPlannerService.resultsChanged
      .subscribe(
        (flights: FlightResult[]) => {
          this.flights = this.sortResults(flights);
          this.currentFlights = this.flights.slice(0, (this.currentFlights.length==0)?10:this.currentFlights.length);
          if (this.flights.length == 0) {
            this.isLoading = true;
          } else {
            this.isLoading = false;
          }
        }
      );
    this.flights = this.sortResults(this.travelPlannerService.getResults());
    this.currentFlights = this.flights.slice(0, 10);
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
  }

  onLoadMore() {
    this.currentFlights = this.flights.slice(0, this.currentFlights.length+10);
    if (this.currentFlights.length === this.flights.length) {
      this.hasMore = false;
    }
  }

  onChangeSortedBy(sortedBy: string) {
    this.sortedBy = sortedBy;
    this.sortResults(this.flights);
    this.currentFlights = this.flights.slice(0, this.currentFlights.length);
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
