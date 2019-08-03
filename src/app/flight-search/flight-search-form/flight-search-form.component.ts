import { SearchParams } from '../../models/search-params.model';
import { SkyscannerPlace } from '../../models/skyscanner-place.model';
import { Component, OnInit, Input, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
// import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { TravelPlannerService } from './../../shared/travel-planner.service';
import { FlightResult } from 'src/app/models/flight-result.model';
import { SkyscannerService } from 'src/app/shared/skyscanner.service';

@Component({
  selector: 'app-flight-search-form',
  templateUrl: './flight-search-form.component.html',
  styleUrls: ['./flight-search-form.component.css']
})
export class FlightSearchFormComponent implements OnInit, OnDestroy, AfterViewChecked {
  // model: NgbDateStruct;
  @ViewChild('f', { static: false }) searchForm: NgForm;
  @Input() vertical: boolean;
  defaultStartingDay = '5';
  defaultDuration = '2';
  selectedRoundTrip: boolean = true;
  selectedOneWay: boolean = false;

  originTooSmall = true;
  destinationTooSmall = true;
  originSuggestions: SkyscannerPlace[];
  destinationSuggestions: SkyscannerPlace[];

  originId: string;
  destinationId: string;

  constructor(private travelPlannerService: TravelPlannerService, 
              private skyscannerService: SkyscannerService,
              private router: Router) { }

  ngOnInit() {
    this.originSuggestions = [];
    this.destinationSuggestions = [];
    if(window.innerWidth < 768) {
      this.vertical = true;
    }
  }
  
  ngAfterViewChecked() {
    const searchParams = this.travelPlannerService.getSearchParams()
    if (searchParams != null) {
      this.searchForm.setValue({
        origin: searchParams.origin,
        destination: searchParams.destination,
        startingDay: searchParams.startingDay,
        duration: searchParams.duration
      })
      this.originId = searchParams.originID;
      this.destinationId = searchParams.destinationID;
    }
  }

  arrayDurationDays(n: number): any[] {
    return [...Array(n).keys()];
  }

  onSubmit() {
    if (this.originId == null) {
      this.searchForm.controls['origin'].setErrors({'incorrect': true});
    }
    else if (this.destinationId == null) {
      this.searchForm.controls['destination'].setErrors({'incorrect': true});
    } else {
      this.travelPlannerService.setSearchParams(
        new SearchParams(
          this.selectedRoundTrip,
          this.searchForm.controls['origin'].value,
          this.originId,
          this.searchForm.controls['destination'].value,
          this.destinationId,
          this.searchForm.value.startingDay, 
          this.searchForm.value.duration
        )
      );

      this.travelPlannerService.getFlights();
        // .subscribe((results: FlightResult[]) => {
        //   console.log(results);
        //   // this.travelPlannerService.setResults(results);
        //   // this.travelPlannerService.resultsChanged.next(results);
        //   this.travelPlannerService.changeResults(results);
        //   // this.router.navigate(['/flight-result']);
        // });
      this.travelPlannerService.changeResults([]);
      this.router.navigate(['/flight-result']);
    }
  }

  onClickRoundTrip() {
    this.selectedRoundTrip = true;
    this.selectedOneWay = false;
  }

  onClickOneWay() {
    this.selectedOneWay = true;
    this.selectedRoundTrip = false;
  }

  onOriginChange(originValue : string ) {  
    if (originValue.length < 3) {
      this.originTooSmall = true;
    } else {
      this.originTooSmall = false;
      this.skyscannerService.fetchPlaces(originValue)
        .subscribe((places: SkyscannerPlace[]) => this.originSuggestions = places)
    }
  }

  onDestinationChange(destionationValue : string ) {  
    if (destionationValue.length < 3) {
      this.destinationTooSmall = true;
    } else {
      this.destinationTooSmall = false
      this.skyscannerService.fetchPlaces(destionationValue)
        .subscribe((places: SkyscannerPlace[]) => this.destinationSuggestions = places)
    }
  }

  selectedOrigin(originId: string, origin: string) {
    this.originId = originId
    this.searchForm.controls['origin'].setValue(origin);
  }

  selectedDestination(destinationId: string, destination: string) {
    this.destinationId = destinationId;
    this.searchForm.controls['destination'].setValue(destination);
  }

  ngOnDestroy() {
  }

}
