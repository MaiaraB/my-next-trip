import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { TravelPlannerService } from './shared/travel-planner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  progress: Observable<number>;
  
  constructor(private travelPlannerService: TravelPlannerService) {}

  ngOnInit(): void {
    this.progress = this.travelPlannerService.progress;
  }
}
