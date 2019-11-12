import { AbstractControl } from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

/** the search date interval can't be bigger than three months */
export function searchIntervalTooBig(calendar: NgbCalendar) {
    return (control: AbstractControl): {[key: string]: any} | null => {
      let fromDate = control.value.fromDate;
      let toDate = control.value.toDate;
      let fromDatePlusThreeMonths = calendar.getNext(fromDate, 'd', 90);
      const forbidden = toDate.after(fromDatePlusThreeMonths);
      return forbidden ? {'searchingIntervalTooBig': true} : null;
    }
  }