import { Component, OnInit, Input } from '@angular/core';

import { FlightResult } from './../../../shared/flight-result.model';

@Component({
  selector: 'app-search-result-item',
  templateUrl: './search-result-item.component.html',
  styleUrls: ['./search-result-item.component.css']
})
export class SearchResultItemComponent implements OnInit {

  @Input() flight: FlightResult;
  multiplePrices: boolean;
  moreThanTwoPrices: boolean;
  
  constructor() { }

  ngOnInit() {
    this.multiplePrices = (this.flight.AgentsInfo.length > 1);
    this.moreThanTwoPrices = (this.flight.AgentsInfo.length > 2);
  }

}
