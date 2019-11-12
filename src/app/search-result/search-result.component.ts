import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { TravelPlannerService } from './../shared/travel-planner.service';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  vertical: boolean;
  
  constructor(private travelPlannerService: TravelPlannerService) { }

  ngOnInit() {
    this.vertical = false;
    if(window.innerWidth < 768) {
      this.vertical = true;
    }
  }

}
