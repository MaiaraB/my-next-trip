import { Component, OnInit, Input } from '@angular/core';
import { I18nPluralPipe } from '@angular/common';

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
  vertical: boolean;
  outboundNoStops: boolean;
  inboundNoStops: boolean;
  stopsPluralMapping: 
    {[k: string]: string} = {
      '=1' :  '1 stop',
      'other' : '# stops'
    };
  
  constructor() { }

  ngOnInit() {
    this.vertical = false;
    this.multiplePrices = (this.flight.AgentsInfo.length > 1);
    this.moreThanTwoPrices = (this.flight.AgentsInfo.length > 2);
    if(window.innerWidth < 768) {
      this.vertical = true;
    }
    this.outboundNoStops = false;
    if (this.flight.OutboundLeg.Stops.length == 0) {
      this.outboundNoStops = true;
    }
    this.inboundNoStops = false;
    if (this.flight.InboundLeg.Stops.length == 0) {
      this.inboundNoStops = true;
    }
  }

}
