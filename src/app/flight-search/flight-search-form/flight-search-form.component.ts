import { SearchParams } from '../../models/search-params.model';
import { SkyscannerPlace } from '../../models/skyscanner-place.model';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbDateStruct, NgbDate, NgbCalendar, NgbDateParserFormatter, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';

import { TravelPlannerService } from './../../shared/travel-planner.service';
import { SkyscannerService } from 'src/app/shared/skyscanner.service';
import { CabinClass } from './../../models/cabin-class.enum';
import { config } from 'rxjs';

@Component({
  selector: 'app-flight-search-form',
  templateUrl: './flight-search-form.component.html',
  styleUrls: ['./flight-search-form.component.css']
})
export class FlightSearchFormComponent implements OnInit {
  fromDate: NgbDate;
  toDate: NgbDate;
  hoveredDate: NgbDate;
  displayMonths = 2;

  searchForm: FormGroup;
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

  totalTravellers: number;
  travellerTypes = new Map<string, {label: string, defaultValue: number, ageRange: string, minValue: number, maxValue: number}>();

  travellerPluralMapping: 
    {[k: string]: string} = {
      '=1' :  '1 adult',
      'other' : '# travellers'
    };

  selectedClass: string;
  keys = Object.keys;
  cabinClasses = CabinClass;

  constructor(private travelPlannerService: TravelPlannerService, 
              private skyscannerService: SkyscannerService,
              private router: Router,
              private calendar: NgbCalendar,
              private ngbDateAdapter: NgbDateParserFormatter,
              private ngbPopoverConfig: NgbPopoverConfig) {
    this.ngbPopoverConfig.popoverClass = 'popover-bigger-width';
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 30);
  }

  ngOnInit() {
    this.totalTravellers = 1;
    this.selectedClass = 'economy';
    this.originSuggestions = [];
    this.destinationSuggestions = [];
    if(window.innerWidth < 768) {
      this.vertical = true;
      this.displayMonths = 1;
    }

    this.travellerTypes.set('adults', {label: 'Adults', defaultValue: 1, ageRange: '', minValue: 1, maxValue: 8});
    this.travellerTypes.set('children', {label: 'Children', defaultValue: 0, ageRange: '1-16', minValue: 0, maxValue: 8});
    this.travellerTypes.set('infants', {label: 'Infants', defaultValue: 0, ageRange: 'under 1', minValue: 0, maxValue: 8});

    const searchParams = this.travelPlannerService.getSearchParams();
    if (searchParams != null) {
      this.originId = searchParams.originID;
      this.destinationId = searchParams.destinationID;
      this.selectedRoundTrip = searchParams.roundTrip;
      this.selectedOneWay = !searchParams.roundTrip;
      this.selectedClass = searchParams.cabinClass;
      this.totalTravellers = searchParams.adults + searchParams.children + searchParams.infants;
    }
    this.searchForm = new FormGroup({
      'origin': new FormControl((searchParams!=null)?searchParams.origin:null, Validators.required),
      'destination': new FormControl((searchParams!=null)?searchParams.destination:null, Validators.required),
      'startingDay': new FormControl((searchParams!=null)?searchParams.startingDay:this.defaultStartingDay),
      'duration': new FormControl((searchParams!=null)?searchParams.duration:this.defaultDuration),
      'fromDate': new FormControl((searchParams!=null)?searchParams.fromDate:this.ngbDateAdapter.format(this.fromDate), Validators.required),
      'toDate': new FormControl((searchParams!=null)?searchParams.toDate:this.ngbDateAdapter.format(this.toDate), Validators.required),
      'adults': new FormControl((searchParams!=null)?searchParams.adults:this.travellerTypes.get('adults').defaultValue),
      'children': new FormControl((searchParams!=null)?searchParams.children:this.travellerTypes.get('children').defaultValue),
      'infants': new FormControl((searchParams!=null)?searchParams.infants:this.travellerTypes.get('infants').defaultValue),
    });
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
          this.searchForm.value.origin,
          this.originId,
          this.searchForm.value.destination,
          this.destinationId,
          this.searchForm.value.startingDay, 
          this.searchForm.value.duration,
          this.searchForm.value.adults,
          this.searchForm.value.children,
          this.searchForm.value.infants,
          this.selectedClass,
          this.searchForm.value.fromDate,
          this.searchForm.value.toDate
        )
      );

      this.travelPlannerService.getFlights();
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

  onSelectOrigin(originId: string, origin: string) {
    this.originId = originId
    this.searchForm.controls['origin'].setValue(origin);
  }

  onSelectDestination(destinationId: string, destination: string) {
    this.destinationId = destinationId;
    this.searchForm.controls['destination'].setValue(destination);
  }

  arrayDurationDays(n: number): any[] {
    return [...Array(n).keys()];
  }

  decrement(travellerType: string) {
    const currentValue = this.searchForm.value[travellerType];
    if ((currentValue-1) >= this.travellerTypes.get(travellerType).minValue) {
      this.searchForm.patchValue({[travellerType]: currentValue-1});
      this.totalTravellers--;
    }
  }

  increment(travellerType: string) {
    const currentValue = this.searchForm.value[travellerType];
    if ((currentValue+1) <= this.travellerTypes.get(travellerType).maxValue) {
      this.searchForm.patchValue({[travellerType]: currentValue+1});
      this.totalTravellers++;
    }
  }

  onSelectClass(selectedClass: string) {
    this.selectedClass = selectedClass;
  }

  onDateSelection(date: NgbDate) {
    const dateStr = this.ngbDateAdapter.format(date);
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.searchForm.patchValue({fromDate: dateStr});
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.searchForm.patchValue({toDate: dateStr});
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.searchForm.patchValue({fromDate: dateStr});
    }
  }

  // onToDateSelection(date: NgbDate) {
  //   console.log(date);
  //   if (!this.fromDate && !this.toDate) {
  //     this.fromDate = date;
  //     this.searchForm.patchValue({fromDate: this.fromDate});
  //   } else if (this.fromDate && date.after(this.fromDate)) {
  //     this.toDate = date;
  //     this.searchForm.patchValue({toDate: this.toDate});
  //   } else {
  //     this.fromDate = date;
  //     this.searchForm.patchValue({fromDate: this.fromDate});
  //   }
  // }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

}
