import { Component, OnInit } from '@angular/core';
// import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-flight-search-form',
  templateUrl: './flight-search-form.component.html',
  styleUrls: ['./flight-search-form.component.css']
})
export class FlightSearchFormComponent implements OnInit {
  // model: NgbDateStruct;

  constructor() { }

  ngOnInit() {
  }

  arrayDurationDays(n: number): any[] {
    return [...Array(n).keys()];
  }

}
