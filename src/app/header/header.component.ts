import { Component, OnInit } from '@angular/core';

import { SkyscannerService } from './../shared/skyscanner.service';
import { Country } from '../shared/country.model';
import { Currency } from './../shared/currency.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  // collapsed = true;
  loadedCountries: Country[] = [];
  loadedCurrencies: Currency[] = [];

  constructor(private skyscannerService: SkyscannerService) {}

  ngOnInit() {
    this.skyscannerService.fetchCountries().subscribe(countries => {
      this.loadedCountries = countries;
      console.log(this.loadedCountries);
    });

    this.skyscannerService.fetchCurrencies().subscribe(currencies => {
      this.loadedCurrencies = currencies;
    });
  }
}