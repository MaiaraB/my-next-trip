import { CabinClass } from './cabin-class.enum';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap';
export class SearchParams {
  public roundTrip: boolean;
  public origin: string;
  public originID: string;
  public destination: string;
  public destinationID: string;
  public startingDay: string;
  public duration: string;
  public adults: number;
  public children: number;
  public infants: number;
  public cabinClass: string;
  public fromDate: NgbDate;
  public toDate: NgbDate;

  constructor(roundTrip: boolean, origin: string, originID: string, destination: string, 
              destinationID: string, startingDay: string, duration: string,
              adults: number, children: number, infants: number, cabinClass: string,
              fromDate: NgbDate, toDate: NgbDate) {
    this.roundTrip = roundTrip;
    this.origin = origin;
    this.originID = originID;
    this.destination = destination;
    this.destinationID = destinationID;
    this.startingDay = startingDay;
    this.duration = duration;
    this.adults = adults;
    this.children = children;
    this.infants = infants
    this.cabinClass = cabinClass;
    this.fromDate = fromDate;
    this.toDate = toDate;
  }
}