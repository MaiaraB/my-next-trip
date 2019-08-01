import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { TravelPlannerService } from './../shared/travel-planner.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  constructor(private travelPlannerService: TravelPlannerService) { }

  ngOnInit() {
  }

}
