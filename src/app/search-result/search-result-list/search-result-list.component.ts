import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';

import { TravelPlannerService } from './../../shared/travel-planner.service';
import { FlightResult } from './../../shared/flight-result.model';

@Component({
  selector: 'app-search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.css']
})
export class SearchResultListComponent implements OnInit {

  flights: FlightResult[];
  subscription: Subscription;

  constructor(private travelPlannerService: TravelPlannerService) { 
    // this.flights = [
    //   new FlightResult(
    //     [new Agent("Expedia", "https://s1.apideeplink.com/images/websites/fnus.png", 425.33, "")],
    //     new Leg(
    //       new Date("September 10, 2019 10:15:00"), 
    //       new Date("September 10, 2019 14:20:00"), 
    //       245, 
    //       [new Place("Spain", "SPN")], 
    //       new Place("London", "LHR"),
    //       new Place("Portugal", "PTR"),
    //       [new Carrier("British Airlines", "https://s1.apideeplink.com/images/websites/fnus.png")], 
    //       [
    //         new Segment(
    //           new Place("London", "LHR"), 
    //           new Place("Milan", "SPN"), 
    //           new Date("September 10, 2019 10:15:00"),
    //           new Date("September 10, 2019 12:15:00"),
    //           120
    //           ),
    //           new Segment(
    //             new Place("Spain", "SPN"), 
    //             new Place("Lisbon", "PTR"), 
    //           new Date("September 15, 2019 13:20:00"),
    //           new Date("September 15, 2019 14:20:00"),
    //           60
    //         )
    //       ]
    //     ),
    //     new Leg(
    //       new Date("September 15, 2019 12:15:00"), 
    //       new Date("September 15, 2019 14:20:00"), 
    //       125, 
    //       [], 
    //       new Place("Lisbon", "PTR"),
    //       new Place("London", "LHR"),
    //       [new Carrier("British Airlines", "https://s1.apideeplink.com/images/websites/fnus.png")], 
    //       [
    //         new Segment(
    //           new Place("Lisbon", "PTR"), 
    //           new Place("London", "LHR"),
    //           new Date("September 15, 2019 12:15:00"),
    //           new Date("September 15, 2019 14:20:00"),
    //           125
    //         )
    //       ]
    //     )
    //   ),
    //   new FlightResult(
    //     [new Agent("Expedia", "https://s1.apideeplink.com/images/websites/fnus.png", 425.33, "")],
    //     new Leg(
    //       new Date("October 10, 2019 10:15:00"), 
    //       new Date("October 10, 2019 14:20:00"), 
    //       245, 
    //       [new Place("Spain", "SPN")], 
    //       new Place("London", "LHR"),
    //       new Place("Portugal", "PTR"),
    //       [new Carrier("Vingin Atlantic", "https://s1.apideeplink.com/images/websites/fnus.png")], 
    //       [
    //         new Segment(
    //           new Place("London", "LHR"), 
    //           new Place("Milan", "SPN"), 
    //           new Date("September 10, 2019 10:15:00"),
    //           new Date("September 10, 2019 12:15:00"),
    //           120
    //           ),
    //           new Segment(
    //             new Place("Spain", "SPN"), 
    //             new Place("Lisbon", "PTR"), 
    //           new Date("September 15, 2019 13:20:00"),
    //           new Date("September 15, 2019 14:20:00"),
    //           60
    //         )
    //       ]
    //     ),
    //     new Leg(
    //       new Date("October 15, 2019 12:15:00"), 
    //       new Date("October 15, 2019 14:20:00"), 
    //       125, 
    //       [], 
    //       new Place("Lisbon", "PTR"),
    //       new Place("London", "LHR"),
    //       [new Carrier("Virgin Atlantic", "https://s1.apideeplink.com/images/websites/fnus.png")], 
    //       [
    //         new Segment(
    //           new Place("Lisbon", "PTR"), 
    //           new Place("London", "LHR"),
    //           new Date("September 15, 2019 12:15:00"),
    //           new Date("September 15, 2019 14:20:00"),
    //           125
    //         )
    //       ]
    //     )
    //   ),
    // ]
  }

  ngOnInit() {
    this.subscription = this.travelPlannerService.resultsChanged
      .subscribe(
        (flights: FlightResult[]) => {
          this.flights = flights;
        }
      );
    this.flights = this.travelPlannerService.getResults();
    // this.flights = this.travelPlannerService.getFlights();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
