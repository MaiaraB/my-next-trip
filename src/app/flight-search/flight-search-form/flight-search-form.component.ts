import { SearchParams } from '../../models/search-params.model';
import { SkyscannerPlace } from '../../models/skyscanner-place.model';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateParserFormatter, NgbPopoverConfig, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { TravelPlannerService } from './../../shared/travel-planner.service';
import { CabinClass } from './../../models/cabin-class.enum';
import { searchIntervalTooBig } from './../../shared/search-interval-too-big.directive';

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
  caller = 'from';

  searchForm: FormGroup;
  @Input() vertical: boolean;

  defaultStartingDay = '5';
  defaultDuration = '3';

  selectedRoundTrip: boolean = true;
  selectedOneWay: boolean = false;

  originTooSmall = true;
  destinationTooSmall = true;
  originSuggestions$: Observable<SkyscannerPlace[]>;
  private originText$ = new Subject<string>();
  destinationSuggestions$: Observable<SkyscannerPlace[]>;
  private destinationText$ = new Subject<string>();

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

  constructor(private fb: FormBuilder,
              private travelPlannerService: TravelPlannerService,
              private router: Router,
              private calendar: NgbCalendar,
              private ngbDateAdapter: NgbDateParserFormatter,
              private ngbPopoverConfig: NgbPopoverConfig,
              private ngbDatepickerConfig: NgbDatepickerConfig) {
    this.ngbPopoverConfig.popoverClass = 'popover-style';
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 30);
  }

  ngOnInit() {
    this.totalTravellers = 1;
    this.selectedClass = 'economy';
    this.originSuggestions$ = this.originText$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(originValue =>
        this.travelPlannerService.fetchPlaces(originValue))
    );
    this.destinationSuggestions$ = this.destinationText$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap(destinationValue => 
        this.travelPlannerService.fetchPlaces(destinationValue))
    );
    if (window.innerWidth < 768) {
      this.vertical = true;
      this.displayMonths = 1;
    }
    if (this.vertical) {
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
      this.fromDate = searchParams.fromDate;
      this.toDate = searchParams.toDate;
    }
    this.searchForm = this.fb.group({
      origin: [(searchParams!=null)?searchParams.origin:null, Validators.required],
      destination: [(searchParams!=null)?searchParams.destination:null, Validators.required],
      startingDay: [(searchParams!=null)?searchParams.startingDay:this.defaultStartingDay],
      duration: [(searchParams!=null)?searchParams.duration:this.defaultDuration],
      dates: this.fb.group({
        fromDate: [this.fromDate, Validators.required],
        toDate: [this.toDate, Validators.required]
      }, { validator: searchIntervalTooBig(this.calendar) }),
      adults: [(searchParams!=null)?searchParams.adults:this.travellerTypes.get('adults').defaultValue],
      children: [(searchParams!=null)?searchParams.children:this.travellerTypes.get('children').defaultValue],
      infants: [(searchParams!=null)?searchParams.infants:this.travellerTypes.get('infants').defaultValue],
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
          this.fromDate,
          this.toDate
        )
      );

      this.travelPlannerService.getFlights();
      this.router.navigate(['/search-result']);
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
      this.originText$.next(originValue);
    }
  }

  onDestinationChange(destionationValue : string ) {  
    if (destionationValue.length < 3) {
      this.destinationTooSmall = true;
    } else {
      this.destinationTooSmall = false
      this.destinationText$.next(destionationValue);
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

  decrementTravellers(travellerType: string) {
    const currentValue = this.searchForm.value[travellerType];
    if ((currentValue-1) >= this.travellerTypes.get(travellerType).minValue) {
      this.searchForm.patchValue({[travellerType]: currentValue-1});
      this.totalTravellers--;
    }
  }

  incrementTravellers(travellerType: string) {
    const currentValue = this.searchForm.value[travellerType];
    if ((currentValue+1) <= this.travellerTypes.get(travellerType).maxValue) {
      this.searchForm.patchValue({[travellerType]: currentValue+1});
      this.totalTravellers++;
    }
  }

  onSelectClass(selectedClass: string) {
    this.selectedClass = selectedClass;
  }

  toggleDatePicker(popover, caller: string) {
    this.caller = caller;
    popover.open({caller});
  }

  onDateSelection(popover, date: NgbDate) {
    if (this.caller === 'from') {
      this.fromDate = date;
      if (this.toDate.before(date)) {
        this.toDate = date;
      }
      this.caller = 'to';
    } else {
      if (date.before(this.fromDate)) {
        this.fromDate = date;
      } else {
        this.toDate = date;
        popover.close();
      }
    }
  }

  onDateHoveredIn(date: NgbDate) {
    this.hoveredDate = date;
    if (this.caller === 'to' && (date.after(this.fromDate) || date.equals(this.fromDate))) {
      this.searchForm.patchValue({ dates: { toDate: date } });
    } else {
      this.searchForm.patchValue({ dates: { fromDate: date } });
    }
  }

  onDateHoveredOut() {
    this.searchForm.patchValue({ dates: { fromDate: this.fromDate}});
    this.searchForm.patchValue({ dates: { toDate: this.toDate}});
  }

  isHovered(date: NgbDate) {
    const fromDate = this.searchForm.value.dates.fromDate;
    const toDate = this.searchForm.value.dates.toDate;
    return (fromDate && !toDate && this.hoveredDate && date.after(fromDate) && date.before(this.hoveredDate)) ||
           (toDate && !fromDate && this.hoveredDate && date.after(this.hoveredDate) && date.before(toDate));
  }

  isInside(date: NgbDate) {
    const fromDate = this.searchForm.value.dates.fromDate;
    const toDate = this.searchForm.value.dates.toDate;
    return date.after(fromDate) && date.before(toDate);
  }

  isRange(date: NgbDate) {
    const fromDate = this.searchForm.value.dates.fromDate;
    const toDate = this.searchForm.value.dates.toDate;
    return date.equals(fromDate) || date.equals(toDate) || this.isInside(date) || this.isHovered(date);
  }

  isOutside = (date: NgbDate) => {
    let fromDatePlusThreeMonths = this.calendar.getNext(this.fromDate, 'd', 90);
    return date.before(this.calendar.getToday()) || 
           (date.after(fromDatePlusThreeMonths) && this.caller === 'to');
  }

}
