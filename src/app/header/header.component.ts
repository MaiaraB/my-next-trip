import { Component, OnInit } from '@angular/core';

import { TravelPlannerService } from './../shared/travel-planner.service';
import { Country } from '../models/country.model';
import { Currency } from '../models/currency.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  loadedCountries: Country[] = [];
  loadedCurrencies: Currency[] = [];
  selectedCountry: string;
  selectedCurrency: string;

  constructor(private travelPlannerService: TravelPlannerService) {}

  ngOnInit() {
    this.travelPlannerService.fetchCountries().subscribe(countries => {
      this.loadedCountries = countries;
    });

    this.travelPlannerService.fetchCurrencies().subscribe(currencies => {
      this.loadedCurrencies = currencies;
    });

    var userLang = navigator.language;
    console.log("LANGUAGE: ", userLang);
    this.selectedCountry = this.travelPlannerService.getCurrentCountry();
    this.selectedCurrency = this.travelPlannerService.getCurrentCurrency();
  }

  selectCountry(country: string) {
    this.selectedCountry = country;
    this.travelPlannerService.changeCountry(country);
  }

  selectCurrency(currency: string) {
    this.selectedCurrency = currency;
    this.travelPlannerService.changeCurrency(currency);
  }
}