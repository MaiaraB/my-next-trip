import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { TravelPlannerService } from './../../shared/travel-planner.service';
import { FlightResult } from '../../models/flight-result.model';

@Component({
  selector: 'app-search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.css']
})
export class SearchResultListComponent implements OnInit {

  currentFlights: FlightResult[];
  flights: FlightResult[];
  subscription: Subscription;
  isFlightsEmpty: boolean;

  constructor(private travelPlannerService: TravelPlannerService) {}

  ngOnInit() {
    this.isFlightsEmpty = true;
    this.currentFlights = [];
    this.subscription = this.travelPlannerService.resultsChanged
      .subscribe(
        (flights: FlightResult[]) => {
          this.flights = flights;
          this.currentFlights = this.flights.slice(0, (this.currentFlights.length==0)?5:this.currentFlights.length);
          if (this.flights.length == 0) {
            this.isFlightsEmpty = true;
          } else {
            this.isFlightsEmpty = false;
          }
        }
      );
    this.flights = this.travelPlannerService.getResults();
    this.currentFlights = this.flights.slice(0, 5);
    if (this.flights.length > 0) {
      this.isFlightsEmpty = false;
    }
    // this.flights = this.travelPlannerService.getFlights();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onLoadMore() {
    this.currentFlights = this.flights.slice(0, this.currentFlights.length+5);
  }

}
