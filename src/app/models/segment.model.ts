import { Place } from './place.model';

export class Segment {
  public Origin: Place;
  public Destination: Place;
  public Departure: Date;
  public Arrival: Date;
  public Duration: number;

  constructor(origin: Place, destination: Place, departure: Date, 
              arrival: Date, duration: number) {
    this.Origin = origin;
    this.Destination = destination;
    this.Departure = departure;
    this.Arrival = arrival;
    this.Duration = duration;
  }
}